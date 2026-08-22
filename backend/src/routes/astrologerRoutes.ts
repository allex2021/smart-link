import { Router, Request, Response } from 'express';

const router = Router();

// Mock Astrologers Directory
const astrologers = [
  {
    id: 'astro_101',
    name: 'Acharya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    skills: ['Vedic Astrology', 'Kundli', 'Vastu'],
    languages: ['Hindi', 'English'],
    experienceYears: 12,
    chatRatePerMin: 20,
    callRatePerMin: 25,
    rating: 4.9,
    totalConsultations: 3420,
    isOnline: true
  },
  {
    id: 'astro_102',
    name: 'Tarot Reader Priya',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    skills: ['Tarot Card Reading', 'Love & Relationships', 'Numerology'],
    languages: ['English', 'Hindi', 'Punjabi'],
    experienceYears: 8,
    chatRatePerMin: 15,
    callRatePerMin: 20,
    rating: 4.85,
    totalConsultations: 2150,
    isOnline: true
  },
  {
    id: 'astro_103',
    name: 'Pandit Raghavan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    skills: ['KP Astrology', 'Career & Finance', 'Remedies'],
    languages: ['Tamil', 'Telugu', 'English', 'Hindi'],
    experienceYears: 18,
    chatRatePerMin: 35,
    callRatePerMin: 40,
    rating: 4.95,
    totalConsultations: 8900,
    isOnline: false
  }
];

/**
 * @route GET /api/v1/astrologers
 * @desc Get list of astrologers with filters
 */
router.get('/', (req: Request, res: Response) => {
  const { onlineOnly } = req.query;
  let results = astrologers;
  if (onlineOnly === 'true') {
    results = results.filter((a) => a.isOnline);
  }
  res.json({ success: true, count: results.length, data: results });
});

/**
 * @route GET /api/v1/astrologers/:id
 * @desc Get astrologer profile details
 */
router.get('/:id', (req: Request, res: Response) => {
  const astrologer = astrologers.find((a) => a.id === req.params.id);
  if (!astrologer) {
    return res.status(404).json({ success: false, error: 'Astrologer not found' });
  }
  res.json({ success: true, data: astrologer });
});

export default router;
