import { useState } from 'react';
import { motion } from 'framer-motion';
import { setUsername } from '../utils/storage';
import { playClickSound } from '../utils/sounds';

const StartScreen = ({ onStart, onShowLeaderboard }) => {
  const [name, setName] = useState('');

  const handleStart = () => {
    if (name.trim()) {
      playClickSound();
      setUsername(name.trim());
      onStart();
    }
  };

  const handleLeaderboard = () => {
    playClickSound();
    onShowLeaderboard();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-3 sm:p-4"
    >
      <div className="max-w-2xl w-full">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-center mb-3 sm:mb-4 glow-text text-neon-blue"
        >
          Car Price Challenge
        </motion.h1>

        <motion.p
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl text-center mb-6 sm:mb-8 md:mb-12 text-neon-purple glow-text"
        >
          Higher or Lower?
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-effect rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-neon-blue"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 text-center">Enter Your Name</h2>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            placeholder="Your name..."
            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-black/50 border-2 border-neon-blue/30 rounded-xl
                     focus:border-neon-blue focus:outline-none focus:shadow-neon-blue
                     transition-all duration-300 mb-4 sm:mb-6"
            autoFocus
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            disabled={!name.trim()}
            className="w-full py-3 sm:py-4 text-lg sm:text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple
                     rounded-xl shadow-neon-blue hover:shadow-neon-purple transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Game
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLeaderboard}
            className="w-full mt-3 sm:mt-4 py-3 sm:py-4 text-lg sm:text-xl font-bold glass-effect rounded-xl
                     border-2 border-neon-purple/50 hover:border-neon-purple hover:shadow-neon-purple
                     transition-all duration-300"
          >
            View Leaderboard
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-gray-400"
        >
          <p className="text-sm">
            🎮 Guess if the next car is more or less expensive!
          </p>
          <p className="text-sm mt-2">
            🎯 Bonus rounds every 5 levels!
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StartScreen;
