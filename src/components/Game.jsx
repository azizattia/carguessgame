import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cars } from '../data/cars';
import { getUsername } from '../utils/storage';
import { playCorrectSound, playWrongSound, playBonusSound, playLevelUpSound } from '../utils/sounds';
import CarCard from './CarCard';
import BonusRound from './BonusRound';

const Game = ({ onGameOver }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [currentCar, setCurrentCar] = useState(null);
  const [nextCar, setNextCar] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [isBonusRound, setIsBonusRound] = useState(false);
  const [targetPrice, setTargetPrice] = useState(0);
  const username = getUsername();

  useEffect(() => {
    startNewRound();
  }, []);

  const getRandomCar = (excludeId = null) => {
    let availableCars = [...cars];
    if (excludeId) {
      availableCars = availableCars.filter(car => car.id !== excludeId);
    }
    return availableCars[Math.floor(Math.random() * availableCars.length)];
  };

  const startNewRound = () => {
    if ((level + 1) % 5 === 0) {
      // Bonus round every 5 levels
      setIsBonusRound(true);
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
    } else {
      setIsBonusRound(false);
      const newCurrent = nextCar || getRandomCar();
      const newNext = getRandomCar(newCurrent.id);
      setCurrentCar(newCurrent);
      setNextCar(newNext);
    }
    setShowResult(false);
  };

  const handleGuess = (guess) => {
    if (showResult) return;

    let correct = false;

    if (isBonusRound) {
      // Bonus round: which car is closer to target price?
      const diff1 = Math.abs(currentCar.price - targetPrice);
      const diff2 = Math.abs(nextCar.price - targetPrice);

      if (guess === 'first') {
        correct = diff1 <= diff2;
      } else {
        correct = diff2 < diff1;
      }
    } else {
      // Regular round: higher or lower?
      if (guess === 'higher') {
        correct = nextCar.price >= currentCar.price;
      } else {
        correct = nextCar.price <= currentCar.price;
      }
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playCorrectSound();
      setTimeout(() => {
        setScore(score + 1);
        setShowScoreAnimation(true);
        setTimeout(() => setShowScoreAnimation(false), 500);
        setLevel(level + 1);
        playLevelUpSound();
        setTimeout(() => startNewRound(), 1500);
      }, 2000);
    } else {
      playWrongSound();
      setTimeout(() => {
        onGameOver(score);
      }, 2500);
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
        username={username}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <div className="flex justify-between items-center max-w-4xl mx-auto mb-4">
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

      {/* Instruction Text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6 max-w-4xl mx-auto"
      >
        <p className="text-lg md:text-xl text-gray-300">
          Is <span className="text-neon-blue font-bold">{nextCar.make} {nextCar.model}</span> lower or higher than{' '}
          <span className="text-neon-purple font-bold">{currentCar.make} {currentCar.model}</span>?
        </p>
      </motion.div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Current Car */}
          <CarCard key={currentCar.id} car={currentCar} showPrice={true} label="Current Car" />

          {/* VS Divider */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="glass-effect rounded-full w-20 h-20 flex items-center justify-center
                       border-4 border-neon-purple shadow-neon-purple"
            >
              <span className="text-3xl font-bold text-neon-purple glow-text">VS</span>
            </motion.div>
          </div>

          {/* Next Car */}
          <CarCard
            key={nextCar.id}
            car={nextCar}
            showPrice={showResult}
            label="Next Car"
            isRevealing={showResult}
          />
        </div>
      </div>

      {/* Action Buttons */}
      {!showResult && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex gap-4 justify-center mb-8 flex-wrap"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGuess('higher')}
            className="px-12 py-4 text-xl font-bold bg-gradient-to-r from-green-500 to-green-600
                     rounded-xl shadow-lg hover:shadow-green-500/50 transition-all duration-300
                     border-2 border-green-400/50"
          >
            ⬆️ HIGHER
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGuess('lower')}
            className="px-12 py-4 text-xl font-bold bg-gradient-to-r from-red-500 to-red-600
                     rounded-xl shadow-lg hover:shadow-red-500/50 transition-all duration-300
                     border-2 border-red-400/50"
          >
            ⬇️ LOWER
          </motion.button>
        </motion.div>
      )}

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

export default Game;
