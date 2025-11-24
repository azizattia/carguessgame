# Database & Leaderboard Troubleshooting Guide

## The Problem

Scores are being tracked correctly in the game (React closure bug fixed), but they're not saving to the Supabase database when playing from different computers. The leaderboard shows 0 scores for all users.

## Root Cause: Row Level Security (RLS) Policies

Supabase has a security feature called **Row Level Security (RLS)** that controls who can read/write data. Even though users are authenticated correctly, the RLS policies are blocking INSERT and UPDATE operations.

---

## How the Database Flow Works

### 1. User Authentication
```
User logs in → Supabase Auth creates session → user.id = "abc-123-def"
Session stored in browser (cookies/localStorage)
Same user.id across all devices when logged in
```

### 2. Score Saving Flow
```
Game Over (score = 2)
    ↓
App.jsx: handleDeclineRevive()
    ↓
storage.js: addScore(user.id, 2)
    ↓
Supabase: INSERT INTO scores (user_id, score) VALUES (...)
    ↓
RLS CHECK: Does auth.uid() = user_id?
    ↓
❌ BLOCKED (if policy is missing/wrong)
✅ ALLOWED (if policy is correct)
```

### 3. Leaderboard Retrieval Flow
```
Leaderboard component loads
    ↓
storage.js: getLeaderboard()
    ↓
Supabase: SELECT * FROM scores JOIN user_profiles
    ↓
RLS CHECK: Can authenticated user read scores?
    ↓
Returns data for leaderboard
```

---

## Why It Works on PC #1 but Not PC #2

**It's NOT about the computer or IP address!**

Both PCs have the same issue if:
1. RLS is enabled on the `scores` table ✅
2. But correct policies are NOT configured ❌

The symptoms:
- User authenticated successfully ✅
- Score tracked in game correctly (2, not 0) ✅
- Console shows: `💾 Attempting to save score: { userId: "...", score: 2 }` ✅
- Database operation fails silently ❌
- Error in console: `new row violates row-level security policy` ❌
- Leaderboard shows empty or all 0s ❌

---

## The Solution

### Step 1: Run the SQL Fix

1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `fix_rls_policies.sql`
5. Click **Run** (or press Ctrl+Enter)

This will:
- Drop all existing (incorrect) policies
- Create new correct policies:
  - `Users can insert own scores` - allows INSERT where auth.uid() = user_id
  - `Users can update own scores` - allows UPDATE where auth.uid() = user_id
  - `Anyone can read scores` - allows SELECT for all authenticated users

### Step 2: Verify the Fix

After running the SQL, test from any computer:

1. Open browser console (F12)
2. Play the game and lose (any score)
3. Look for these logs:
```
🔥 DECLINE REVIVE - Attempting to save score...
👤 User object: { id: "...", email: "..." }
📊 Final score to save: 2
🔑 User ID: abc-123-def-456
✅ User authenticated: true
💾 Attempting to save score: { userId: "...", score: 2 }
➕ Inserting new score... (or ⬆️ Updating to new high score...)
✅ Score inserted successfully: [...]
💫 Save result: { data: [...], error: null, isNewHighScore: true }
```

4. Check the leaderboard - your score should appear!

### Step 3: Verify Database Directly

In Supabase Dashboard:
1. Go to **Table Editor** → `scores` table
2. You should see your score row with:
   - `user_id`: your auth user ID
   - `score`: the score you just got
   - `created_at`: timestamp

---

## Understanding RLS Policies

### Policy Components

```sql
CREATE POLICY "policy_name"
ON table_name
FOR operation        -- INSERT, UPDATE, SELECT, DELETE
TO role             -- authenticated, anon, public
USING (condition)   -- Who can perform the operation
WITH CHECK (condition)  -- What data they can write
```

### Our Policies Explained

**INSERT Policy:**
```sql
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id)
```
- **FOR INSERT**: Only applies to inserting new rows
- **TO authenticated**: Only logged-in users
- **WITH CHECK**: Can only insert if auth.uid() matches the user_id they're trying to insert
- This prevents users from inserting scores for other users!

**UPDATE Policy:**
```sql
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```
- **USING**: Can only update rows where they are the owner
- **WITH CHECK**: Can only set values where they remain the owner
- This prevents users from updating other people's scores!

**SELECT Policy:**
```sql
FOR SELECT TO authenticated
USING (true)
```
- **USING (true)**: All authenticated users can read all rows
- Needed for the leaderboard to show everyone's scores!

---

## Common Issues & Solutions

### Issue: "policy already exists" error
**Solution:** Use `DROP POLICY IF EXISTS` first (included in fix_rls_policies.sql)

### Issue: Scores still not saving after running SQL
**Solution:**
1. Check console logs for specific error
2. Verify you ran the SQL in the correct project
3. Try logging out and back in
4. Clear browser cache

### Issue: Leaderboard is empty
**Solution:**
1. Check if RLS is enabled: `SELECT * FROM pg_tables WHERE tablename = 'scores'`
2. Verify SELECT policy exists and is correct
3. Check browser console for fetch errors

### Issue: Scores saving as 0
**Solution:** This is the React closure bug - already fixed in Game.jsx with `scoreRef`

---

## Testing Checklist

After applying the fix, test these scenarios:

- [ ] New user can save their first score
- [ ] Existing user can update their high score
- [ ] Score saves from Chrome browser
- [ ] Score saves from different browser (Firefox, Safari)
- [ ] Score saves from different computer (same user)
- [ ] Score saves from mobile device
- [ ] Leaderboard shows all users' scores
- [ ] Leaderboard updates in real-time after game

All should work! ✅

---

## Database Schema Reference

**scores table:**
```sql
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
```

**user_profiles table:**
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  coins INTEGER DEFAULT 0,
  unlocked_avatars JSONB DEFAULT '[]'::jsonb,
  current_avatar TEXT DEFAULT 'default'
);
```

---

## Support

If you're still experiencing issues:
1. Check browser console logs
2. Check Supabase logs (Dashboard → Logs)
3. Verify your authentication is working: `console.log(user)`
4. Check network tab for failed requests to Supabase
