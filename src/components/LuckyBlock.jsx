import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound, playCorrectSound, playWrongSound, playBonusSound } from '../utils/sounds';

const LuckyBlock = ({ onOpen, onSkip }) => {
  const [isShaking, setIsShaking] = useState(true);

  const handleOpen = () => {
    playBonusSound();
    setIsShaking(false);
    setTimeout(() => onOpen(), 500);
  };

  const handleSkip = () => {
    playClickSound();
    onSkip();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-effect rounded-3xl p-8 md:p-12 max-w-md w-full text-center border-4 border-yellow-500/50 shadow-2xl"
      >
        <motion.div
          animate={isShaking ? {
            rotate: [0, -5, 5, -5, 5, 0],
            scale: [1, 1.05, 1, 1.05, 1]
          } : {}}
          transition={{
            repeat: isShaking ? Infinity : 0,
            duration: 0.5
          }}
          className="mb-6"
        >
          <div className="text-8xl mb-4 filter drop-shadow-lg">
            🎁
          </div>
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5
            }}
            className="text-yellow-400 text-2xl font-bold mb-2"
          >
            ✨ LUCKY BLOCK! ✨
          </motion.div>
        </motion.div>

        <p className="text-xl text-gray-300 mb-8">
          A mysterious block appeared!<br />
          <span className="text-sm text-gray-400 mt-2 block">
            Open it for a surprise... or skip it to play safe!
          </span>
        </p>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="w-full py-4 text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500
                     rounded-xl shadow-lg hover:shadow-yellow-500/50 transition-all duration-300
                     border-2 border-yellow-400"
          >
            🎁 OPEN IT!
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkip}
            className="w-full py-3 text-lg font-semibold glass-effect rounded-xl
                     border-2 border-gray-500/50 hover:border-gray-400 transition-all duration-300"
          >
            ⏭️ Skip & Continue
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const LuckyBlockResult = ({ outcome, onContinue }) => {
  const isGood = outcome.type === 'good';
  const isBad = outcome.type === 'bad';

  const handleContinue = () => {
    if (isGood) {
      playCorrectSound();
    } else if (isBad) {
      playWrongSound();
    } else {
      playClickSound();
    }
    onContinue();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className={`glass-effect rounded-3xl p-8 md:p-12 max-w-md w-full text-center border-4 shadow-2xl
          ${isGood ? 'border-green-500/50 shadow-green-500/20' : ''}
          ${isBad ? 'border-red-500/50 shadow-red-500/20' : ''}
          ${!isGood && !isBad ? 'border-gray-500/50' : ''}`}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-6"
        >
          <div className="text-9xl mb-4 filter drop-shadow-lg">
            {outcome.emoji}
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${
            isGood ? 'text-green-400' : isBad ? 'text-red-400' : 'text-gray-400'
          }`}>
            {outcome.title}
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-300 mb-8"
        >
          {outcome.description}
        </motion.p>

        {/* Effect details */}
        {outcome.effect.type !== 'none' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className={`mb-6 p-4 rounded-xl border-2 ${
              isGood ? 'bg-green-500/10 border-green-500/30' :
              isBad ? 'bg-red-500/10 border-red-500/30' :
              'bg-gray-500/10 border-gray-500/30'
            }`}
          >
            <p className="text-lg font-semibold">
              {outcome.effect.type === 'coins' && (
                <span className={outcome.effect.value > 0 ? 'text-yellow-400' : 'text-red-400'}>
                  {outcome.effect.value > 0 ? '+' : ''}{outcome.effect.value} Coins
                </span>
              )}
              {outcome.effect.type === 'extra_life' && (
                <span className="text-pink-400">Extra Life Activated!</span>
              )}
              {outcome.effect.type === 'skip_level' && (
                <span className="text-blue-400">+{outcome.effect.value} Level!</span>
              )}
              {outcome.effect.type === 'coin_multiplier' && (
                <span className={outcome.effect.value > 1 ? 'text-green-400' : 'text-orange-400'}>
                  {outcome.effect.value}x Coins for {outcome.effect.duration} rounds
                </span>
              )}
              {outcome.effect.type === 'price_hint' && (
                <span className="text-purple-400">Next price range revealed!</span>
              )}
              {outcome.effect.type === 'reverse_controls' && (
                <span className="text-red-400">Controls reversed next round!</span>
              )}
              {outcome.effect.type === 'level_penalty' && (
                <span className="text-orange-400">{outcome.effect.value} Levels</span>
              )}
              {outcome.effect.type === 'hide_price' && (
                <span className="text-red-400">Current price hidden!</span>
              )}
              {outcome.effect.type === 'random_swap' && (
                <span className="text-purple-400">Score and Level swapped!</span>
              )}
            </p>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className={`w-full py-4 text-xl font-bold rounded-xl shadow-lg transition-all duration-300 border-2
            ${isGood ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-400 hover:shadow-green-500/50' : ''}
            ${isBad ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-400 hover:shadow-red-500/50' : ''}
            ${!isGood && !isBad ? 'bg-gradient-to-r from-gray-600 to-gray-700 border-gray-500 hover:shadow-gray-500/50' : ''}`}
        >
          Continue Playing
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default LuckyBlock;
