import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRandomBrand, calculateDistance } from '../data/carOrigins';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons - using URL encoding to support all characters
const guessIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44">
      <path d="M16 0C7.163 0 0 7.163 0 16s16 28 16 28 16-19.163 16-28S24.837 0 16 0z" fill="#ef4444"/>
      <circle cx="16" cy="16" r="8" fill="white"/>
      <text x="16" y="22" font-size="16" text-anchor="middle" fill="#ef4444">?</text>
    </svg>
  `),
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -44]
});

const correctIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44">
      <path d="M16 0C7.163 0 0 7.163 0 16s16 28 16 28 16-19.163 16-28S24.837 0 16 0z" fill="#22c55e"/>
      <circle cx="16" cy="16" r="8" fill="white"/>
      <polygon points="16,10 18,14 23,14 19,17 20,22 16,19 12,22 13,17 9,14 14,14" fill="white"/>
    </svg>
  `),
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -44]
});

// Map click handler component
function MapClickHandler({ onMapClick, disabled }) {
  useMapEvents({
    click: (e) => {
      if (!disabled) {
        onMapClick(e.latlng);
      }
    }
  });
  return null;
}

const GeographyMinigame = ({ onComplete }) => {
  const [selectedBrand] = useState(() => getRandomBrand());
  const [guessPosition, setGuessPosition] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [reward, setReward] = useState(null);
  const [message, setMessage] = useState('');
  const [distance, setDistance] = useState(null);
  const mapRef = useRef(null);

  const handleMapClick = (latlng) => {
    if (showResult) return;

    const { lat, lng } = latlng;
    setGuessPosition([lat, lng]);

    // Calculate distance from clicked point to actual city
    const dist = calculateDistance(
      lat,
      lng,
      selectedBrand.coordinates[1], // lat
      selectedBrand.coordinates[0]  // lon
    );

    setDistance(Math.round(dist));

    // Determine reward based on accuracy
    let earnedCoins = 0;
    let resultMessage = '';

    if (dist < 100) {
      // Within 100km - AMAZING!
      earnedCoins = 2000;
      resultMessage = `🎯 INCREDIBLE! Only ${Math.round(dist)}km away!`;
    } else if (dist < 300) {
      // Within 300km - Very good
      earnedCoins = 1000;
      resultMessage = `🌟 EXCELLENT! ${Math.round(dist)}km away!`;
    } else if (dist < 500) {
      // Within 500km - Good
      earnedCoins = 500;
      resultMessage = `✅ GREAT! ${Math.round(dist)}km away!`;
    } else if (dist < 1000) {
      // Within 1000km - Decent
      earnedCoins = 200;
      resultMessage = `👍 GOOD! ${Math.round(dist)}km away!`;
    } else if (dist < 2000) {
      // Within 2000km - OK
      earnedCoins = 50;
      resultMessage = `📍 Not bad! ${Math.round(dist)}km away`;
    } else {
      // Too far
      earnedCoins = 0;
      resultMessage = `❌ Too far! ${Math.round(dist)}km away`;
    }

    setReward(earnedCoins);
    setMessage(resultMessage);
    setShowResult(true);

    // Auto complete after 4 seconds
    setTimeout(() => {
      onComplete(earnedCoins);
    }, 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 z-50 flex items-center justify-center p-2 md:p-4"
    >
      <div className="max-w-7xl w-full h-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-2 md:mb-4"
        >
          <h1 className="text-2xl md:text-4xl font-black text-white mb-1 md:mb-2">
            🌍 GEOGRAPHY CHALLENGE 🌍
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Where is <span className="text-yellow-400 font-bold">{selectedBrand.brand}</span> {selectedBrand.flag} from?
          </p>
          <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2">
            Click on the map to guess the location of <span className="font-bold">{selectedBrand.city}</span>!
          </p>
          <div className="mt-2 md:mt-3 flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm">
            <div className="text-yellow-400">🎯 &lt;100km: 2000 coins</div>
            <div className="text-green-400">🌟 &lt;300km: 1000 coins</div>
            <div className="text-blue-400">✅ &lt;500km: 500 coins</div>
          </div>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 relative bg-gray-800 rounded-lg md:rounded-2xl overflow-hidden shadow-2xl border-2 md:border-4 border-blue-500"
          style={{ minHeight: '300px' }}
        >
          <MapContainer
            center={[20, 0]}
            zoom={2}
            minZoom={2}
            maxZoom={6}
            className="w-full h-full"
            zoomControl={true}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler onMapClick={handleMapClick} disabled={showResult} />

            {/* User's guess marker */}
            {guessPosition && (
              <Marker position={guessPosition} icon={guessIcon}>
                <Popup>Your guess</Popup>
              </Marker>
            )}

            {/* Actual location marker (shown after guess) */}
            {showResult && (
              <Marker
                position={[selectedBrand.coordinates[1], selectedBrand.coordinates[0]]}
                icon={correctIcon}
              >
                <Popup>
                  <strong>{selectedBrand.city}, {selectedBrand.country}</strong>
                  <br />
                  {selectedBrand.brand} {selectedBrand.flag}
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Result Overlay */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center pointer-events-none"
              >
                <div className="text-center px-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                  >
                    <h2 className="text-2xl md:text-5xl font-black text-white mb-2 md:mb-4">
                      {message}
                    </h2>
                    <p className="text-lg md:text-2xl text-gray-300 mb-2 md:mb-4">
                      Actual location: <span className="text-yellow-400 font-bold">{selectedBrand.city}, {selectedBrand.country}</span> {selectedBrand.flag}
                    </p>
                    {reward > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-6xl font-black text-yellow-400"
                      >
                        +{reward} 🪙
                      </motion.div>
                    )}
                    {reward === 0 && (
                      <p className="text-xl md:text-2xl text-red-400 mt-2 md:mt-4">
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
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-2 md:mt-4 text-gray-400 text-xs md:text-sm"
          >
            💡 Tip: Use zoom controls to get a closer view! The closer you click to the actual city, the more coins you earn!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GeographyMinigame;
