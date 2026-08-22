import { Router, Request, Response } from 'express';
import { WalletService } from '../services/walletService';
import { z } from 'zod';

const router = Router();

const RechargeSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().positive(),
  paymentRef: z.string().optional().default('upi_mock_ref')
});

/**
 * @route GET /api/v1/wallet/:userId
 * @desc Get wallet balance
 */
router.get('/:userId', (req: Request, res: Response) => {
  const wallet = WalletService.getWallet(req.params.userId);
  res.json({ success: true, data: wallet });
});

/**
 * @route POST /api/v1/wallet/recharge
 * @desc Recharge wallet balance
 */
router.post('/recharge', (req: Request, res: Response) => {
  try {
    const { userId, amount, paymentRef } = RechargeSchema.parse(req.body);
    const wallet = WalletService.rechargeWallet(userId, amount, paymentRef);
    res.json({ success: true, message: `Recharged ₹${amount} successfully`, data: wallet });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/v1/wallet/:userId/transactions
 * @desc Get wallet transaction history
 */
router.get('/:userId/transactions', (req: Request, res: Response) => {
  const history = WalletService.getHistory(req.params.userId);
  res.json({ success: true, count: history.length, data: history });
});

export default router;
