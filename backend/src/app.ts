import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import astrologyRoutes from './routes/astrologyRoutes';
import astrologerRoutes from './routes/astrologerRoutes';
import walletRoutes from './routes/walletRoutes';
import consultationRoutes from './routes/consultationRoutes';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'Astrotalk API & Engine',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/astrology', astrologyRoutes);
app.use('/api/v1/astrologers', astrologerRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/consultations', consultationRoutes);

export default app;
