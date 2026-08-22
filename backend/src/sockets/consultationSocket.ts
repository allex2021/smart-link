import { Server, Socket } from 'socket.io';
import { ConsultationService } from '../services/consultationService';

export function setupConsultationSockets(io: Server) {
  const consultationNamespace = io.of('/consultation');

  consultationNamespace.on('connection', (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join user / astrologer private room
    socket.on('join_room', ({ roomId }) => {
      socket.join(roomId);
      console.log(`[Socket] ${socket.id} joined room: ${roomId}`);
    });

    // Real-time Chat message
    socket.on('send_message', ({ roomId, senderId, senderName, text }) => {
      const messagePayload = {
        id: `msg_${Date.now()}`,
        roomId,
        senderId,
        senderName,
        text,
        timestamp: new Date().toISOString()
      };
      consultationNamespace.to(roomId).emit('new_message', messagePayload);
    });

    // Live typing indicator
    socket.on('typing', ({ roomId, senderName, isTyping }) => {
      socket.to(roomId).emit('user_typing', { senderName, isTyping });
    });

    // Request session notification to astrologer
    socket.on('incoming_session_request', ({ astrologerId, sessionData }) => {
      consultationNamespace.to(`astro_${astrologerId}`).emit('session_requested', sessionData);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
}
