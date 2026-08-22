import { Router, Request, Response } from 'express';
import { AstrologyEngine } from '../services/astrologyEngine';
import { z } from 'zod';

const router = Router();

const BirthDetailsSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezoneOffsetHours: z.number().optional().default(5.5)
});

/**
 * @route POST /api/v1/astrology/kundli
 * @desc Generate Vedic Kundli (Birth Chart, Lagna, Planetary Degrees, Houses)
 */
router.post('/kundli', (req: Request, res: Response) => {
  try {
    const validatedData = BirthDetailsSchema.parse(req.body);
    const kundli = AstrologyEngine.generateKundli(validatedData);
    res.json({ success: true, data: kundli });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/v1/astrology/matchmaking
 * @desc 36 Guna Milan Horoscope Compatibility
 */
router.post('/matchmaking', (req: Request, res: Response) => {
  try {
    const { boySignIdx, boyNakshatraIdx, girlSignIdx, girlNakshatraIdx } = req.body;
    const match = AstrologyEngine.calculateGunaMilan(
      boySignIdx || 1,
      boyNakshatraIdx || 1,
      girlSignIdx || 1,
      girlNakshatraIdx || 1
    );
    res.json({ success: true, data: match });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
