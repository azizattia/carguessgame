import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { addCoins } from '../utils/storage';

const WatchAdButton = ({ rewardAmount = 2000, onRewardEarned }) => {
  const { user, refreshProfile } = useAuth();
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0); // Track which ad we're on (0-4)
  const [timeRemaining, setTimeRemaining] = useState(3); // 3 seconds per ad
  const [canProceed, setCanProceed] = useState(false);
  const adContainerRefs = useRef([]);
  const totalAds = 5; // Show 5 ads for maximum revenue

  // Timer countdown for current ad
  useEffect(() => {
    if (!showAdOverlay) {
      setTimeRemaining(3);
      setCanProceed(false);
      setCurrentAdIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCanProceed(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showAdOverlay, currentAdIndex]);

  // Load AdSense ad for current ad index
  useEffect(() => {
    if (showAdOverlay && adContainerRefs.current[currentAdIndex]) {
      const container = adContainerRefs.current[currentAdIndex];

      // Clear previous ad content
      container.innerHTML = '';

      // Create AdSense ad element
      const adElement = document.createElement('ins');
      adElement.className = 'adsbygoogle';
      adElement.style.display = 'block';
      adElement.setAttribute('data-ad-client', 'ca-pub-1021387175994347');
      adElement.setAttribute('data-ad-slot', '9776703698'); // Using baseone slot
      adElement.setAttribute('data-ad-format', 'auto');
      adElement.setAttribute('data-full-width-responsive', 'true');

      container.appendChild(adElement);

      // Push ad to AdSense
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [showAdOverlay, currentAdIndex]);

  const handleWatchAd = () => {
    if (!user) return;
    setShowAdOverlay(true);
  };

  const handleNextAd = () => {
    if (!canProceed) return;

    if (currentAdIndex < totalAds - 1) {
      // Move to next ad
      setCurrentAdIndex(prev => prev + 1);
      setTimeRemaining(3);
      setCanProceed(false);
    } else {
      // All ads watched, give reward
      handleClaimReward();
    }
  };

  const handleClaimReward = async () => {
    console.log(`🎁 Rewarding user ${rewardAmount} coins for watching ${totalAds} ads`);

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

      {/* Ad Overlay */}
      <AnimatePresence>
        {showAdOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center z-[9999] p-4"
          >
            {/* Progress & Timer Display */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
              <p className="text-white text-sm font-bold">
                Ad {currentAdIndex + 1} of {totalAds}
              </p>
              <p className="text-gray-300 text-xs">
                {canProceed ? '✓ Ready!' : `Wait ${timeRemaining}s`}
              </p>
            </div>

            {/* Ad Container */}
            <div className="w-full max-w-4xl bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-8 border border-white/10">
              <div className="mb-4 text-center">
                <p className="text-white text-lg font-bold mb-2">📺 Rewarded Ads</p>
                <p className="text-gray-300 text-sm">
                  Watch {totalAds} ads to earn {rewardAmount} coins! 🪙
                </p>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mb-4">
                {Array.from({ length: totalAds }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index < currentAdIndex
                        ? 'bg-green-500'
                        : index === currentAdIndex
                        ? 'bg-yellow-500 animate-pulse'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* AdSense Ad Containers (only show current one) */}
              <div className="min-h-[250px] md:min-h-[400px] bg-gray-800/50 rounded-lg flex items-center justify-center">
                {Array.from({ length: totalAds }).map((_, index) => (
                  <div
                    key={index}
                    ref={(el) => (adContainerRefs.current[index] = el)}
                    style={{ display: index === currentAdIndex ? 'flex' : 'none' }}
                    className="w-full h-full items-center justify-center p-4"
                  >
                    <p className="text-gray-400 text-sm">Loading ad {index + 1}...</p>
                  </div>
                ))}
              </div>

              {/* Next/Claim Button */}
              <div className="mt-4 text-center">
                <motion.button
                  whileHover={{ scale: canProceed ? 1.05 : 1 }}
                  whileTap={{ scale: canProceed ? 0.95 : 1 }}
                  onClick={handleNextAd}
                  disabled={!canProceed}
                  className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${
                    canProceed
                      ? currentAdIndex < totalAds - 1
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/50 cursor-pointer'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50 cursor-pointer'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  {canProceed
                    ? currentAdIndex < totalAds - 1
                      ? `Next Ad (${currentAdIndex + 2}/${totalAds})`
                      : `Claim ${rewardAmount} Coins 🎁`
                    : 'Keep Watching...'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WatchAdButton;
