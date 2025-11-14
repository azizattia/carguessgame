import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { avatars, RARITY_COLORS, getRarityInfo } from '../data/avatars';
import { unlockAvatar, setCurrentAvatar } from '../utils/storage';

const AvatarShop = ({ onBack }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [purchaseMessage, setPurchaseMessage] = useState(null);

  const handlePurchase = async (avatar) => {
    if (!user) return;

    // Check if already unlocked
    if (profile?.unlocked_avatars?.includes(avatar.id)) {
      setPurchaseMessage({ type: 'error', text: 'Already unlocked!' });
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    // Check if enough coins
    if (profile?.coins < avatar.price) {
      setPurchaseMessage({ type: 'error', text: 'Not enough coins!' });
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    // Purchase avatar
    const { success } = await unlockAvatar(user.id, avatar.id, avatar.price);

    if (success) {
      setPurchaseMessage({ type: 'success', text: `Unlocked ${avatar.name}!` });
      await refreshProfile();

      // Auto-equip the new avatar
      await setCurrentAvatar(user.id, avatar.id);
      await refreshProfile();

      setTimeout(() => setPurchaseMessage(null), 2000);
    } else {
      setPurchaseMessage({ type: 'error', text: 'Purchase failed!' });
      setTimeout(() => setPurchaseMessage(null), 2000);
    }
  };

  const handleEquip = async (avatar) => {
    if (!user) return;

    const { success } = await setCurrentAvatar(user.id, avatar.id);

    if (success) {
      setPurchaseMessage({ type: 'success', text: `Equipped ${avatar.name}!` });
      await refreshProfile();
      setTimeout(() => setPurchaseMessage(null), 2000);
    }
  };

  const filteredAvatars = selectedRarity === 'all'
    ? avatars
    : avatars.filter(a => a.rarity === selectedRarity);

  const rarityFilters = ['all', 'common', 'rare', 'epic', 'legendary', 'matrix'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0f0f0f] p-4"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto">
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
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-neon-blue glow-text">Avatar</span>{' '}
            <span className="text-neon-purple glow-text">Shop</span>
          </h1>
          <p className="text-xl text-gray-400">
            Customize your profile with unique avatars
          </p>
        </motion.div>

        {/* Rarity Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {rarityFilters.map((rarity) => (
            <motion.button
              key={rarity}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedRarity(rarity)}
              className={`px-6 py-2 rounded-full border-2 transition-all duration-300 ${
                selectedRarity === rarity
                  ? 'bg-neon-blue/30 border-neon-blue text-neon-blue shadow-neon-blue'
                  : 'glass-effect border-gray-600/30 text-gray-400 hover:border-gray-500'
              }`}
            >
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Purchase Message */}
        <AnimatePresence>
          {purchaseMessage && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg border-2 ${
                purchaseMessage.type === 'success'
                  ? 'bg-green-500/20 border-green-500 text-green-400'
                  : 'bg-red-500/20 border-red-500 text-red-400'
              }`}
            >
              {purchaseMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAvatars.map((avatar, index) => {
            const isUnlocked = profile?.unlocked_avatars?.includes(avatar.id);
            const isEquipped = profile?.current_avatar === avatar.id;
            const colors = RARITY_COLORS[avatar.rarity];
            const rarityInfo = getRarityInfo(avatar.rarity);

            return (
              <motion.div
                key={avatar.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-effect rounded-2xl p-4 border-2 ${colors.border} ${
                  isEquipped ? colors.glow : ''
                } transition-all duration-300 hover:scale-105`}
              >
                {/* Rarity Badge */}
                <div className={`inline-block px-2 py-1 rounded-full text-xs mb-2 ${colors.bg} ${colors.text} ${colors.border} border`}>
                  {rarityInfo.label}
                </div>

                {/* Avatar Icon */}
                <div className="text-7xl mb-3 text-center">
                  {avatar.emoji}
                </div>

                {/* Avatar Name */}
                <h3 className={`text-lg font-bold mb-1 text-center ${colors.text}`}>
                  {avatar.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-400 text-center mb-3 min-h-[2.5rem]">
                  {avatar.description}
                </p>

                {/* Action Button */}
                {isEquipped ? (
                  <div className="w-full py-2 text-center rounded-lg bg-green-500/20 border-2 border-green-500 text-green-400 font-bold">
                    ✓ EQUIPPED
                  </div>
                ) : isUnlocked ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEquip(avatar)}
                    className={`w-full py-2 rounded-lg ${colors.bg} border-2 ${colors.border} ${colors.text} font-bold
                             hover:${colors.glow} transition-all duration-300`}
                  >
                    EQUIP
                  </motion.button>
                ) : avatar.price === 0 ? (
                  <div className="w-full py-2 text-center rounded-lg bg-neon-blue/20 border-2 border-neon-blue text-neon-blue font-bold">
                    FREE
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePurchase(avatar)}
                    className={`w-full py-2 rounded-lg ${colors.bg} border-2 ${colors.border} ${colors.text} font-bold
                             hover:${colors.glow} transition-all duration-300`}
                  >
                    🪙 {avatar.price.toLocaleString()}
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default AvatarShop;
