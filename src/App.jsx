import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Game from './components/Game';
import GameOver from './components/GameOver';
import Leaderboard from './components/Leaderboard';
import AvatarShop from './components/AvatarShop';
import ChestShop from './components/ChestShop';
import CoinDisplay from './components/CoinDisplay';
import Avatar from './components/Avatar';
import { addScore } from './utils/storage';

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const [screen, setScreen] = useState('game'); // game, gameOver, leaderboard, avatarShop, chestShop
  const [finalScore, setFinalScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);

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
    setGameKey(prev => prev + 1); // Force Game component to remount
    setScreen('game');
  };

  const handleShowLeaderboard = () => {
    setScreen('leaderboard');
  };

  const handleShowAvatarShop = () => {
    setScreen('avatarShop');
  };

  const handleShowChestShop = () => {
    setScreen('chestShop');
  };

  const handleBackToGame = () => {
    // Just return to game (used by shops to preserve game state)
    setScreen('game');
  };

  const handleBackFromLeaderboard = () => {
    // Reset game when coming back from leaderboard to avoid stuck state
    setGameKey(prev => prev + 1);
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
      {/* Top bar - always visible (except in shops) */}
      {screen !== 'avatarShop' && screen !== 'chestShop' && (
        <>
          {/* Coin display */}
          <div className="fixed top-4 left-4 z-50">
            <CoinDisplay />
          </div>

          {/* Shop buttons */}
          <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3">
            <button
              onClick={handleShowAvatarShop}
              className="flex items-center gap-2 px-4 py-2 glass-effect rounded-lg border border-neon-purple/50
                       hover:border-neon-purple hover:shadow-neon-purple transition-all duration-300"
            >
              <Avatar avatarId={profile?.current_avatar || 1} size="sm" />
              <span className="text-sm font-semibold">Avatars</span>
            </button>

            <button
              onClick={handleShowChestShop}
              className="flex items-center gap-2 px-4 py-2 glass-effect rounded-lg border border-yellow-500/50
                       hover:border-yellow-500 hover:shadow-yellow-500/50 transition-all duration-300"
            >
              <span className="text-2xl">🎁</span>
              <span className="text-sm font-semibold">Chests</span>
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

      {/* Keep Game mounted to preserve state */}
      <div style={{ display: screen === 'game' ? 'block' : 'none' }}>
        <Game key={gameKey} onGameOver={handleGameOver} />
      </div>

      <AnimatePresence mode="wait">
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
            onBack={handleBackFromLeaderboard}
          />
        )}

        {screen === 'avatarShop' && (
          <AvatarShop
            key="avatarShop"
            onBack={handleBackToGame}
          />
        )}

        {screen === 'chestShop' && (
          <ChestShop
            key="chestShop"
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
