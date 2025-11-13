import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getLeaderboard } from '../utils/storage';
import { playClickSound } from '../utils/sounds';

const Leaderboard = ({ onBack }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  const handleBack = () => {
    playClickSound();
    onBack();
  };

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 flex items-center justify-center"
    >
      <div className="max-w-3xl w-full">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl font-bold text-center mb-4 glow-text text-neon-purple"
        >
          🏆 Leaderboard
        </motion.h1>

        <motion.p
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-center mb-8 text-gray-400"
        >
          Top 10 Players
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-2xl p-6 md:p-8 shadow-neon-purple mb-8"
        >
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl text-gray-400 mb-4">No scores yet!</p>
              <p className="text-lg text-gray-500">Be the first to set a record!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`glass-effect rounded-xl p-4 flex items-center justify-between
                           border-2 ${
                             index === 0
                               ? 'border-yellow-400/50 shadow-lg shadow-yellow-400/20'
                               : index === 1
                               ? 'border-gray-300/50 shadow-lg shadow-gray-300/20'
                               : index === 2
                               ? 'border-orange-400/50 shadow-lg shadow-orange-400/20'
                               : 'border-neon-blue/20'
                           } hover:border-neon-blue/60 transition-all duration-300`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-3xl font-bold w-12 text-center">
                      {getMedalEmoji(index)}
                    </span>

                    <div className="flex-1">
                      <p className="text-xl font-bold text-neon-blue truncate">
                        {entry.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-neon-purple glow-text">
                      {entry.score}
                    </p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="w-full py-4 text-xl font-bold glass-effect rounded-xl
                   border-2 border-neon-blue/50 hover:border-neon-blue hover:shadow-neon-blue
                   transition-all duration-300"
        >
          ← Back
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
