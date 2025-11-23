import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { chests, openAvatarChest, openCoinChest, getChestProbabilities } from '../data/chests';
import { openChest } from '../utils/storage';

const ChestShop = ({ onBack }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [selectedChest, setSelectedChest] = useState(null);
  const [openingChest, setOpeningChest] = useState(false);
  const [result, setResult] = useState(null);

  const handleOpenChest = async (chest) => {
    if (!user || openingChest) return;

    // Check if enough coins
    if (profile?.coins < chest.price) {
      setResult({
        error: true,
        message: 'Not enough coins!',
        emoji: '😢'
      });
      setTimeout(() => setResult(null), 2000);
      return;
    }

    setOpeningChest(true);
    setSelectedChest(chest);

    // Simulate opening animation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Determine reward
    let reward;
    if (chest.type === 'avatar') {
      reward = openAvatarChest(profile?.unlocked_avatars || []);
    } else {
      reward = openCoinChest();
    }

    // Process reward in database
    const rewardData = {};
    let rewardType = 'nothing';

    if (reward.type === 'avatar' && reward.avatar) {
      rewardType = 'avatar';
      rewardData.avatarId = reward.avatar.id;
    } else if (reward.type === 'coins' && reward.amount > 0) {
      rewardType = 'coins';
      rewardData.amount = reward.amount;
    }

    const { success } = await openChest(user.id, chest.price, rewardType, rewardData);

    if (success) {
      await refreshProfile();
      setResult(reward);
    } else {
      setResult({
        error: true,
        message: 'Something went wrong!',
        emoji: '❌'
      });
    }

    setOpeningChest(false);
    setTimeout(() => {
      setResult(null);
      setSelectedChest(null);
    }, 4000);
  };

  const renderProbabilities = (chestType) => {
    const probabilities = getChestProbabilities(chestType);

    return (
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-bold text-neon-blue mb-2">Drop Rates:</h4>
        {probabilities.map((prob, index) => (
          <div key={index} className="flex justify-between text-xs text-gray-400">
            <span>{prob.label || `${prob.coins?.toLocaleString()} coins`}</span>
            <span className="text-neon-purple">{prob.probability}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0f0f0f] p-4 overflow-y-auto z-40"
    >
      {/* Opening Animation Overlay */}
      <AnimatePresence>
        {openingChest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 10, 0]
              }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-9xl"
            >
              {selectedChest?.emoji}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Display */}
      <AnimatePresence>
        {result && !openingChest && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              className={`glass-effect rounded-2xl p-8 max-w-md w-full border-2 ${
                result.error ? 'border-red-500' : result.success ? 'border-green-500' : 'border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-8xl mb-4">{result.emoji}</div>
                <h2 className={`text-3xl font-bold mb-2 ${
                  result.error ? 'text-red-400' : result.success ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {result.message}
                </h2>
                {result.avatar && (
                  <div className="mt-4">
                    <div className="text-6xl mb-2">{result.avatar.emoji}</div>
                    <p className="text-xl text-neon-purple font-bold">{result.avatar.name}</p>
                    <p className="text-sm text-gray-400 capitalize">Rarity: {result.rarity}</p>
                  </div>
                )}
                {result.type === 'coins' && result.amount > 0 && (
                  <div className="text-2xl text-yellow-400 font-bold mt-4">
                    +{result.amount.toLocaleString()} 🪙
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="mb-6 px-6 py-3 glass-effect rounded-lg border border-neon-blue/50
                   hover:border-neon-blue hover:shadow-neon-blue transition-all duration-300"
        >
          ← Back
        </motion.button>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-neon-blue glow-text">Mystery</span>{' '}
            <span className="text-neon-purple glow-text">Chests</span>
          </h1>
          <p className="text-xl text-gray-400">
            Try your luck and win amazing rewards!
          </p>
        </motion.div>

        {/* Chests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {chests.map((chest, index) => {
            const colors = chest.color;

            return (
              <motion.div
                key={chest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`glass-effect rounded-2xl p-6 border-2 ${colors.border} ${colors.glow}
                         transition-all duration-300 hover:scale-105`}
              >
                {/* Chest Icon */}
                <div className="text-8xl mb-4 text-center">{chest.emoji}</div>

                {/* Chest Name */}
                <h2 className={`text-3xl font-bold text-center mb-2 ${colors.text}`}>
                  {chest.name}
                </h2>

                {/* Description */}
                <p className="text-center text-gray-400 mb-4">{chest.description}</p>

                {/* Price */}
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-yellow-400">
                    🪙 {chest.price.toLocaleString()}
                  </span>
                </div>

                {/* Probabilities */}
                {renderProbabilities(chest.type)}

                {/* Open Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOpenChest(chest)}
                  disabled={openingChest || profile?.coins < chest.price}
                  className={`w-full mt-6 py-3 rounded-lg font-bold text-lg
                           ${colors.bg} border-2 ${colors.border} ${colors.text}
                           hover:${colors.glow} transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {openingChest ? 'OPENING...' : 'OPEN CHEST'}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Current Balance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400">Your Balance:</p>
          <p className="text-3xl font-bold text-yellow-400">
            🪙 {profile?.coins?.toLocaleString() || 0}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChestShop;
