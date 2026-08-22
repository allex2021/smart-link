# AstroTalk Backend & Astrology Consultation Engine

Production-grade backend service for an Astrotalk-like Astrology & Real-time Consultation Platform built with **TypeScript, Node.js, Express, Socket.io, and Agora RTC**.

---

## 🌟 Key Features

1. **Vedic Astrology Engine**:
   - Computes **Ascendant (Lagna)**, **Planetary Degrees** (Lahiri Sidereal Ayanamsha), **Rashi**, **Nakshatra**, **Pada**, and **12 Houses**.
   - **36 Guna Milan** (Ashtakoota Matchmaking compatibility score).
2. **Real-time Consultation & RTC**:
   - Agora Audio/Video channel token generation.
   - Low-latency WebSocket room for live chat and typing indicators.
3. **Wallet & Per-Minute Micro-Billing**:
   - Atomic per-minute deduction ticker.
   - Auto-disconnect on low balance.
   - Astrologer earnings ledger with platform commission cuts.

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`.

---

## 🧪 Testing the APIs (cURL Examples)

### 1. Generate Kundli (Birth Chart)
```bash
curl -X POST http://localhost:5000/api/v1/astrology/kundli \
  -H "Content-Type: application/json" \
  -d '{
    "year": 1998,
    "month": 5,
    "day": 15,
    "hour": 14,
    "minute": 30,
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timezoneOffsetHours": 5.5
  }'
```

### 2. Check Astrologer Directory
```bash
curl http://localhost:5000/api/v1/astrologers?onlineOnly=true
```

### 3. Check Wallet Balance
```bash
curl http://localhost:5000/api/v1/wallet/user_101
```

### 4. Recharge Wallet
```bash
curl -X POST http://localhost:5000/api/v1/wallet/recharge \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_101",
    "amount": 200,
    "paymentRef": "pay_mock_123"
  }'
```

### 5. Request a Consultation Session (with Agora RTC Tokens)
```bash
curl -X POST http://localhost:5000/api/v1/consultations/request \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_101",
    "astrologerId": "astro_101",
    "type": "AUDIO_CALL",
    "ratePerMinute": 25
  }'
```
