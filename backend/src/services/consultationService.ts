import { WalletService } from './walletService';
import { AgoraService } from './agoraService';

export interface ConsultationSession {
  id: string;
  userId: string;
  astrologerId: string;
  type: 'CHAT' | 'AUDIO_CALL' | 'VIDEO_CALL';
  ratePerMinute: number;
  channelName: string;
  status: 'REQUESTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  startedAt?: Date;
  endedAt?: Date;
  durationMinutes: number;
  totalCharged: number;
  agoraTokenUser?: string;
  agoraTokenAstrologer?: string;
}

const activeSessions = new Map<string, ConsultationSession>();
const sessionTimers = new Map<string, NodeJS.Timeout>();

export class ConsultationService {
  /**
   * Request a new consultation session
   */
  public static requestSession(userId: string, astrologerId: string, type: 'CHAT' | 'AUDIO_CALL' | 'VIDEO_CALL', ratePerMinute: number): ConsultationSession {
    if (!WalletService.canStartSession(userId, ratePerMinute)) {
      throw new Error(`Insufficient wallet balance. Please recharge at least ₹${ratePerMinute * 2}`);
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(5)}`;
    const channelName = `astro_ch_${sessionId}`;

    const userToken = AgoraService.generateConsultationToken(channelName, userId);
    const astroToken = AgoraService.generateConsultationToken(channelName, astrologerId);

    const session: ConsultationSession = {
      id: sessionId,
      userId,
      astrologerId,
      type,
      ratePerMinute,
      channelName,
      status: 'REQUESTED',
      durationMinutes: 0,
      totalCharged: 0,
      agoraTokenUser: userToken.token,
      agoraTokenAstrologer: astroToken.token
    };

    activeSessions.set(sessionId, session);
    return session;
  }

  /**
   * Astrologer accepts session and starts real-time per-minute ticker
   */
  public static acceptSession(sessionId: string, onMinuteTick?: (remainingBalance: number) => void, onAutoDisconnect?: () => void): ConsultationSession {
    const session = activeSessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    session.status = 'ACTIVE';
    session.startedAt = new Date();

    // Start 60-second ticker interval
    const timer = setInterval(() => {
      const deduction = WalletService.deductMinute(session.userId, session.astrologerId, session.ratePerMinute);
      
      if (deduction.success) {
        session.durationMinutes += 1;
        session.totalCharged += session.ratePerMinute;
        if (onMinuteTick) onMinuteTick(deduction.remainingBalance);
      } else {
        // Insufficient funds -> Auto terminate
        this.endSession(sessionId);
        if (onAutoDisconnect) onAutoDisconnect();
      }
    }, 60000); // 1 minute interval

    sessionTimers.set(sessionId, timer);
    return session;
  }

  /**
   * End Consultation Session
   */
  public static endSession(sessionId: string): ConsultationSession {
    const session = activeSessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const timer = sessionTimers.get(sessionId);
    if (timer) {
      clearInterval(timer);
      sessionTimers.delete(sessionId);
    }

    session.status = 'COMPLETED';
    session.endedAt = new Date();
    return session;
  }

  public static getSession(sessionId: string): ConsultationSession | undefined {
    return activeSessions.get(sessionId);
  }
}
