-- Car Guess Game - Fix RLS Policies for Scores Table
-- Run this in Supabase SQL Editor

-- Step 1: Check current policies (for reference)
-- Uncomment this to see what policies exist:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'scores';

-- Step 2: Drop ALL existing policies on scores table
DROP POLICY IF EXISTS "Users can insert own scores" ON scores;
DROP POLICY IF EXISTS "Users can update own scores" ON scores;
DROP POLICY IF EXISTS "Anyone can read scores" ON scores;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON scores;
DROP POLICY IF EXISTS "Enable read access for all users" ON scores;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON scores;

-- Step 3: Create correct policies

-- Allow authenticated users to INSERT their own scores
CREATE POLICY "Users can insert own scores"
ON scores
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to UPDATE their own scores
CREATE POLICY "Users can update own scores"
ON scores
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow everyone (authenticated users) to READ all scores (for leaderboard)
CREATE POLICY "Anyone can read scores"
ON scores
FOR SELECT
TO authenticated
USING (true);

-- Step 4: Verify the policies were created
-- Uncomment to verify:
-- SELECT policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'scores';
