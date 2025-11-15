import { motion, AnimatePresence } from 'framer-motion';
import CarCard from './CarCard';

const BonusRound = ({
  car1,
  car2,
  targetPrice,
  level,
  score,
  showResult,
  isCorrect,
  onGuess,
  showScoreAnimation,
  showCoinAnimation,
  coinsEarned,
  username
}) => {
  return (
    <div className="min-h-screen p-2 md:p-4 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-3 md:mb-6 overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            textShadow: [
              '0 0 20px #bf00ff',
              '0 0 40px #bf00ff',
              '0 0 20px #bf00ff'
            ]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-2xl md:text-5xl font-bold text-neon-purple mb-2 md:mb-4"
        >
          🎯 BONUS ROUND! 🎯
        </motion.div>

        <div className="flex justify-between items-start md:items-center max-w-4xl mx-auto gap-2 md:gap-4">
          <div className="text-left flex-shrink-0">
            <p className="text-gray-400 text-xs md:text-sm">Player</p>
            <p className="text-sm md:text-xl font-bold text-neon-blue glow-text truncate max-w-[80px] md:max-w-none">{username}</p>
          </div>

          <div className="text-center flex-shrink-0">
            <p className="text-gray-400 text-xs md:text-sm">Level</p>
            <motion.p
              key={level}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl md:text-3xl font-bold text-neon-purple glow-text"
            >
              {level}
            </motion.p>
          </div>

          <div className="text-right relative flex-shrink-0">
            <p className="text-gray-400 text-xs md:text-sm">Score</p>
            <p className="text-sm md:text-xl font-bold text-neon-pink glow-text">{score}</p>

            <AnimatePresence>
              {showScoreAnimation && (
                <motion.div
                  initial={{ y: 0, opacity: 1, scale: 1 }}
                  animate={{ y: -30, opacity: 0, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-0 right-0 text-lg md:text-2xl font-bold text-green-400"
                >
                  +1
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Target Price */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="glass-effect max-w-md mx-auto rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-8 border-2 border-neon-pink shadow-neon-pink"
      >
        <p className="text-center text-sm md:text-lg mb-1 md:mb-2 text-gray-300">Which car is closer to:</p>
        <p className="text-center text-2xl md:text-4xl font-bold text-neon-pink glow-text">
          ${targetPrice.toLocaleString()}
        </p>
      </motion.div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center px-2">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
          {/* Car 1 */}
          <div>
            <CarCard key={car1.id} car={car1} showPrice={showResult} label="Car Option 1" isRevealing={showResult} />
            {!showResult && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onGuess('first')}
                className="w-full mt-3 md:mt-4 px-4 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold bg-gradient-to-r from-neon-blue to-cyan-500
                         rounded-xl shadow-lg hover:shadow-neon-blue transition-all duration-300
                         border-2 border-neon-blue/50"
              >
                👈 Choose This Car
              </motion.button>
            )}
          </div>

          {/* Car 2 */}
          <div>
            <CarCard key={car2.id} car={car2} showPrice={showResult} label="Car Option 2" isRevealing={showResult} />
            {!showResult && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onGuess('second')}
                className="w-full mt-3 md:mt-4 px-4 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold bg-gradient-to-r from-neon-purple to-purple-500
                         rounded-xl shadow-lg hover:shadow-neon-purple transition-all duration-300
                         border-2 border-neon-purple/50"
              >
                👉 Choose This Car
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Result Animation */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4"
          >
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 0.5 }}
                className={`text-4xl md:text-8xl font-bold ${
                  isCorrect ? 'text-green-400' : 'text-red-400'
                } glow-text text-center`}
              >
                {isCorrect ? '✓ CORRECT!' : '✗ WRONG!'}
              </motion.div>

              {/* Coin Earned Animation */}
              {isCorrect && showCoinAnimation && (
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex flex-col md:flex-row items-center gap-2 text-2xl md:text-3xl font-bold text-yellow-400 glow-text text-center"
                >
                  <div className="flex items-center gap-2">
                    <span>🪙</span>
                    <span>+{coinsEarned}</span>
                  </div>
                  <span className="text-lg md:text-2xl text-neon-pink">(BONUS!)</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BonusRound;
