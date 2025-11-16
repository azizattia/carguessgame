import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cars } from '../data/cars';
import { useAuth } from '../contexts/AuthContext';
import { playCorrectSound, playWrongSound, playBonusSound, playLevelUpSound } from '../utils/sounds';
import { addCoins, checkAndRewardReferral } from '../utils/storage';
import CarCard from './CarCard';
import BonusRound from './BonusRound';
import LuckyBlock, { LuckyBlockResult } from './LuckyBlock';
import { getRandomOutcome, LUCKY_BLOCK_CONFIG } from '../data/luckyBlocks';
import Jumpscare from './Jumpscare';
import { getRandomJumpscare, CHAOS_CONFIG } from '../data/jumpscares';
import { speakRoast, stopRoasting, ROASTS } from '../utils/voiceRoasts';
import GeographyMinigame from './GeographyMinigame';

const Game = ({ onGameOver, onReviveNeeded, reviveCount = 0 }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [currentCar, setCurrentCar] = useState(null);
  const [nextCar, setNextCar] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isBonusRound, setIsBonusRound] = useState(false);
  const [targetPrice, setTargetPrice] = useState(0);

  // Lucky block states
  const [showLuckyBlock, setShowLuckyBlock] = useState(false);
  const [luckyBlockOutcome, setLuckyBlockOutcome] = useState(null);
  const [showLuckyResult, setShowLuckyResult] = useState(false);
  const [lastLuckyBlockLevel, setLastLuckyBlockLevel] = useState(0);

  // Geography minigame states
  const [showGeographyMinigame, setShowGeographyMinigame] = useState(false);
  const [lastGeographyLevel, setLastGeographyLevel] = useState(0);

  // Referral reward states
  const [showReferralReward, setShowReferralReward] = useState(false);
  const [referralRewardAmount, setReferralRewardAmount] = useState(0);

  // Active effects
  const [extraLives, setExtraLives] = useState(0);
  const [coinMultiplier, setCoinMultiplier] = useState(1);
  const [multiplierRoundsLeft, setMultiplierRoundsLeft] = useState(0);
  const [reverseControls, setReverseControls] = useState(false);
  const [hidePriceNextRound, setHidePriceNextRound] = useState(false);
  const [showPriceHint, setShowPriceHint] = useState(false);
  const [priceHintRange, setPriceHintRange] = useState(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerActive, setTimerActive] = useState(false);

  // Chaos/Brainrot states
  const [showJumpscare, setShowJumpscare] = useState(false);
  const [currentJumpscare, setCurrentJumpscare] = useState(null);
  const [screenFlipped, setScreenFlipped] = useState(false);

  useEffect(() => {
    startNewRound();
  }, []);

  // Handle revive: when reviveCount changes, continue the game
  useEffect(() => {
    if (reviveCount > 0) {
      // Player just revived, continue the game
      setShowResult(false);
      setIsCorrect(false);
      setTimeLeft(10);
      setTimerActive(true);
      setLevel(prev => prev + 1); // Increment level

      // Move to next car and get a new one
      const newCurrent = nextCar || getRandomCar();
      const newNext = getRandomCar(newCurrent.id);
      setCurrentCar(newCurrent);
      setNextCar(newNext);

      // Reset chaos effects
      setScreenFlipped(false);
      stopRoasting();
    }
  }, [reviveCount]);

  // Prevent body scroll when showing result
  useEffect(() => {
    if (showResult) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showResult]);

  // Timer countdown effect
  useEffect(() => {
    if (!timerActive || showResult || isBonusRound) return;

    if (timeLeft <= 0) {
      // Time's up! Treat as wrong answer
      handleTimeUp();
      return;
    }

    // Roast player if taking too long (at 5 seconds)
    if (timeLeft === 5 && Math.random() < 0.5) { // 50% chance at 5 seconds
      speakRoast(ROASTS.takingTooLong);
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerActive, showResult, isBonusRound]);

  const getRandomCar = (excludeId = null) => {
    let availableCars = [...cars];
    if (excludeId) {
      availableCars = availableCars.filter(car => car.id !== excludeId);
    }
    return availableCars[Math.floor(Math.random() * availableCars.length)];
  };

  const checkForLuckyBlock = () => {
    // Check if we should show a lucky block
    const levelsSinceLastBlock = level - lastLuckyBlockLevel;

    if (level >= LUCKY_BLOCK_CONFIG.minLevel &&
        levelsSinceLastBlock >= LUCKY_BLOCK_CONFIG.cooldown &&
        Math.random() < LUCKY_BLOCK_CONFIG.baseChance) {
      return true;
    }
    return false;
  };

  const handleLuckyBlockOpen = () => {
    const outcome = getRandomOutcome();
    setLuckyBlockOutcome(outcome);
    setShowLuckyBlock(false);
    setShowLuckyResult(true);
    setLastLuckyBlockLevel(level);
  };

  const handleLuckyBlockSkip = () => {
    setShowLuckyBlock(false);
    setLastLuckyBlockLevel(level);
    startNewRound();
  };

  const handleLuckyResultContinue = () => {
    applyLuckyBlockEffect(luckyBlockOutcome);
    setShowLuckyResult(false);
    startNewRound();
  };

  const applyLuckyBlockEffect = (outcome) => {
    const effect = outcome.effect;

    switch (effect.type) {
      case 'coins':
        if (user) {
          addCoins(user.id, effect.value).then(() => refreshProfile());
        }
        break;

      case 'extra_life':
        setExtraLives(prev => prev + effect.value);
        break;

      case 'skip_level':
        setLevel(prev => prev + effect.value);
        setScore(prev => prev + effect.value);
        break;

      case 'coin_multiplier':
        setCoinMultiplier(effect.value);
        setMultiplierRoundsLeft(effect.duration);
        break;

      case 'price_hint':
        setShowPriceHint(true);
        break;

      case 'reverse_controls':
        setReverseControls(true);
        break;

      case 'level_penalty':
        const newLevel = Math.max(1, level + effect.value);
        setLevel(newLevel);
        setScore(Math.max(0, score + effect.value));
        break;

      case 'hide_price':
        setHidePriceNextRound(true);
        break;

      case 'random_swap':
        // Swap score and level for fun chaos
        const tempLevel = level;
        setLevel(score > 0 ? score : 1);
        setScore(tempLevel);
        break;

      default:
        break;
    }
  };

  const checkForGeographyMinigame = () => {
    // Trigger geography minigame randomly between levels
    const levelsSinceLastGeo = level - lastGeographyLevel;

    // Don't trigger on bonus round levels (multiples of 5)
    if ((level + 1) % 5 === 0) return false;

    // Minimum 3 levels between geography minigames
    if (levelsSinceLastGeo < 3) return false;

    // After level 5, 30% chance to trigger each round
    if (level >= 5 && Math.random() < 0.30) {
      return true;
    }

    return false;
  };

  const handleGeographyComplete = (coinsEarned) => {
    // Award coins from geography minigame
    if (user && coinsEarned > 0) {
      addCoins(user.id, coinsEarned).then(() => refreshProfile());
    }

    setShowGeographyMinigame(false);
    setLastGeographyLevel(level);

    // Continue with the game
    startNewRound();
  };

  const handleTimeUp = () => {
    setTimerActive(false);
    setIsCorrect(false);
    setShowResult(true);
    stopRoasting(); // Stop any ongoing roast

    // Check if player has extra life
    if (extraLives > 0) {
      playBonusSound();
      speakRoast(ROASTS.needsExtraLife); // Roast for using extra life
      setExtraLives(prev => prev - 1);
      setTimeout(() => {
        setShowResult(false);
        setIsCorrect(false);
        setTimeLeft(10);
        setTimerActive(true);
      }, 2000);
    } else {
      playWrongSound();
      speakRoast(ROASTS.wrongAnswer); // Roast for timing out
      setTimeout(() => {
        if (score < 5) {
          speakRoast(ROASTS.lowScore); // Extra roast for low score
        }
        setTimeout(() => {
          // Trigger revive screen instead of immediate game over
          onReviveNeeded(score);
        }, 1000);
      }, 1500);
    }
  };

  const triggerChaosEffects = () => {
    // Only trigger chaos in regular rounds (not bonus)
    // Check for jumpscare
    if (Math.random() < CHAOS_CONFIG.jumpscareChance) {
      setTimeout(() => {
        const scare = getRandomJumpscare();
        setCurrentJumpscare(scare);
        setShowJumpscare(true);
        setTimerActive(false); // Pause timer during jumpscare
      }, Math.random() * 3000 + 1000); // Random delay 1-4 seconds
    }

    // Check for screen flip
    if (Math.random() < CHAOS_CONFIG.screenFlipChance) {
      setScreenFlipped(true);
    }

    // Moving buttons effect removed since buttons were replaced with clickable cards
  };

  const handleJumpscareDismiss = () => {
    setShowJumpscare(false);
    setCurrentJumpscare(null);
    setTimerActive(true); // Resume timer after jumpscare
  };

  const startNewRound = () => {
    // IMPORTANT: Reset result state at the very beginning
    setShowResult(false);
    setIsCorrect(false);

    // Update multiplier rounds
    if (multiplierRoundsLeft > 0) {
      setMultiplierRoundsLeft(prev => prev - 1);
      if (multiplierRoundsLeft === 1) {
        setCoinMultiplier(1);
      }
    }

    if ((level + 1) % 5 === 0) {
      // Bonus round every 5 levels (no timer for bonus rounds)
      setIsBonusRound(true);
      setTimerActive(false);
      const car1 = getRandomCar();
      const car2 = getRandomCar(car1.id);
      setCurrentCar(car1);
      setNextCar(car2);
      // Generate a target price between the two cars
      const minPrice = Math.min(car1.price, car2.price);
      const maxPrice = Math.max(car1.price, car2.price);
      const target = Math.floor(minPrice + (maxPrice - minPrice) * Math.random());
      setTargetPrice(target);
      playBonusSound();

      // No chaos effects in bonus rounds
      setScreenFlipped(false);
    } else {
      setIsBonusRound(false);
      const newCurrent = nextCar || getRandomCar();
      const newNext = getRandomCar(newCurrent.id);
      setCurrentCar(newCurrent);
      setNextCar(newNext);

      // Set price hint if active
      if (showPriceHint) {
        const range = {
          min: Math.floor(newNext.price * 0.8),
          max: Math.floor(newNext.price * 1.2)
        };
        setPriceHintRange(range);
        setShowPriceHint(false);
      } else {
        setPriceHintRange(null);
      }

      // Reset hide price effect after it's been applied
      if (hidePriceNextRound) {
        setHidePriceNextRound(false);
      }

      // Reset and start timer for regular rounds
      setTimeLeft(10);
      setTimerActive(true);

      // Trigger chaos effects for regular rounds
      triggerChaosEffects();
    }
  };

  const handleGuess = (guess) => {
    if (showResult) return;

    // Stop the timer
    setTimerActive(false);

    // Reset chaos effects after making a guess
    setScreenFlipped(false);

    // Apply reverse controls if active
    let actualGuess = guess;
    if (reverseControls && !isBonusRound) {
      actualGuess = guess === 'current' ? 'next' : 'current';
      setReverseControls(false); // Effect lasts only one round
    }

    let correct = false;

    if (isBonusRound) {
      // Bonus round: which car is closer to target price?
      const diff1 = Math.abs(currentCar.price - targetPrice);
      const diff2 = Math.abs(nextCar.price - targetPrice);

      if (actualGuess === 'first') {
        correct = diff1 <= diff2;
      } else {
        correct = diff2 < diff1;
      }
    } else {
      // Regular round: user clicks on the car they think is MORE expensive
      if (actualGuess === 'current') {
        // User thinks current car is more expensive
        correct = currentCar.price >= nextCar.price;
      } else {
        // User thinks next car is more expensive
        correct = nextCar.price > currentCar.price;
      }
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playCorrectSound();

      // Award coins for correct answer with multiplier
      const baseCoins = isBonusRound ? 50 : 10;
      const earnedCoins = Math.floor(baseCoins * coinMultiplier);
      setCoinsEarned(earnedCoins);
      if (user) {
        addCoins(user.id, earnedCoins).then(() => {
          refreshProfile();
        });
      }

      setTimeout(() => {
        setScore(score + 1);
        setShowScoreAnimation(true);
        setShowCoinAnimation(true);
        setTimeout(() => {
          setShowScoreAnimation(false);
          setShowCoinAnimation(false);
        }, 500);
        const newLevel = level + 1;
        setLevel(newLevel);
        playLevelUpSound();

        // Check for referral reward at level 15
        if (user && newLevel === 15) {
          checkAndRewardReferral(user.id, newLevel).then((result) => {
            if (result.rewarded) {
              setReferralRewardAmount(result.amount);
              setShowReferralReward(true);
              refreshProfile(); // Refresh to show new coin balance
              setTimeout(() => {
                setShowReferralReward(false);
              }, 5000);
            }
          });
        }

        // Reset showResult BEFORE checking for special events
        setShowResult(false);
        setIsCorrect(false);

        // Check for special events after correct answer
        setTimeout(() => {
          if (checkForLuckyBlock()) {
            setShowLuckyBlock(true);
          } else if (checkForGeographyMinigame()) {
            setShowGeographyMinigame(true);
          } else {
            startNewRound();
          }
        }, 1500);
      }, 2000);
    } else {
      stopRoasting(); // Stop any ongoing roast

      // Check if player has extra life
      if (extraLives > 0) {
        playBonusSound();
        speakRoast(ROASTS.needsExtraLife); // Roast for needing extra life
        setExtraLives(prev => prev - 1);
        setTimeout(() => {
          setShowResult(false);
          setIsCorrect(false);
          // If in bonus round, need to restart timer
          if (!isBonusRound) {
            setTimeLeft(10);
            setTimerActive(true);
          }
        }, 2000);
      } else {
        playWrongSound();
        speakRoast(ROASTS.wrongAnswer); // Roast for wrong answer
        setTimeout(() => {
          if (score < 5) {
            speakRoast(ROASTS.lowScore); // Extra roast for low score
          }
          setTimeout(() => {
            // Trigger revive screen instead of immediate game over
            onReviveNeeded(score);
          }, 1000);
        }, 1500);
      }
    }
  };

  if (!currentCar || !nextCar) return null;

  if (isBonusRound) {
    return (
      <BonusRound
        car1={currentCar}
        car2={nextCar}
        targetPrice={targetPrice}
        level={level}
        score={score}
        showResult={showResult}
        isCorrect={isCorrect}
        onGuess={handleGuess}
        showScoreAnimation={showScoreAnimation}
        showCoinAnimation={showCoinAnimation}
        coinsEarned={coinsEarned}
        username={profile?.username}
      />
    );
  }

  return (
    <div
      className={`min-h-screen p-4 flex flex-col transition-transform duration-1000 ${
        showResult ? 'overflow-hidden' : ''
      }`}
      style={{
        transform: screenFlipped ? 'rotate(180deg)' : 'rotate(0deg)',
        maxHeight: '100vh',
        overflowY: showResult ? 'hidden' : 'auto'
      }}
    >
      {/* Chaos Warning Indicator */}
      {screenFlipped && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-3 md:px-4 py-1 md:py-2 bg-red-500/20 border border-red-500/50 rounded-full text-xs md:text-sm font-semibold text-red-400"
          style={{ transform: screenFlipped ? 'rotate(180deg) translateX(50%)' : 'translateX(-50%)' }}
        >
          🙃 SCREEN FLIPPED! 🙃
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-3 md:mb-6"
      >
        <div className="relative max-w-4xl mx-auto mb-2 md:mb-4 px-2 md:px-4">
          <div className="flex justify-between items-center">
            {/* Player Info - Left */}
            <div className="text-left flex-shrink-0 min-w-[100px] md:min-w-[150px]">
              <p className="text-gray-400 text-xs md:text-sm">Player</p>
              <p className="text-sm md:text-xl font-bold text-neon-blue glow-text truncate max-w-[90px] md:max-w-[140px]">{profile?.username}</p>
            </div>

            {/* Timer Display - Absolutely Centered */}
            {!isBonusRound && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex-shrink-0">
              <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Time Left</p>
              <motion.div
                animate={timeLeft <= 3 ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0]
                } : {}}
                transition={{ duration: 0.3, repeat: timeLeft <= 3 ? Infinity : 0 }}
                className="relative"
              >
                {/* Circular Progress */}
                <svg className="w-12 h-12 md:w-20 md:h-20 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={timeLeft <= 3 ? '#ef4444' : timeLeft <= 5 ? '#f59e0b' : '#10b981'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeLeft / 10)}`}
                    className="transition-all duration-1000"
                    style={{
                      filter: timeLeft <= 3 ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))' :
                              timeLeft <= 5 ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' :
                              'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))'
                    }}
                  />
                </svg>
                {/* Timer number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    key={timeLeft}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-xl md:text-3xl font-bold ${
                      timeLeft <= 3 ? 'text-red-400' :
                      timeLeft <= 5 ? 'text-yellow-400' :
                      'text-green-400'
                    }`}
                    style={{
                      textShadow: timeLeft <= 3 ? '0 0 20px rgba(239, 68, 68, 0.8)' :
                                  timeLeft <= 5 ? '0 0 15px rgba(245, 158, 11, 0.6)' :
                                  '0 0 10px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    {timeLeft}
                  </motion.span>
                </div>
              </motion.div>
            </div>
          )}

            {/* Level Display - Absolutely Centered (for bonus rounds) */}
            {isBonusRound && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex-shrink-0">
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
            )}

            {/* Score - Right */}
            <div className="text-right relative flex-shrink-0 min-w-[100px] md:min-w-[150px]">
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
        </div>

        {/* Active Effects Display */}
        <div className="flex justify-center gap-2 md:gap-3 flex-wrap mt-2 md:mt-4 px-2">
          {extraLives > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 md:px-3 py-1 bg-pink-500/20 border border-pink-500/50 rounded-full text-xs md:text-sm font-semibold text-pink-400"
            >
              ❤️ {extraLives} Extra {extraLives === 1 ? 'Life' : 'Lives'}
            </motion.div>
          )}
          {coinMultiplier !== 1 && multiplierRoundsLeft > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`px-2 md:px-3 py-1 border rounded-full text-xs md:text-sm font-semibold ${
                coinMultiplier > 1
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : 'bg-orange-500/20 border-orange-500/50 text-orange-400'
              }`}
            >
              {coinMultiplier > 1 ? '✨' : '📉'} {coinMultiplier}x Coins ({multiplierRoundsLeft} left)
            </motion.div>
          )}
          {reverseControls && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -5, 5, -5, 5, 0] }}
              transition={{ rotate: { repeat: Infinity, duration: 0.5 } }}
              className="px-2 md:px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-xs md:text-sm font-semibold text-red-400"
            >
              🔄 Controls Reversed!
            </motion.div>
          )}
          {priceHintRange && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 md:px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-xs md:text-sm font-semibold text-purple-400"
            >
              🔮 Hint: ${priceHintRange.min.toLocaleString()} - ${priceHintRange.max.toLocaleString()}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Instruction Text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-3 md:mb-6 max-w-4xl mx-auto px-4"
      >
        <p className="text-base md:text-xl text-gray-300">
          <span className="text-neon-pink font-bold">Which car is MORE expensive?</span>
        </p>
        <p className="text-xs md:text-base text-gray-400 mt-1 md:mt-2">
          Click on the car you think costs more!
        </p>
      </motion.div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center relative">
          {/* Current Car */}
          <CarCard
            key={currentCar.id}
            car={currentCar}
            showPrice={!hidePriceNextRound}
            label="Current Car"
            isClickable={!showResult}
            onClick={() => handleGuess('current')}
          />

          {/* VS Divider - Desktop only */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="glass-effect rounded-full w-16 md:w-20 h-16 md:h-20 flex items-center justify-center
                       border-4 border-neon-purple shadow-neon-purple"
            >
              <span className="text-2xl md:text-3xl font-bold text-neon-purple glow-text">VS</span>
            </motion.div>
          </div>

          {/* VS Text - Mobile only */}
          <div className="flex md:hidden justify-center my-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-2xl font-bold text-neon-purple glow-text"
            >
              VS
            </motion.div>
          </div>

          {/* Next Car */}
          <CarCard
            key={nextCar.id}
            car={nextCar}
            showPrice={showResult}
            label="Next Car"
            isRevealing={showResult}
            isClickable={!showResult}
            onClick={() => handleGuess('next')}
          />
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
                {isCorrect ? '✓ CORRECT!' : timeLeft === 0 ? '⏰ TIME\'S UP!' : '✗ WRONG!'}
              </motion.div>

              {/* Coin Earned Animation */}
              {isCorrect && showCoinAnimation && (
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-yellow-400 glow-text"
                >
                  <span>🪙</span>
                  <span>+{coinsEarned}</span>
                </motion.div>
              )}

              {/* Extra Life Used Animation */}
              {!isCorrect && extraLives > 0 && showResult && (
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2 text-xl md:text-3xl font-bold text-pink-400 glow-text text-center"
                >
                  <span>❤️</span>
                  <span className="hidden md:inline">EXTRA LIFE SAVED YOU!</span>
                  <span className="md:hidden">EXTRA LIFE!</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lucky Block Modals */}
      <AnimatePresence>
        {showLuckyBlock && (
          <LuckyBlock
            onOpen={handleLuckyBlockOpen}
            onSkip={handleLuckyBlockSkip}
          />
        )}

        {showLuckyResult && luckyBlockOutcome && (
          <LuckyBlockResult
            outcome={luckyBlockOutcome}
            onContinue={handleLuckyResultContinue}
          />
        )}

        {/* Jumpscare */}
        {showJumpscare && currentJumpscare && (
          <Jumpscare
            jumpscare={currentJumpscare}
            onDismiss={handleJumpscareDismiss}
          />
        )}

        {/* Geography Minigame */}
        {showGeographyMinigame && (
          <GeographyMinigame
            onComplete={handleGeographyComplete}
          />
        )}
      </AnimatePresence>

      {/* Referral Reward Notification */}
      <AnimatePresence>
        {showReferralReward && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-4 md:px-8 py-3 md:py-6
                     glass-effect rounded-xl md:rounded-2xl border-2 border-yellow-500 shadow-lg shadow-yellow-500/50
                     max-w-xs md:max-w-md"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                className="text-4xl md:text-5xl mb-2 md:mb-3"
              >
                🎉
              </motion.div>
              <h3 className="text-lg md:text-2xl font-bold text-yellow-400 mb-1 md:mb-2">
                REFERRAL REWARD!
              </h3>
              <p className="text-xs md:text-base text-gray-300 mb-2 md:mb-3">
                You reached Level 15! You and your friend both earned:
              </p>
              <div className="text-2xl md:text-4xl font-bold text-yellow-400 glow-text">
                🪙 {referralRewardAmount.toLocaleString()} Coins!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;
