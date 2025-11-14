import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Game from './components/Game';
import GameOver from './components/GameOver';
import Leaderboard from './components/Leaderboard';
import AvatarShop from './components/AvatarShop';
import CoinDisplay from './components/CoinDisplay';
import Avatar from './components/Avatar';
import { addScore } from './utils/storage';

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const [screen, setScreen] = useState('game'); // game, gameOver, leaderboard, avatarShop
  const [finalScore, setFinalScore] = useState(0);

  const handleStartGame = () => {
    setScreen('game');
  };

  const handleGameOver = async (score) => {
    // Save score to database
    if (user) {
      await addScore(user.id, score);
    }
    setFinalScore(score);
    setScreen('gameOver');
  };

  const handlePlayAgain = () => {
    setScreen('game');
  };

  const handleShowLeaderboard = () => {
    setScreen('leaderboard');
  };

  const handleShowAvatarShop = () => {
    setScreen('avatarShop');
  };

  const handleBackToGame = () => {
    setScreen('game');
  };

  const handleLogout = async () => {
    await signOut();
    setScreen('game');
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-neon-blue glow-text">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login/register screen
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <AnimatePresence mode="wait">
          {screen === 'leaderboard' ? (
            <Leaderboard key="leaderboard" onBack={() => setScreen('game')} />
          ) : (
            <Auth key="auth" onShowLeaderboard={handleShowLeaderboard} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // If authenticated, show game
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Top bar - always visible (except in avatar shop) */}
      {screen !== 'avatarShop' && (
        <>
          {/* Coin display */}
          <div className="fixed top-4 left-4 z-50">
            <CoinDisplay />
          </div>

          {/* Avatar button */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3">
            <button
              onClick={handleShowAvatarShop}
              className="flex items-center gap-2 px-4 py-2 glass-effect rounded-lg border border-neon-purple/50
                       hover:border-neon-purple hover:shadow-neon-purple transition-all duration-300"
            >
              <Avatar avatarId={profile?.current_avatar || 1} size="sm" />
              <span className="text-sm font-semibold">Shop</span>
            </button>
          </div>

          {/* Logout button */}
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={handleLogout}
              className="px-4 py-2 glass-effect rounded-lg border border-neon-pink/50
                       hover:border-neon-pink hover:shadow-neon-pink transition-all duration-300
                       text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        {screen === 'game' && (
          <Game
            key="game"
            onGameOver={handleGameOver}
          />
        )}

        {screen === 'gameOver' && (
          <GameOver
            key="gameOver"
            score={finalScore}
            onPlayAgain={handlePlayAgain}
            onShowLeaderboard={handleShowLeaderboard}
          />
        )}

        {screen === 'leaderboard' && (
          <Leaderboard
            key="leaderboard"
            onBack={handleBackToGame}
          />
        )}

        {screen === 'avatarShop' && (
          <AvatarShop
            key="avatarShop"
            onBack={handleBackToGame}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
