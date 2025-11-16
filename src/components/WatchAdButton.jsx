import { motion } from 'framer-motion';
import { useAds } from '../hooks/useAds';
import { useAuth } from '../contexts/AuthContext';
import { addCoins } from '../utils/storage';

const WatchAdButton = ({ rewardAmount = 2000, onRewardEarned }) => {
  const { user, refreshProfile } = useAuth();
  const { isAdReady, isAdPlaying, showRewardedAd } = useAds();

  const handleWatchAd = () => {
    if (!user) return;

    showRewardedAd(
      // onRewarded - User completed the ad
      async () => {
        console.log(`🎁 Rewarding user ${rewardAmount} coins for watching ad`);

        // Add coins to user account
        const result = await addCoins(user.id, rewardAmount);

        if (result.error) {
          console.error('Error rewarding coins:', result.error);
        } else {
          // Refresh profile to show new balance
          await refreshProfile();

          // Notify parent component
          if (onRewardEarned) {
            onRewardEarned(rewardAmount);
          }
        }
      },
      // onAdClosed - Ad was closed (with or without reward)
      (rewarded) => {
        console.log('Ad closed. Rewarded:', rewarded);
      }
    );
  };

  return (
    <motion.button
      whileHover={{ scale: isAdPlaying ? 1 : 1.05 }}
      whileTap={{ scale: isAdPlaying ? 1 : 0.95 }}
      onClick={handleWatchAd}
      disabled={!isAdReady || isAdPlaying}
      className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold flex items-center gap-2 md:gap-3 transition-all duration-300 ${
        isAdPlaying
          ? 'bg-gray-600 cursor-wait'
          : isAdReady
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50'
          : 'bg-gray-700 cursor-not-allowed opacity-50'
      }`}
    >
      {isAdPlaying ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm md:text-base">Playing Ad...</span>
        </>
      ) : (
        <>
          <span className="text-xl md:text-2xl">📺</span>
          <div className="text-left">
            <div className="text-xs md:text-sm">Watch Ad</div>
            <div className="text-xs text-yellow-300">Get {rewardAmount} 🪙</div>
          </div>
        </>
      )}
    </motion.button>
  );
};

export default WatchAdButton;
