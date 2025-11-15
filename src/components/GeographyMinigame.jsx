import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomBrand, calculateDistance, isWithinCountry } from '../data/carOrigins';

const GeographyMinigame = ({ onComplete }) => {
  const [selectedBrand] = useState(() => getRandomBrand());
  const [clickedPosition, setClickedPosition] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [reward, setReward] = useState(null);
  const [message, setMessage] = useState('');
  const mapRef = useRef(null);

  // Convert pixel coordinates to lat/lon (using Web Mercator projection approximation)
  const pixelToLatLon = (x, y, width, height) => {
    // Map dimensions: longitude from -180 to 180, latitude from -85 to 85 (Mercator limits)
    const lon = (x / width) * 360 - 180;
    const lat = 85 - (y / height) * 170; // Simplified Mercator

    return { lat, lon };
  };

  const handleMapClick = (e) => {
    if (showResult) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Store clicked pixel position for visualization
    setClickedPosition({ x, y });

    // Convert to lat/lon
    const { lat, lon } = pixelToLatLon(x, y, rect.width, rect.height);

    // Calculate distance from clicked point to actual city
    const distance = calculateDistance(
      lat,
      lon,
      selectedBrand.coordinates[1], // lat
      selectedBrand.coordinates[0]  // lon
    );

    // Check if within country boundaries
    const inCorrectCountry = isWithinCountry(lat, lon, selectedBrand.countryCode);

    // Determine reward
    let earnedCoins = 0;
    let resultMessage = '';

    if (distance < 200) {
      // Within 200km of the exact city - JACKPOT!
      earnedCoins = 1000;
      resultMessage = `🎯 AMAZING! You pinpointed ${selectedBrand.city}!`;
    } else if (inCorrectCountry) {
      // Got the country right
      earnedCoins = 100;
      resultMessage = `✅ Correct! ${selectedBrand.brand} is from ${selectedBrand.country}!`;
    } else {
      // Wrong country
      earnedCoins = 0;
      resultMessage = `❌ Wrong! ${selectedBrand.brand} is from ${selectedBrand.city}, ${selectedBrand.country}`;
    }

    setReward(earnedCoins);
    setMessage(resultMessage);
    setShowResult(true);

    // Auto complete after 3 seconds
    setTimeout(() => {
      onComplete(earnedCoins);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 z-50 flex items-center justify-center p-4"
    >
      <div className="max-w-6xl w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-black text-white mb-2">
            🌍 GEOGRAPHY CHALLENGE 🌍
          </h1>
          <p className="text-xl text-gray-300">
            Where is <span className="text-yellow-400 font-bold">{selectedBrand.brand}</span> {selectedBrand.flag} from?
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Click on the map to guess!
          </p>
          <div className="mt-3 flex justify-center gap-6 text-sm">
            <div className="text-green-400">✅ Correct Country: +100 coins</div>
            <div className="text-yellow-400">🎯 Close to City (&lt;200km): +1000 coins</div>
          </div>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-500"
        >
          {/* World Map */}
          <div
            ref={mapRef}
            onClick={handleMapClick}
            className={`relative w-full aspect-[2/1] bg-gradient-to-br from-blue-400 via-blue-300 to-blue-500 ${
              !showResult ? 'cursor-crosshair' : 'cursor-not-allowed'
            }`}
            style={{
              backgroundImage: `
                linear-gradient(0deg, rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          >
            {/* Simple continent representations using CSS */}
            <div className="absolute inset-0">
              {/* North America */}
              <div className="absolute bg-green-600 rounded-full"
                style={{ left: '15%', top: '25%', width: '20%', height: '35%', transform: 'rotate(-15deg)' }} />

              {/* South America */}
              <div className="absolute bg-green-700 rounded-full"
                style={{ left: '22%', top: '55%', width: '12%', height: '25%', transform: 'rotate(20deg)' }} />

              {/* Europe */}
              <div className="absolute bg-green-500"
                style={{ left: '46%', top: '20%', width: '12%', height: '18%', borderRadius: '50% 30% 40% 60%' }} />

              {/* Africa */}
              <div className="absolute bg-yellow-700"
                style={{ left: '48%', top: '35%', width: '15%', height: '30%', borderRadius: '40% 40% 30% 70%' }} />

              {/* Asia */}
              <div className="absolute bg-green-600"
                style={{ left: '55%', top: '15%', width: '30%', height: '40%', borderRadius: '30% 50% 40% 40%' }} />

              {/* Australia */}
              <div className="absolute bg-yellow-600 rounded-full"
                style={{ left: '75%', top: '60%', width: '10%', height: '12%' }} />

              {/* Grid overlay */}
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '10% 10%'
                }}
              />
            </div>

            {/* Clicked position marker */}
            <AnimatePresence>
              {clickedPosition && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute"
                  style={{
                    left: clickedPosition.x - 15,
                    top: clickedPosition.y - 30
                  }}
                >
                  <div className="text-4xl">📍</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Show actual location after guess */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute"
                  style={{
                    left: `${((selectedBrand.coordinates[0] + 180) / 360) * 100}%`,
                    top: `${((85 - selectedBrand.coordinates[1]) / 170) * 100}%`,
                    transform: 'translate(-50%, -100%)'
                  }}
                >
                  <div className="text-4xl animate-bounce">⭐</div>
                  <div className="text-xs text-white bg-black bg-opacity-75 px-2 py-1 rounded whitespace-nowrap mt-1">
                    {selectedBrand.city}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Result Overlay */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                  >
                    <h2 className="text-5xl font-black text-white mb-4">
                      {message}
                    </h2>
                    {reward > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ delay: 0.3 }}
                        className="text-6xl font-black text-yellow-400"
                      >
                        +{reward} 🪙
                      </motion.div>
                    )}
                    {reward === 0 && (
                      <p className="text-2xl text-gray-400 mt-4">
                        Better luck next time!
                      </p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instructions */}
        {!showResult && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-4 text-gray-400 text-sm"
          >
            💡 Tip: The closer you click to the actual city, the more coins you earn!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GeographyMinigame;
