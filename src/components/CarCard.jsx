import { motion } from 'framer-motion';

const CarCard = ({ car, showPrice, label, isRevealing = false }) => {
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
      <div className="relative h-64 overflow-hidden bg-black/30">
        <img
          src={car.imageURL}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500x300/0f0f0f/00f0ff?text=' +
              encodeURIComponent(car.make + ' ' + car.model);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Car Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-1 text-neon-blue glow-text">{car.make}</h3>
        <p className="text-lg text-gray-300 mb-4">{car.model}</p>

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
