import { supabase } from '../lib/supabase';

// Add a score to the database
export const addScore = async (userId, score) => {
  try {
    const { data, error } = await supabase
      .from('scores')
      .insert([{ user_id: userId, score }])
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding score:', error);
    return { data: null, error: error.message };
  }
};

// Get leaderboard from database
export const getLeaderboard = async () => {
  try {
    const { data, error } = await supabase.rpc('get_leaderboard', { limit_count: 10 });

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
