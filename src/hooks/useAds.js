import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for managing ads (both rewarded and interstitial)
 * Uses Google AdSense for web-based games
 */
export const useAds = () => {
  const [isAdReady, setIsAdReady] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adError, setAdError] = useState(null);

  useEffect(() => {
    // Check if adsbygoogle is loaded
    const checkAdReady = () => {
      if (window.adsbygoogle) {
        setIsAdReady(true);
      } else {
        // Retry after a delay
        setTimeout(checkAdReady, 1000);
      }
    };

    checkAdReady();
  }, []);

  /**
   * Show an interstitial ad (full screen, skippable after 5 seconds)
   * Used for game over, level transitions, etc.
   * @param {Function} onAdClosed - Callback when ad is closed
   */
  const showInterstitialAd = useCallback(async (onAdClosed) => {
    try {
      setIsAdPlaying(true);
      setAdError(null);

      console.log('📺 Showing interstitial ad...');

      // FOR PRODUCTION: Replace with actual AdSense interstitial ad call
      // Example:
      // (adsbygoogle = window.adsbygoogle || []).push({
      //   google_ad_client: "ca-pub-1021387175994347",
      //   enable_page_level_ads: true,
      //   overlays: {bottom: true}
      // });

      // Simulate ad display for testing (5 seconds)
      await new Promise(resolve => setTimeout(resolve, 5000));

      console.log('✅ Interstitial ad closed');
      setIsAdPlaying(false);
      if (onAdClosed) onAdClosed();

    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      setAdError(error.message);
      setIsAdPlaying(false);
      if (onAdClosed) onAdClosed();
    }
  }, []);

  /**
   * Show a rewarded video ad (unskippable, user must watch to completion)
   * Used when user clicks "Watch Ad for Coins" button
   * @param {Function} onRewarded - Callback when user earns reward
   * @param {Function} onAdClosed - Callback when ad is closed (with or without reward)
   */
  const showRewardedAd = useCallback(async (onRewarded, onAdClosed) => {
    try {
      setIsAdPlaying(true);
      setAdError(null);

      console.log('🎬 Showing rewarded video ad...');

      // FOR PRODUCTION: Replace with actual AdSense rewarded ad call
      // You need to set up rewarded ads in your AdSense account and get the ad unit ID
      // Example structure:
      // window.adBreak({
      //   type: 'reward',
      //   name: 'watch-for-coins',
      //   beforeAd: () => { console.log('Ad starting'); },
      //   afterAd: () => { console.log('Ad ended'); },
      //   adDismissed: () => { console.log('Ad skipped/closed without reward'); },
      //   adViewed: () => {
      //     console.log('Ad completed! User earned reward');
      //     if (onRewarded) onRewarded();
      //   }
      // });

      // Simulate rewarded ad (unskippable - must watch full duration)
      await new Promise(resolve => setTimeout(resolve, 15000)); // 15 second ad

      // User completed the ad - give reward
      console.log('✅ Rewarded ad completed! User earned reward');
      if (onRewarded) onRewarded();

      setIsAdPlaying(false);
      if (onAdClosed) onAdClosed(true);

    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      setAdError(error.message);
      setIsAdPlaying(false);
      if (onAdClosed) onAdClosed(false);
    }
  }, []);

  return {
    isAdReady,
    isAdPlaying,
    adError,
    showInterstitialAd,
    showRewardedAd
  };
};

// Export both hooks for compatibility
export const useRewardedAd = useAds;
export const useInterstitialAd = useAds;
