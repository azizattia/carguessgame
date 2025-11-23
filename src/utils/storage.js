import { supabase } from '../lib/supabase';

// Add a score to the database (only saves if it's a new high score)
export const addScore = async (userId, score) => {
  try {
    console.log('💾 Attempting to save score:', { userId, score });

    // Validate inputs
    if (!userId) {
      console.error('❌ No userId provided');
      return { data: null, error: 'No user ID provided', isNewHighScore: false };
    }

    if (!score || score === 0) {
      console.log('⚠️ Score is 0, not saving');
      return { data: null, error: null, isNewHighScore: false };
    }

    // First, get the user's current best score
    const { data: existingScore, error: fetchError } = await supabase
      .from('scores')
      .select('id, score')
      .eq('user_id', userId)
      .order('score', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('❌ Error fetching existing score:', fetchError);
      throw fetchError;
    }

    console.log('📊 Existing score:', existingScore);

    // If no existing score, insert new one
    if (!existingScore) {
      console.log('➕ Inserting new score...');
      const { data, error } = await supabase
        .from('scores')
        .insert([{ user_id: userId, score }])
        .select();

      if (error) {
        console.error('❌ Error inserting score:', error);
        throw error;
      }
      console.log('✅ Score inserted successfully:', data);
      return { data, error: null, isNewHighScore: true };
    }

    // If new score is better than existing best, update it
    if (score > existingScore.score) {
      console.log('⬆️ Updating to new high score...');
      const { data, error } = await supabase
        .from('scores')
        .update({ score, created_at: new Date().toISOString() })
        .eq('id', existingScore.id)
        .select();

      if (error) {
        console.error('❌ Error updating score:', error);
        throw error;
      }
      console.log('✅ Score updated successfully:', data);
      return { data, error: null, isNewHighScore: true };
    }

    // Score is not better, don't save
    console.log('📉 Score not better than existing, not saving');
    return { data: null, error: null, isNewHighScore: false };
  } catch (error) {
    console.error('❌ Error adding score:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return { data: null, error: error.message, isNewHighScore: false };
  }
};

// Get leaderboard from database
export const getLeaderboard = async () => {
  try {
    // Try RPC function first (if it exists)
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_leaderboard', { limit_count: 100 });

    if (!rpcError && rpcData) {
      return rpcData;
    }

    // Fallback: Direct query with fresh data (no cache)
    // This ensures we always get the latest scores from all users
    const { data, error } = await supabase
      .from('scores')
      .select(`
        score,
        user_id,
        user_profiles!inner (
          username
        )
      `)
      .order('score', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Transform data to match expected format
    const leaderboard = data.map(entry => ({
      high_score: entry.score,
      username: entry.user_profiles.username,
      user_id: entry.user_id,
      total_games: 1 // We'll just show 1 for now since we don't track this separately
    }));

    // Group by user and get their best score
    const userBestScores = {};
    leaderboard.forEach(entry => {
      if (!userBestScores[entry.user_id] || entry.high_score > userBestScores[entry.user_id].high_score) {
        userBestScores[entry.user_id] = entry;
      }
    });

    // Convert back to array and sort
    const finalLeaderboard = Object.values(userBestScores)
      .sort((a, b) => b.high_score - a.high_score)
      .slice(0, 100);

    return finalLeaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// Get user's personal best score
export const getUserBestScore = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', userId)
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data?.score || 0;
  } catch (error) {
    console.error('Error fetching user best score:', error);
    return 0;
  }
};

// Get user's recent games
export const getUserRecentGames = async (userId, limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('score, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent games:', error);
    return [];
  }
};

// Add coins to user account
export const addCoins = async (userId, coinsToAdd) => {
  try {
    const { data, error } = await supabase.rpc('update_user_coins', {
      user_uuid: userId,
      coins_to_add: coinsToAdd
    });

    if (error) throw error;
    return { newBalance: data, error: null };
  } catch (error) {
    console.error('Error adding coins:', error);
    return { newBalance: null, error: error.message };
  }
};

// Get user's coin balance
export const getCoinBalance = async (userId) => {
  try {
    const { data, error} = await supabase
      .from('user_profiles')
      .select('coins')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data?.coins || 0;
  } catch (error) {
    console.error('Error fetching coin balance:', error);
    return 0;
  }
};

// Unlock avatar (purchase with coins)
export const unlockAvatar = async (userId, avatarId, cost) => {
  try {
    const { data, error } = await supabase.rpc('unlock_avatar', {
      user_uuid: userId,
      avatar_id: avatarId,
      cost: cost
    });

    if (error) throw error;
    return { success: data, error: null };
  } catch (error) {
    console.error('Error unlocking avatar:', error);
    return { success: false, error: error.message };
  }
};

// Set current avatar
export const setCurrentAvatar = async (userId, avatarId) => {
  try {
    const { data, error } = await supabase.rpc('set_current_avatar', {
      user_uuid: userId,
      avatar_id: avatarId
    });

    if (error) throw error;
    return { success: data, error: null };
  } catch (error) {
    console.error('Error setting current avatar:', error);
    return { success: false, error: error.message };
  }
};

// Open chest (deduct coins and potentially add avatar/coins)
export const openChest = async (userId, chestPrice, rewardType, rewardData) => {
  try {
    // Start by deducting the chest price
    const { data: coinData, error: coinError } = await supabase.rpc('update_user_coins', {
      user_uuid: userId,
      coins_to_add: -chestPrice
    });

    if (coinError) throw coinError;

    // If reward is an avatar, unlock it
    if (rewardType === 'avatar' && rewardData.avatarId) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('unlocked_avatars')
        .eq('id', userId)
        .single();

      const updatedAvatars = [...(profile.unlocked_avatars || []), rewardData.avatarId];

      const { error: avatarError } = await supabase
        .from('user_profiles')
        .update({
          unlocked_avatars: updatedAvatars,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (avatarError) throw avatarError;
    }

    // If reward is coins, add them
    if (rewardType === 'coins' && rewardData.amount > 0) {
      const { error: rewardError } = await supabase.rpc('update_user_coins', {
        user_uuid: userId,
        coins_to_add: rewardData.amount
      });

      if (rewardError) throw rewardError;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error opening chest:', error);
    return { success: false, error: error.message };
  }
};

// ============ REFERRAL SYSTEM ============

// Generate a unique referral code for a user
export const generateReferralCode = async (userId, username) => {
  try {
    // Create a unique code based on username and random string
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `${username.substring(0, 4).toUpperCase()}${randomStr}`;

    // Check if user already has a referral code
    const { data: existing, error: checkError } = await supabase
      .from('referral_codes')
      .select('referral_code')
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    // If already has a code, return it
    if (existing) {
      return { code: existing.referral_code, error: null };
    }

    // Insert new referral code
    const { data, error } = await supabase
      .from('referral_codes')
      .insert([{ user_id: userId, referral_code: code }])
      .select()
      .single();

    if (error) throw error;
    return { code: data.referral_code, error: null };
  } catch (error) {
    console.error('Error generating referral code:', error);
    return { code: null, error: error.message };
  }
};

// Get user's referral code
export const getUserReferralCode = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('referral_codes')
      .select('referral_code')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return { code: data?.referral_code || null, error: null };
  } catch (error) {
    console.error('Error fetching referral code:', error);
    return { code: null, error: error.message };
  }
};

// Validate and apply a referral code when a new user signs up
export const applyReferralCode = async (referredUserId, referralCode) => {
  try {
    // Don't allow if they already used a referral code
    const { data: existingReferral, error: checkError } = await supabase
      .from('user_referrals')
      .select('id')
      .eq('referred_user_id', referredUserId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    if (existingReferral) {
      return { success: false, error: 'You have already used a referral code' };
    }

    // Find the referrer by code
    const { data: referralData, error: codeError } = await supabase
      .from('referral_codes')
      .select('user_id')
      .eq('referral_code', referralCode.toUpperCase())
      .maybeSingle();

    if (codeError) throw codeError;

    if (!referralData) {
      return { success: false, error: 'Invalid referral code' };
    }

    // Don't allow self-referral
    if (referralData.user_id === referredUserId) {
      return { success: false, error: 'You cannot use your own referral code' };
    }

    // Create the referral relationship
    const { error: insertError } = await supabase
      .from('user_referrals')
      .insert([{
        referrer_user_id: referralData.user_id,
        referred_user_id: referredUserId,
        reward_claimed: false
      }]);

    if (insertError) throw insertError;

    return { success: true, error: null, referrerId: referralData.user_id };
  } catch (error) {
    console.error('Error applying referral code:', error);
    return { success: false, error: error.message };
  }
};

// Check if user has reached level 15 and reward both users if needed
export const checkAndRewardReferral = async (userId, level) => {
  try {
    // Only trigger at level 15
    if (level !== 15) return { rewarded: false, error: null };

    // Check if this user was referred and hasn't been rewarded yet
    const { data: referralData, error: fetchError } = await supabase
      .from('user_referrals')
      .select('id, referrer_user_id, reward_claimed')
      .eq('referred_user_id', userId)
      .eq('reward_claimed', false)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    // No pending referral reward
    if (!referralData) {
      return { rewarded: false, error: null };
    }

    const REFERRAL_REWARD = 5000;

    // Give 5000 coins to the referred user (current user)
    const { error: refUserError } = await supabase.rpc('update_user_coins', {
      user_uuid: userId,
      coins_to_add: REFERRAL_REWARD
    });

    if (refUserError) throw refUserError;

    // Give 5000 coins to the referrer
    const { error: refererError } = await supabase.rpc('update_user_coins', {
      user_uuid: referralData.referrer_user_id,
      coins_to_add: REFERRAL_REWARD
    });

    if (refererError) throw refererError;

    // Mark the referral reward as claimed
    const { error: updateError } = await supabase
      .from('user_referrals')
      .update({
        reward_claimed: true,
        claimed_at: new Date().toISOString()
      })
      .eq('id', referralData.id);

    if (updateError) throw updateError;

    return { rewarded: true, error: null, amount: REFERRAL_REWARD };
  } catch (error) {
    console.error('Error checking and rewarding referral:', error);
    return { rewarded: false, error: error.message };
  }
};

// Get referral statistics for a user
export const getReferralStats = async (userId) => {
  try {
    // Get all successful referrals (people who used this user's code)
    const { data: referrals, error } = await supabase
      .from('user_referrals')
      .select(`
        id,
        referred_user_id,
        reward_claimed,
        created_at,
        claimed_at
      `)
      .eq('referrer_user_id', userId);

    if (error) throw error;

    const totalReferrals = referrals?.length || 0;
    const completedReferrals = referrals?.filter(r => r.reward_claimed).length || 0;
    const pendingReferrals = totalReferrals - completedReferrals;
    const totalEarned = completedReferrals * 5000;

    return {
      totalReferrals,
      completedReferrals,
      pendingReferrals,
      totalEarned,
      error: null
    };
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return {
      totalReferrals: 0,
      completedReferrals: 0,
      pendingReferrals: 0,
      totalEarned: 0,
      error: error.message
    };
  }
};
