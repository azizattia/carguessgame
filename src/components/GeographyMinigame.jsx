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
            className={`relative w-full aspect-[2/1] bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 ${
              !showResult ? 'cursor-crosshair' : 'cursor-not-allowed'
            }`}
          >
            {/* SVG World Map */}
            <svg
              viewBox="0 0 1000 500"
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Ocean/Background - already handled by bg-gradient */}

              {/* Grid lines */}
              <g stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none">
                {/* Latitude lines */}
                {[0, 100, 200, 300, 400, 500].map(y => (
                  <line key={`lat-${y}`} x1="0" y1={y} x2="1000" y2={y} />
                ))}
                {/* Longitude lines */}
                {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(x => (
                  <line key={`lon-${x}`} x1={x} y1="0" x2={x} y2="500" />
                ))}
              </g>

              {/* Continents - Accurate simplified shapes based on real geography */}
              <g fill="#22c55e" stroke="#16a34a" strokeWidth="1.5">

                {/* North America */}
                <path d="M 100,120 L 95,100 L 110,85 L 130,80 L 150,75 L 180,80 L 200,90 L 220,100 L 240,110 L 250,130 L 260,150 L 265,170 L 270,200 L 265,230 L 255,250 L 240,260 L 220,265 L 200,260 L 180,250 L 160,245 L 140,250 L 120,260 L 110,250 L 105,230 L 100,200 L 95,170 L 95,140 Z" />

                {/* South America */}
                <path d="M 220,270 L 230,280 L 240,300 L 245,330 L 245,360 L 240,380 L 230,395 L 215,405 L 200,410 L 185,405 L 175,390 L 170,370 L 168,350 L 170,330 L 175,310 L 185,290 L 200,275 L 210,270 Z" />

                {/* Europe */}
                <path d="M 460,100 L 475,95 L 490,92 L 505,95 L 515,100 L 525,110 L 530,125 L 528,140 L 520,150 L 505,155 L 490,153 L 475,148 L 465,140 L 460,125 L 460,110 Z" />

                {/* Africa */}
                <path d="M 480,180 L 495,175 L 510,175 L 525,180 L 535,190 L 540,205 L 545,225 L 545,250 L 545,275 L 540,300 L 530,320 L 515,335 L 495,345 L 475,345 L 460,335 L 450,315 L 445,290 L 445,265 L 450,240 L 458,215 L 470,195 Z" />

                {/* Asia */}
                <path d="M 550,90 L 580,85 L 610,85 L 640,88 L 670,95 L 700,105 L 730,115 L 755,125 L 775,140 L 790,160 L 800,185 L 805,210 L 800,235 L 785,255 L 760,265 L 730,268 L 700,265 L 670,258 L 640,250 L 615,245 L 590,245 L 570,240 L 555,225 L 545,205 L 540,185 L 540,165 L 542,145 L 545,125 L 548,105 Z" />

                {/* Australia */}
                <path d="M 750,310 L 770,308 L 790,310 L 810,318 L 825,330 L 835,345 L 838,360 L 835,375 L 825,388 L 808,395 L 788,398 L 768,395 L 753,388 L 743,375 L 738,360 L 740,345 L 745,330 Z" />

                {/* Antarctica (bottom) */}
                <path d="M 50,470 L 950,470 L 950,490 L 50,490 Z" opacity="0.7" />

                {/* Greenland */}
                <path d="M 320,50 L 340,48 L 360,52 L 370,65 L 375,80 L 370,95 L 355,105 L 335,108 L 318,103 L 308,90 L 305,75 L 310,60 Z" opacity="0.9" />

                {/* Japan */}
                <ellipse cx="830" cy="185" rx="15" ry="35" opacity="0.95" />

                {/* UK */}
                <ellipse cx="455" cy="120" rx="8" ry="20" opacity="0.95" transform="rotate(-15 455 120)" />

                {/* New Zealand */}
                <ellipse cx="880" cy="380" rx="8" ry="25" opacity="0.9" />
              </g>
            </svg>

            {/* Pointer-events enabled overlay for clicking */}
            <div className="absolute inset-0"></div>

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
