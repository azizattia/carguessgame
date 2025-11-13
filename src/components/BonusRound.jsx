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
  username
}) => {
  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            textShadow: [
              '0 0 20px #bf00ff',
              '0 0 40px #bf00ff',
              '0 0 20px #bf00ff'
            ]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-4xl md:text-5xl font-bold text-neon-purple mb-4"
        >
          🎯 BONUS ROUND! 🎯
        </motion.div>

        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="text-left">
            <p className="text-gray-400 text-sm">Player</p>
            <p className="text-xl font-bold text-neon-blue glow-text">{username}</p>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">Level</p>
            <motion.p
              key={level}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-neon-purple glow-text"
            >
              {level}
            </motion.p>
          </div>

          <div className="text-right relative">
            <p className="text-gray-400 text-sm">Score</p>
            <p className="text-xl font-bold text-neon-pink glow-text">{score}</p>

            <AnimatePresence>
              {showScoreAnimation && (
                <motion.div
                  initial={{ y: 0, opacity: 1, scale: 1 }}
                  animate={{ y: -30, opacity: 0, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-0 right-0 text-2xl font-bold text-green-400"
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
        className="glass-effect max-w-md mx-auto rounded-2xl p-6 mb-8 border-2 border-neon-pink shadow-neon-pink"
      >
        <p className="text-center text-lg mb-2 text-gray-300">Which car is closer to:</p>
        <p className="text-center text-4xl font-bold text-neon-pink glow-text">
          ${targetPrice.toLocaleString()}
        </p>
      </motion.div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Car 1 */}
          <div>
            <CarCard car={car1} showPrice={showResult} label="Car Option 1" isRevealing={showResult} />
            {!showResult && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onGuess('first')}
                className="w-full mt-4 px-8 py-4 text-xl font-bold bg-gradient-to-r from-neon-blue to-cyan-500
                         rounded-xl shadow-lg hover:shadow-neon-blue transition-all duration-300
                         border-2 border-neon-blue/50"
              >
                👈 Choose This Car
              </motion.button>
            )}
          </div>

          {/* Car 2 */}
          <div>
            <CarCard car={car2} showPrice={showResult} label="Car Option 2" isRevealing={showResult} />
            {!showResult && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onGuess('second')}
                className="w-full mt-4 px-8 py-4 text-xl font-bold bg-gradient-to-r from-neon-purple to-purple-500
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
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 0.5 }}
              className={`text-8xl font-bold ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              } glow-text`}
            >
              {isCorrect ? '✓ CORRECT!' : '✗ WRONG!'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BonusRound;
