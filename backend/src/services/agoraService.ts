import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

export class AgoraService {
  private static appId = process.env.AGORA_APP_ID || 'mock_agora_app_id';
  private static appCertificate = process.env.AGORA_APP_CERTIFICATE || 'mock_agora_app_cert';

  /**
   * Generates a secure RTC token for an audio or video consultation channel
   */
  public static generateConsultationToken(channelName: string, uid: string | number, isPublisher: boolean = true) {
    const role = isPublisher ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const expirationTimeInSeconds = 7200; // 2 hours
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // In local dev without credentials, provide fallback token
    if (this.appId === 'mock_agora_app_id' || !process.env.AGORA_APP_ID) {
      return {
        token: `mock_agora_token_${channelName}_${uid}_${Date.now()}`,
        channelName,
        appId: this.appId,
        uid
      };
    }

    const token = RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channelName,
      typeof uid === 'number' ? uid : 0,
      role,
      privilegeExpiredTs
    );

    return {
      token,
      channelName,
      appId: this.appId,
      uid
    };
  }
}
