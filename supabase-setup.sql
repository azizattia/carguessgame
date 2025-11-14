-- ============================================
-- Car Price Challenge - Database Setup (Updated)
-- ============================================
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Drop existing user_profiles table and recreate with email
DROP TABLE IF EXISTS public.scores CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Create user_profiles table with email, coins, and avatars
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  coins INTEGER DEFAULT 0 NOT NULL,
  current_avatar INTEGER DEFAULT 1 NOT NULL,
  unlocked_avatars INTEGER[] DEFAULT ARRAY[1],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create scores table
CREATE TABLE public.scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for user_profiles

-- Allow users to read all profiles (for leaderboard)
CREATE POLICY "Anyone can view user profiles"
  ON public.user_profiles
  FOR SELECT
  USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- 5. Create RLS Policies for scores

-- Allow users to read all scores (for leaderboard)
CREATE POLICY "Anyone can view all scores"
  ON public.scores
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own scores
CREATE POLICY "Authenticated users can insert their own scores"
  ON public.scores
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. Create indexes for better performance
CREATE INDEX idx_scores_user_id ON public.scores(user_id);
CREATE INDEX idx_scores_score ON public.scores(score DESC);
CREATE INDEX idx_scores_created_at ON public.scores(created_at DESC);
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);

-- 7. Create a function to get the leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  username TEXT,
  high_score INTEGER,
  total_games INTEGER,
  last_played TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    up.username,
    MAX(s.score) as high_score,
    COUNT(s.id)::INTEGER as total_games,
    MAX(s.created_at) as last_played
  FROM public.user_profiles up
  LEFT JOIN public.scores s ON s.user_id = up.id
  WHERE s.score IS NOT NULL
  GROUP BY up.id, up.username
  ORDER BY high_score DESC, last_played DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Update trigger to save email along with username
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, email, coins, current_avatar, unlocked_avatars)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    0,
    1,
    ARRAY[1]
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 9. Create a function to update user coins
CREATE OR REPLACE FUNCTION update_user_coins(user_uuid UUID, coins_to_add INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  UPDATE public.user_profiles
  SET coins = coins + coins_to_add,
      updated_at = NOW()
  WHERE id = user_uuid
  RETURNING coins INTO new_balance;

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create functions for avatar system
CREATE OR REPLACE FUNCTION unlock_avatar(user_uuid UUID, avatar_id INTEGER, cost INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  user_coins INTEGER;
  already_unlocked BOOLEAN;
BEGIN
  -- Check if user has enough coins
  SELECT coins INTO user_coins FROM public.user_profiles WHERE id = user_uuid;

  IF user_coins < cost THEN
    RETURN FALSE;
  END IF;

  -- Check if avatar is already unlocked
  SELECT avatar_id = ANY(unlocked_avatars) INTO already_unlocked
  FROM public.user_profiles WHERE id = user_uuid;

  IF already_unlocked THEN
    RETURN FALSE;
  END IF;

  -- Unlock avatar and deduct coins
  UPDATE public.user_profiles
  SET unlocked_avatars = array_append(unlocked_avatars, avatar_id),
      coins = coins - cost,
      updated_at = NOW()
  WHERE id = user_uuid;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION set_current_avatar(user_uuid UUID, avatar_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  is_unlocked BOOLEAN;
BEGIN
  -- Check if avatar is unlocked
  SELECT avatar_id = ANY(unlocked_avatars) INTO is_unlocked
  FROM public.user_profiles WHERE id = user_uuid;

  IF NOT is_unlocked THEN
    RETURN FALSE;
  END IF;

  -- Set current avatar
  UPDATE public.user_profiles
  SET current_avatar = avatar_id,
      updated_at = NOW()
  WHERE id = user_uuid;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Setup Complete!
-- ============================================
-- Note: Passwords are securely stored by Supabase Auth (encrypted)
-- They are NOT and SHOULD NOT be stored in user_profiles table
-- Emails are now saved in user_profiles for easy access
-- Coins system: Users start with 0 coins and earn them through gameplay
-- Avatar system: Users start with avatar #1 (free common) and can unlock 19 more
-- ============================================
