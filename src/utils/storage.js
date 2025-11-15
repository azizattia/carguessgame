import { supabase } from '../lib/supabase';

// Add a score to the database (only saves if it's a new high score)
export const addScore = async (userId, score) => {
  try {
    // First, get the user's current best score
    const { data: existingScore, error: fetchError } = await supabase
      .from('scores')
      .select('id, score')
      .eq('user_id', userId)
      .order('score', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    // If no existing score, insert new one
    if (!existingScore) {
      const { data, error } = await supabase
        .from('scores')
        .insert([{ user_id: userId, score }])
        .select();

      if (error) throw error;
      return { data, error: null, isNewHighScore: true };
    }

    // If new score is better than existing best, update it
    if (score > existingScore.score) {
      const { data, error } = await supabase
        .from('scores')
        .update({ score, created_at: new Date().toISOString() })
        .eq('id', existingScore.id)
        .select();

      if (error) throw error;
      return { data, error: null, isNewHighScore: true };
    }

    // Score is not better, don't save
    return { data: null, error: null, isNewHighScore: false };
  } catch (error) {
    console.error('Error adding score:', error);
    return { data: null, error: error.message, isNewHighScore: false };
  }
};

// Get leaderboard from database
export const getLeaderboard = async () => {
  try {
    const { data, error } = await supabase.rpc('get_leaderboard', { limit_count: 100 });

    if (error) throw error;
    return data || [];
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
