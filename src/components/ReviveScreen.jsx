import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const ReviveScreen = ({ score, reviveCount, onRevive, onDecline }) => {
  const { profile } = useAuth();

  // Revive costs: 1st = 1000, 2nd = 5000, 3rd = 10000, then no more
  const getReviveCost = (count) => {
    switch (count) {
      case 0:
        return 1000;
      case 1:
        return 5000;
      case 2:
        return 10000;
      default:
        return null; // No more revives
    }
  };

  const reviveCost = getReviveCost(reviveCount);
  const canAfford = profile && profile.coins >= reviveCost;
  const hasRevivesLeft = reviveCost !== null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f0f0f]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full"
      >
        {/* Skull/Death Animation */}
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="text-center mb-6 md:mb-8"
        >
          <div className="text-6xl md:text-8xl mb-3 md:mb-4">💀</div>
          <h1 className="text-3xl md:text-5xl font-bold text-red-400 glow-text mb-2">
            GAME OVER
          </h1>
          <p className="text-lg md:text-2xl text-gray-300">
            Score: <span className="text-neon-pink font-bold">{score}</span>
          </p>
        </motion.div>

        {/* Revive Option */}
        {hasRevivesLeft ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-yellow-500/50 mb-4 md:mb-6"
          >
            <div className="text-center mb-4 md:mb-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-4xl md:text-5xl mb-2 md:mb-3"
              >
                ⚡
              </motion.div>
              <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-2">
                Continue Playing?
              </h2>
              <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">
                Revive and keep your progress!
              </p>

              {/* Revive Count Indicator */}
              <div className="flex justify-center gap-2 mb-3 md:mb-4">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                      index < reviveCount
                        ? 'bg-gray-600'
                        : 'bg-yellow-400'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs md:text-sm text-gray-400">
                Revive {reviveCount + 1}/3 • {3 - reviveCount - 1} left after this
              </p>
            </div>

            {/* Cost Display */}
            <div className="bg-black/40 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <p className="text-center text-xs md:text-sm text-gray-400 mb-2">Cost to Revive:</p>
              <div className="text-center text-2xl md:text-4xl font-bold text-yellow-400 glow-text mb-2">
                🪙 {reviveCost.toLocaleString()}
              </div>
              <p className="text-center text-xs md:text-sm text-gray-400">
                Your balance: <span className={canAfford ? 'text-green-400' : 'text-red-400'}>
                  {profile?.coins?.toLocaleString() || 0} coins
                </span>
              </p>
            </div>

            {/* Revive Button */}
            <motion.button
              whileHover={canAfford ? { scale: 1.05 } : {}}
              whileTap={canAfford ? { scale: 0.95 } : {}}
              onClick={canAfford ? onRevive : undefined}
              disabled={!canAfford}
              className={`w-full px-4 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold rounded-xl shadow-lg
                       transition-all duration-300 border-2 mb-3 ${
                canAfford
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-yellow-500/50 border-yellow-500/50'
                  : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
              }`}
            >
              {canAfford ? '⚡ REVIVE & CONTINUE ⚡' : '❌ Not Enough Coins'}
            </motion.button>

            {!canAfford && (
              <p className="text-center text-xs md:text-sm text-red-400 mb-3">
                You need {(reviveCost - (profile?.coins || 0)).toLocaleString()} more coins!
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-red-500/50 mb-4 md:mb-6 text-center"
          >
            <div className="text-4xl md:text-5xl mb-2 md:mb-3">🚫</div>
            <h2 className="text-lg md:text-2xl font-bold text-red-400 mb-2">
              No Revives Left
            </h2>
            <p className="text-sm md:text-base text-gray-400">
              You've used all 3 revives for this game
            </p>
          </motion.div>
        )}

        {/* Decline Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDecline}
          className="w-full px-4 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold glass-effect rounded-xl
                   border-2 border-neon-pink/50 hover:border-neon-pink hover:shadow-neon-pink
                   transition-all duration-300"
        >
          {hasRevivesLeft ? 'No Thanks, End Game' : 'View Results'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ReviveScreen;
