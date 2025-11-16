import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { addCoins } from '../utils/storage';

const WatchAdButton = ({ rewardAmount = 2000, onRewardEarned }) => {
  const { user, refreshProfile } = useAuth();
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5); // 5 seconds to watch
  const [canClaim, setCanClaim] = useState(false);
  const adContainerRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    if (!showAdOverlay) {
      setTimeRemaining(5);
      setCanClaim(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCanClaim(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showAdOverlay]);

  // Load AdSense ad when overlay opens
  useEffect(() => {
    if (showAdOverlay && adContainerRef.current) {
      // Clear previous ad content
      adContainerRef.current.innerHTML = '';

      // Create AdSense ad element
      const adElement = document.createElement('ins');
      adElement.className = 'adsbygoogle';
      adElement.style.display = 'block';
      adElement.setAttribute('data-ad-client', 'ca-pub-1021387175994347');
      adElement.setAttribute('data-ad-slot', '9776703698');
      adElement.setAttribute('data-ad-format', 'auto');
      adElement.setAttribute('data-full-width-responsive', 'true');

      adContainerRef.current.appendChild(adElement);

      // Push ad to AdSense
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [showAdOverlay]);

  const handleWatchAd = () => {
    if (!user) return;
    setShowAdOverlay(true);
  };

  const handleClaimReward = async () => {
    if (!canClaim) return;

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

    setShowAdOverlay(false);
  };

  const handleClose = () => {
    setShowAdOverlay(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: showAdOverlay ? 1 : 1.05 }}
        whileTap={{ scale: showAdOverlay ? 1 : 0.95 }}
        onClick={handleWatchAd}
        disabled={showAdOverlay}
        className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold flex items-center gap-2 md:gap-3 transition-all duration-300 ${
          showAdOverlay
            ? 'bg-gray-600 cursor-wait'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50'
        }`}
      >
        <span className="text-xl md:text-2xl">📺</span>
        <div className="text-left">
          <div className="text-xs md:text-sm">Watch Ad</div>
          <div className="text-xs text-yellow-300">Get {rewardAmount} 🪙</div>
        </div>
      </motion.button>

      {/* Ad Overlay - Minimal overlay, mostly transparent */}
      <AnimatePresence>
        {showAdOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white text-2xl hover:text-red-400 transition-colors"
              title="Close (no reward)"
            >
              ✕
            </button>

            {/* Content Card */}
            <div className="w-full max-w-3xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 border-2 border-yellow-500/50 shadow-2xl">
              {/* Header with game context */}
              <div className="mb-4 text-center">
                <h2 className="text-2xl md:text-3xl font-black text-yellow-400 mb-2">
                  🪙 Bonus Coins Available! 🪙
                </h2>
                <p className="text-gray-300 text-sm md:text-base mb-2">
                  Support the game by watching this ad - earn <span className="text-yellow-400 font-bold">{rewardAmount} coins</span> to unlock avatars, chests, and more!
                </p>
                <div className="flex items-center justify-center gap-4 text-xs md:text-sm text-gray-400 mb-2">
                  <span>🎮 Continue your car challenge</span>
                  <span>•</span>
                  <span>🏆 Climb the leaderboard</span>
                  <span>•</span>
                  <span>🎁 Unlock rewards</span>
                </div>
              </div>

              {/* Timer */}
              <div className="mb-4 text-center">
                {!canClaim ? (
                  <div className="inline-block px-6 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full">
                    <p className="text-white font-bold">
                      ⏱️ Watch for {timeRemaining} more second{timeRemaining !== 1 ? 's' : ''}...
                    </p>
                  </div>
                ) : (
                  <div className="inline-block px-6 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
                    <p className="text-green-400 font-bold">
                      ✓ Ad Complete! Claim your reward below
                    </p>
                  </div>
                )}
              </div>

              {/* Ad Container */}
              <div
                ref={adContainerRef}
                className="min-h-[250px] md:min-h-[300px] bg-gray-800/50 rounded-lg flex items-center justify-center mb-4 border border-gray-700"
              >
                <p className="text-gray-400 text-sm">Loading ad...</p>
              </div>

              {/* Claim Button */}
              <motion.button
                whileHover={{ scale: canClaim ? 1.05 : 1 }}
                whileTap={{ scale: canClaim ? 0.95 : 1 }}
                onClick={handleClaimReward}
                disabled={!canClaim}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  canClaim
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-lg hover:shadow-yellow-500/50 cursor-pointer text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                {canClaim ? `Claim ${rewardAmount} Coins! 🎁` : 'Keep watching...'}
              </motion.button>

              {/* Footer context */}
              <p className="text-center text-xs text-gray-500 mt-3">
                Ads help keep Car Price Challenge free to play!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WatchAdButton;
