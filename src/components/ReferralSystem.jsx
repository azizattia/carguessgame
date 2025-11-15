import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  generateReferralCode,
  getUserReferralCode,
  getReferralStats
} from '../utils/storage';

const ReferralSystem = ({ onBack }) => {
  const { user, profile } = useAuth();
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState({
    totalReferrals: 0,
    completedReferrals: 0,
    pendingReferrals: 0,
    totalEarned: 0
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferralData();
  }, [user]);

  const loadReferralData = async () => {
    if (!user || !profile) return;

    setLoading(true);

    // Get or generate referral code
    let codeResult = await getUserReferralCode(user.id);

    if (!codeResult.code) {
      // Generate a new code if user doesn't have one
      codeResult = await generateReferralCode(user.id, profile.username);
    }

    if (codeResult.code) {
      setReferralCode(codeResult.code);
    }

    // Get referral stats
    const statsResult = await getReferralStats(user.id);
    setStats(statsResult);

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = `${window.location.origin}?ref=${referralCode}`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 md:p-4">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-4 md:mb-8"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-neon-purple glow-text mb-2">
          🎁 Referral System
        </h1>
        <p className="text-sm md:text-lg text-gray-400">
          Invite friends and earn rewards together!
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-neon-blue/30"
        >
          <h2 className="text-xl md:text-2xl font-bold text-neon-blue mb-3 md:mb-4">
            How It Works
          </h2>
          <div className="space-y-2 md:space-y-3 text-sm md:text-base">
            <div className="flex items-start gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">1️⃣</span>
              <p className="text-gray-300">Share your unique referral code with friends</p>
            </div>
            <div className="flex items-start gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">2️⃣</span>
              <p className="text-gray-300">They use your code when signing up</p>
            </div>
            <div className="flex items-start gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">3️⃣</span>
              <p className="text-gray-300">When they reach <span className="text-neon-purple font-bold">Level 15</span>, you BOTH get <span className="text-yellow-400 font-bold">5,000 coins</span>!</p>
            </div>
          </div>
        </motion.div>

        {/* Your Referral Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-neon-purple/30"
        >
          <h2 className="text-xl md:text-2xl font-bold text-neon-purple mb-3 md:mb-4">
            Your Referral Code
          </h2>

          <div className="bg-black/40 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
            <div className="flex items-center justify-between gap-2 md:gap-4">
              <div className="text-2xl md:text-4xl font-bold text-neon-blue glow-text tracking-wider">
                {referralCode}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                className="px-3 md:px-4 py-2 bg-neon-blue text-black rounded-lg font-bold hover:bg-cyan-400 transition-colors text-sm md:text-base"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </motion.button>
            </div>
          </div>

          <div className="bg-black/40 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm text-gray-400 mb-2">Share this link:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 bg-black/60 text-white px-2 md:px-3 py-1.5 md:py-2 rounded text-xs md:text-sm border border-neon-purple/30"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyShareLink}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-neon-purple text-white rounded-lg font-bold hover:bg-purple-500 transition-colors text-sm md:text-base"
              >
                {copied ? '✓' : '📋'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-neon-pink/30"
        >
          <h2 className="text-xl md:text-2xl font-bold text-neon-pink mb-3 md:mb-4">
            Your Stats
          </h2>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-black/40 rounded-lg p-3 md:p-4 text-center">
              <p className="text-xs md:text-sm text-gray-400 mb-1">Total Referrals</p>
              <p className="text-2xl md:text-3xl font-bold text-neon-blue">{stats.totalReferrals}</p>
            </div>

            <div className="bg-black/40 rounded-lg p-3 md:p-4 text-center">
              <p className="text-xs md:text-sm text-gray-400 mb-1">Completed</p>
              <p className="text-2xl md:text-3xl font-bold text-green-400">{stats.completedReferrals}</p>
            </div>

            <div className="bg-black/40 rounded-lg p-3 md:p-4 text-center">
              <p className="text-xs md:text-sm text-gray-400 mb-1">Pending (Not Lvl 15)</p>
              <p className="text-2xl md:text-3xl font-bold text-yellow-400">{stats.pendingReferrals}</p>
            </div>

            <div className="bg-black/40 rounded-lg p-3 md:p-4 text-center">
              <p className="text-xs md:text-sm text-gray-400 mb-1">Total Earned</p>
              <p className="text-2xl md:text-3xl font-bold text-neon-purple">
                🪙 {stats.totalEarned.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="w-full px-4 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple
                   rounded-xl shadow-lg hover:shadow-neon-blue/50 transition-all duration-300"
        >
          ← Back to Game
        </motion.button>
      </div>
    </div>
  );
};

export default ReferralSystem;
