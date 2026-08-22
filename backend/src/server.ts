import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app';
import { setupConsultationSockets } from './sockets/consultationSocket';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupConsultationSockets(io);

server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`✨ AstroTalk Backend Server running on port ${PORT}`);
  console.log(`🚀 Health Check: http://localhost:${PORT}/health`);
  console.log(`🪐 Astrology API: http://localhost:${PORT}/api/v1/astrology/kundli`);
  console.log(`🔮 Astrologers:   http://localhost:${PORT}/api/v1/astrologers`);
  console.log(`💳 Wallet API:    http://localhost:${PORT}/api/v1/wallet/user_123`);
  console.log(`=========================================`);
});
