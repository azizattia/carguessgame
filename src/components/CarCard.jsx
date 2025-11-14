import { useState } from 'react';
import { motion } from 'framer-motion';

const CarCard = ({ car, showPrice, label, isRevealing = false }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-effect rounded-2xl overflow-hidden shadow-2xl border-2 border-neon-blue/30
               hover:border-neon-blue/60 transition-all duration-300"
    >
      {/* Label */}
      <div className="bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 px-4 py-2 text-center">
        <p className="text-sm font-semibold text-neon-blue">{label}</p>
      </div>

      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="text-6xl mb-4">🚗</div>
            <div className="text-2xl font-bold text-neon-blue glow-text">{car.make}</div>
            <div className="text-xl text-neon-purple">{car.model}</div>
          </div>
        ) : (
          <>
            <img
              src={car.imageURL}
              alt={`${car.make} ${car.model}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        )}
      </div>

      {/* Car Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-1 text-neon-blue glow-text">{car.make}</h3>
        <p className="text-lg text-gray-300 mb-2">{car.model}</p>

        {/* Car Details */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 text-xs rounded-full bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
            {car.year}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full border ${
            car.condition === 'Brand New'
              ? 'bg-green-500/20 text-green-400 border-green-500/30'
              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
          }`}>
            {car.condition}
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
            {car.mileage === 0 ? '0 km' : `${car.mileage.toLocaleString()} km`}
          </span>
        </div>

        {/* Price */}
        <div className="relative h-16 flex items-center justify-center">
          {showPrice ? (
            <motion.div
              initial={isRevealing ? { scale: 0, rotate: -180 } : { scale: 1 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-3xl font-bold text-neon-purple glow-text"
            >
              ${car.price.toLocaleString()}
            </motion.div>
          ) : (
            <div className="text-4xl text-gray-600">???</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
