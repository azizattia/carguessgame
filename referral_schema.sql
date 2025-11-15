-- Referral System Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Table to store referral codes for each user
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Index for faster code lookups
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);

-- Table to track who referred whom
CREATE TABLE IF NOT EXISTS user_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  claimed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(referred_user_id),
  CHECK (referrer_user_id != referred_user_id)
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_referrals_referrer ON user_referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_referred ON user_referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_reward_claimed ON user_referrals(reward_claimed);

-- Enable Row Level Security
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referral_codes
-- Users can read all referral codes (needed to validate codes)
CREATE POLICY "Anyone can read referral codes"
  ON referral_codes FOR SELECT
  USING (true);

-- Users can only insert their own referral code
CREATE POLICY "Users can insert their own referral code"
  ON referral_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_referrals
-- Users can read referrals where they are either the referrer or referred
CREATE POLICY "Users can read their own referrals"
  ON user_referrals FOR SELECT
  USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

-- Users can insert referrals where they are the referred user
CREATE POLICY "Users can insert themselves as referred"
  ON user_referrals FOR INSERT
  WITH CHECK (auth.uid() = referred_user_id);

-- Only the system can update referral rewards (via service role)
CREATE POLICY "System can update referral rewards"
  ON user_referrals FOR UPDATE
  USING (true);
