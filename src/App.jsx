import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Game from './components/Game';
import GameOver from './components/GameOver';
import Leaderboard from './components/Leaderboard';
import AvatarShop from './components/AvatarShop';
import ChestShop from './components/ChestShop';
import ReferralSystem from './components/ReferralSystem';
import ReviveScreen from './components/ReviveScreen';
import WatchAdButton from './components/WatchAdButton';
import CoinDisplay from './components/CoinDisplay';
import Avatar from './components/Avatar';
import { addScore, addCoins } from './utils/storage';
import { useAds } from './hooks/useAds';

function AppContent() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const { showInterstitialAd } = useAds();
  const [screen, setScreen] = useState('game'); // game, gameOver, leaderboard, avatarShop, chestShop, referrals, revive
  const [finalScore, setFinalScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [reviveCount, setReviveCount] = useState(0);

  const handleStartGame = () => {
    setScreen('game');
  };

  const handleGameOver = async (score) => {
    // Save score to database (only if it's a new high score)
    let newHighScore = false;
    if (user) {
      const result = await addScore(user.id, score);
      newHighScore = result.isNewHighScore || false;
    }
    setFinalScore(score);
    setIsNewHighScore(newHighScore);
    setScreen('gameOver');
  };

  const handlePlayAgain = () => {
    setGameKey(prev => prev + 1); // Force Game component to remount
    setReviveCount(0); // Reset revive count for new game
    setScreen('game');
  };

  const handleReviveNeeded = (score) => {
    setFinalScore(score);
    setScreen('revive');
  };

  const handleRevive = async () => {
    // Get revive cost based on current revive count
    const getReviveCost = (count) => {
      switch (count) {
        case 0: return 1000;
        case 1: return 5000;
        case 2: return 10000;
        default: return null;
      }
    };

    const cost = getReviveCost(reviveCount);
    if (!cost || !user) return;

    // Deduct coins
    await addCoins(user.id, -cost);
    await refreshProfile();

    // Increment revive count and continue game
    setReviveCount(prev => prev + 1);
    setScreen('game');
  };

  const handleDeclineRevive = async () => {
    // Show interstitial ad on game over
    showInterstitialAd(async () => {
      // After ad closes, save score and show game over
      let newHighScore = false;
      if (user) {
        const result = await addScore(user.id, finalScore);
        newHighScore = result.isNewHighScore || false;
      }
      setIsNewHighScore(newHighScore);
      setReviveCount(0); // Reset for next game
      setScreen('gameOver');
    });
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

  const handleShowReferrals = () => {
    setScreen('referrals');
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
      {screen !== 'avatarShop' && screen !== 'chestShop' && screen !== 'referrals' && (
        <>
          {/* Coin display */}
          <div className="fixed top-2 md:top-4 left-2 md:left-4 z-50">
            <CoinDisplay />
          </div>

          {/* Shop buttons */}
          <div className="fixed bottom-2 md:bottom-4 left-2 md:left-4 z-50 flex items-center gap-2 md:gap-3 flex-wrap max-w-[280px] md:max-w-none">
            <button
              onClick={handleShowAvatarShop}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 glass-effect rounded-lg border border-neon-purple/50
                       hover:border-neon-purple hover:shadow-neon-purple transition-all duration-300"
            >
              <Avatar avatarId={profile?.current_avatar || 1} size="sm" />
              <span className="text-xs md:text-sm font-semibold">Avatars</span>
            </button>

            <button
              onClick={handleShowChestShop}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 glass-effect rounded-lg border border-yellow-500/50
                       hover:border-yellow-500 hover:shadow-yellow-500/50 transition-all duration-300"
            >
              <span className="text-xl md:text-2xl">🎁</span>
              <span className="text-xs md:text-sm font-semibold">Chests</span>
            </button>

            <button
              onClick={handleShowReferrals}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 glass-effect rounded-lg border border-neon-blue/50
                       hover:border-neon-blue hover:shadow-neon-blue transition-all duration-300"
            >
              <span className="text-xl md:text-2xl">🎁</span>
              <span className="text-xs md:text-sm font-semibold">Referrals</span>
            </button>

            {/* Watch Ad Button */}
            <WatchAdButton rewardAmount={2000} />
          </div>

          {/* Logout button */}
          <div className="fixed top-2 md:top-4 right-2 md:right-4 z-50">
            <button
              onClick={handleLogout}
              className="px-3 md:px-4 py-1.5 md:py-2 glass-effect rounded-lg border border-neon-pink/50
                       hover:border-neon-pink hover:shadow-neon-pink transition-all duration-300
                       text-xs md:text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </>
      )}

      {/* Keep Game mounted to preserve state */}
      <div style={{ display: screen === 'game' ? 'block' : 'none' }}>
        <Game
          key={gameKey}
          onGameOver={handleGameOver}
          onReviveNeeded={handleReviveNeeded}
          reviveCount={reviveCount}
        />
      </div>

      <AnimatePresence mode="wait">
        {screen === 'gameOver' && (
          <GameOver
            key="gameOver"
            score={finalScore}
            isNewHighScore={isNewHighScore}
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

        {screen === 'referrals' && (
          <ReferralSystem
            key="referrals"
            onBack={handleBackToGame}
          />
        )}

        {screen === 'revive' && (
          <ReviveScreen
            key="revive"
            score={finalScore}
            reviveCount={reviveCount}
            onRevive={handleRevive}
            onDecline={handleDeclineRevive}
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
