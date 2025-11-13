import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';
import Leaderboard from './components/Leaderboard';
import { addToLeaderboard, getUsername } from './utils/storage';

function App() {
  const [screen, setScreen] = useState('start'); // start, game, gameOver, leaderboard
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    // Check if user already has a username
    const username = getUsername();
    if (username) {
      // User can still see start screen but name is pre-filled
    }
  }, []);

  const handleStartGame = () => {
    setScreen('game');
  };

  const handleGameOver = (score) => {
    const username = getUsername();
    addToLeaderboard(username, score);
    setFinalScore(score);
    setScreen('gameOver');
  };

  const handlePlayAgain = () => {
    setScreen('game');
  };

  const handleShowLeaderboard = () => {
    setScreen('leaderboard');
  };

  const handleBackToStart = () => {
    setScreen('start');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <StartScreen
            key="start"
            onStart={handleStartGame}
            onShowLeaderboard={handleShowLeaderboard}
          />
        )}

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
            onBack={handleBackToStart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
