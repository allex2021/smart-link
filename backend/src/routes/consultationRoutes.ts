import { Router, Request, Response } from 'express';
import { ConsultationService } from '../services/consultationService';
import { z } from 'zod';

const router = Router();

const RequestSessionSchema = z.object({
  userId: z.string().min(1),
  astrologerId: z.string().min(1),
  type: z.enum(['CHAT', 'AUDIO_CALL', 'VIDEO_CALL']),
  ratePerMinute: z.number().positive()
});

/**
 * @route POST /api/v1/consultations/request
 * @desc Request a consultation session with an astrologer
 */
router.post('/request', (req: Request, res: Response) => {
  try {
    const { userId, astrologerId, type, ratePerMinute } = RequestSessionSchema.parse(req.body);
    const session = ConsultationService.requestSession(userId, astrologerId, type, ratePerMinute);
    res.json({ success: true, message: 'Consultation request created', data: session });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/v1/consultations/:sessionId/accept
 * @desc Astrologer accepts consultation session
 */
router.post('/:sessionId/accept', (req: Request, res: Response) => {
  try {
    const session = ConsultationService.acceptSession(req.params.sessionId);
    res.json({ success: true, message: 'Session started', data: session });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/v1/consultations/:sessionId/end
 * @desc End active consultation session
 */
router.post('/:sessionId/end', (req: Request, res: Response) => {
  try {
    const session = ConsultationService.endSession(req.params.sessionId);
    res.json({ success: true, message: 'Session ended successfully', data: session });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/v1/consultations/:sessionId
 * @desc Get session details
 */
router.get('/:sessionId', (req: Request, res: Response) => {
  const session = ConsultationService.getSession(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Session not found' });
  }
  res.json({ success: true, data: session });
});

export default router;
