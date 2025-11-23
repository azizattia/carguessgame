import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { playClickSound } from '../utils/sounds';

const GameOver = ({ score, isNewHighScore, onPlayAgain, onShowLeaderboard }) => {
  const { profile } = useAuth();

  const handlePlayAgain = () => {
    playClickSound();
    onPlayAgain();
  };

  const handleLeaderboard = () => {
    playClickSound();
    onShowLeaderboard();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="text-center mb-6 md:mb-8"
        >
          <h1 className="text-4xl md:text-8xl font-bold text-red-400 glow-text mb-3 md:mb-4">
            GAME OVER
          </h1>
          <p className="text-lg md:text-2xl text-gray-400">Better luck next time!</p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-2xl p-6 md:p-12 shadow-neon-purple mb-6 md:mb-8"
        >
          <div className="text-center mb-6 md:mb-8">
            <p className="text-gray-400 text-sm md:text-lg mb-1 md:mb-2">Player</p>
            <p className="text-2xl md:text-3xl font-bold text-neon-blue glow-text mb-4 md:mb-6">{profile?.username}</p>

            <p className="text-gray-400 text-sm md:text-lg mb-1 md:mb-2">Final Score</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.5 }}
              className="text-5xl md:text-7xl font-bold text-neon-purple glow-text"
            >
              {score}
            </motion.p>

            {/* New High Score Badge */}
            {isNewHighScore && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.8, bounce: 0.6 }}
                className="mt-3 md:mt-4"
              >
                <div className="inline-block px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full border-2 border-yellow-300 shadow-lg">
                  <p className="text-lg md:text-2xl font-black text-white flex items-center gap-2">
                    <span className="text-2xl md:text-3xl">🏆</span>
                    <span className="text-sm md:text-base">NEW HIGH SCORE!</span>
                    <span className="text-2xl md:text-3xl">🏆</span>
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {score > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-gray-400 mb-6 md:mb-8"
            >
              <p className="text-base md:text-lg">
                {score >= 20 && '🏆 Outstanding! You\'re a car price expert!'}
                {score >= 15 && score < 20 && '🎖️ Excellent performance!'}
                {score >= 10 && score < 15 && '🌟 Great job!'}
                {score >= 5 && score < 10 && '👍 Good effort!'}
                {score < 5 && '💪 Keep practicing!'}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="space-y-3 md:space-y-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayAgain}
              className="w-full py-3 md:py-4 text-lg md:text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple
                       rounded-xl shadow-neon-blue hover:shadow-neon-purple transition-all duration-300"
            >
              🎮 Play Again
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLeaderboard}
              className="w-full py-3 md:py-4 text-lg md:text-xl font-bold glass-effect rounded-xl
                       border-2 border-neon-purple/50 hover:border-neon-purple hover:shadow-neon-purple
                       transition-all duration-300"
            >
              🏆 View Leaderboard
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GameOver;
