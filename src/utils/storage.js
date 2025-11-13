// LocalStorage utility functions

export const getUsername = () => {
  return localStorage.getItem('carGameUsername') || '';
};

export const setUsername = (username) => {
  localStorage.setItem('carGameUsername', username);
};

export const getLeaderboard = () => {
  const data = localStorage.getItem('carGameLeaderboard');
  return data ? JSON.parse(data) : [];
};

export const addToLeaderboard = (username, score) => {
  const leaderboard = getLeaderboard();
  leaderboard.push({ username, score, date: new Date().toISOString() });

  // Sort by score (descending) and keep top 10
  const sortedLeaderboard = leaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  localStorage.setItem('carGameLeaderboard', JSON.stringify(sortedLeaderboard));
  return sortedLeaderboard;
};

export const clearUsername = () => {
  localStorage.removeItem('carGameUsername');
};
