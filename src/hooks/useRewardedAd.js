import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for managing rewarded video ads
 * Uses Google AdSense rewarded ads API
 */
export const useRewardedAd = () => {
  const [isAdReady, setIsAdReady] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adError, setAdError] = useState(null);

  useEffect(() => {
    // Check if adsbygoogle is loaded
    const checkAdReady = () => {
      if (window.adsbygoogle && window.adConfig) {
        setIsAdReady(true);
      } else {
        // Retry after a delay
        setTimeout(checkAdReady, 1000);
      }
    };

    checkAdReady();
  }, []);

  /**
   * Show a rewarded ad
   * @param {Function} onRewarded - Callback when user earns reward
   * @param {Function} onAdClosed - Callback when ad is closed (with or without reward)
   */
  const showRewardedAd = useCallback(async (onRewarded, onAdClosed) => {
    try {
      setIsAdPlaying(true);
      setAdError(null);

      // Check if ads are available
      if (!window.adsbygoogle) {
        throw new Error('Ad SDK not loaded');
      }

      // For testing, we'll simulate an ad
      // In production, replace this with actual AdSense rewarded ad call
      console.log('🎬 Showing rewarded ad...');

      // Simulate ad display (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful ad completion (80% success rate for testing)
      const adCompleted = Math.random() > 0.2;

      if (adCompleted) {
        console.log('✅ Ad completed! User earned reward');
        if (onRewarded) onRewarded();
      } else {
        console.log('❌ Ad was skipped or failed');
      }

      setIsAdPlaying(false);
      if (onAdClosed) onAdClosed(adCompleted);

    } catch (error) {
      console.error('Error showing ad:', error);
      setAdError(error.message);
      setIsAdPlaying(false);
      if (onAdClosed) onAdClosed(false);
    }
  }, []);

  /**
   * Show rewarded ad using Google AdSense
   * This is the production version that uses actual ads
   */
  const showProductionAd = useCallback(async (onRewarded, onAdClosed) => {
    try {
      setIsAdPlaying(true);
      setAdError(null);

      if (!window.adsbygoogle) {
        throw new Error('AdSense not loaded');
      }

      // Request rewarded ad
      // Note: You'll need to configure this with your AdSense publisher ID
      (window.adsbygoogle = window.adsbygoogle || []).push({});

      // This is a placeholder for actual rewarded ad implementation
      // You would integrate with Google AdMob or AdSense rewarded ads here

      // For now, using test mode
      console.warn('⚠️ Production ads not configured yet. Using test mode.');
      return showRewardedAd(onRewarded, onAdClosed);

    } catch (error) {
      console.error('Error showing production ad:', error);
      setAdError(error.message);
      setIsAdPlaying(false);
      if (onAdClosed) onAdClosed(false);
    }
  }, [showRewardedAd]);

  return {
    isAdReady,
    isAdPlaying,
    adError,
    showRewardedAd,
    showProductionAd
  };
};
