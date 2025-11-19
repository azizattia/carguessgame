import { motion } from 'framer-motion';

const Terms = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 max-w-2xl w-full border-2 border-neon-blue/50 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-neon-blue glow-text mb-2">
            Terms & Conditions
          </h2>
          <p className="text-gray-400 text-sm">Please read carefully before playing</p>
        </div>

        {/* Content */}
        <div className="space-y-4 text-gray-300 text-sm md:text-base mb-6">
          <section>
            <h3 className="text-xl font-bold text-white mb-2">🎮 Entertainment Purposes Only</h3>
            <p>
              Car Price Challenge is a free-to-play game designed for entertainment purposes only.
              All in-game coins, items, and rewards are virtual and have <strong className="text-yellow-400">NO REAL-WORLD VALUE</strong>.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-2">🪙 Virtual Currency</h3>
            <p>
              In-game coins are virtual currency that can only be used within the game. They:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Cannot be exchanged for real money</li>
              <li>Cannot be transferred to other users</li>
              <li>Cannot be redeemed for goods or services</li>
              <li>Have no monetary value whatsoever</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-2">🎰 Gambling Features</h3>
            <p>
              This game includes gambling-style features such as the "Test Your Luck" wheel.
              These features use virtual coins only and are provided for entertainment.
              By using these features, you acknowledge that:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>No real money is involved</li>
              <li>You may lose virtual coins</li>
              <li>Outcomes are based on random chance</li>
              <li>This is not real gambling</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-2">⚠️ Age Requirement</h3>
            <p>
              By playing this game, you confirm that you are at least 18 years old or have
              parental consent to play.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-2">📜 Account & Data</h3>
            <p>
              Your account data, including coins and progress, is stored securely.
              We reserve the right to modify, suspend, or terminate accounts that violate
              these terms or engage in fraudulent behavior.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-2">🔄 Changes to Terms</h3>
            <p>
              We may update these terms at any time. Continued use of the game constitutes
              acceptance of any changes.
            </p>
          </section>

          <section className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mt-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">⚡ Important Disclaimer</h3>
            <p className="text-yellow-200">
              This is a FREE game. We will NEVER ask you to pay real money for coins or any
              in-game items. If you encounter any such requests, please report them immediately.
            </p>
          </section>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-bold text-lg
                   hover:shadow-lg hover:shadow-neon-blue/50 transition-all duration-300"
        >
          I Understand & Agree
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Terms;
