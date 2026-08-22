-- Production PostgreSQL Schema for AstroTalk Clone

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    gender VARCHAR(10),
    date_of_birth DATE,
    time_of_birth TIME,
    place_of_birth VARCHAR(150),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Astrologers
CREATE TYPE verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE availability_status AS ENUM ('ONLINE', 'BUSY', 'OFFLINE');

CREATE TABLE IF NOT EXISTS astrologers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    bio TEXT,
    languages TEXT[],
    skills TEXT[],
    experience_years INT DEFAULT 0,
    chat_rate_per_min DECIMAL(10, 2) NOT NULL,
    call_rate_per_min DECIMAL(10, 2) NOT NULL,
    commission_percentage DECIMAL(5, 2) DEFAULT 20.00,
    status verification_status DEFAULT 'PENDING',
    availability availability_status DEFAULT 'OFFLINE',
    rating_avg DECIMAL(3, 2) DEFAULT 5.00,
    total_reviews INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Wallets
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(12, 2) DEFAULT 0.00 CHECK (balance >= 0.00),
    currency VARCHAR(5) DEFAULT 'INR',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Transactions Ledger
CREATE TYPE transaction_type AS ENUM ('RECHARGE', 'CONSULTATION_DEBIT', 'EARNING_CREDIT', 'WITHDRAWAL', 'REFUND');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id),
    amount DECIMAL(10, 2) NOT NULL,
    type transaction_type NOT NULL,
    status transaction_status DEFAULT 'PENDING',
    reference_id VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Consultation Sessions
CREATE TYPE consultation_type AS ENUM ('CHAT', 'AUDIO_CALL', 'VIDEO_CALL');
CREATE TYPE session_status AS ENUM ('REQUESTED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'FAILED');

CREATE TABLE IF NOT EXISTS consultation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    astrologer_id UUID REFERENCES astrologers(id),
    type consultation_type NOT NULL,
    rate_per_minute DECIMAL(10, 2) NOT NULL,
    channel_name VARCHAR(100) UNIQUE,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    total_duration_seconds INT DEFAULT 0,
    total_amount_deducted DECIMAL(10, 2) DEFAULT 0.00,
    astrologer_earnings DECIMAL(10, 2) DEFAULT 0.00,
    platform_commission DECIMAL(10, 2) DEFAULT 0.00,
    status session_status DEFAULT 'REQUESTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
