import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const CoinDisplay = ({ className = '' }) => {
  const { profile } = useAuth();

  return (
    <motion.div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-neon-blue/30 ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        className="text-2xl"
        animate={{
          rotate: [0, 10, -10, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        🪙
      </motion.span>
      <div className="flex flex-col">
        <span className="text-xs text-gray-400">Coins</span>
        <motion.span
          className="text-xl font-bold text-neon-blue glow-text"
          key={profile?.coins || 0}
          initial={{ scale: 1.5, color: '#FFD700' }}
          animate={{ scale: 1, color: '#00d9ff' }}
          transition={{ duration: 0.3 }}
        >
          {profile?.coins?.toLocaleString() || 0}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default CoinDisplay;
