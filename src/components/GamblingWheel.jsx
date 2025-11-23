import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { addCoins } from '../utils/storage';

const GamblingWheel = ({ onBack }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [betAmount, setBetAmount] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef(null);

  // Wheel segments with multipliers and colors
  const segments = [
    { multiplier: 0, label: '0x', color: '#ef4444', probability: 0.30 }, // 30% - Red (lose all)
    { multiplier: 0.5, label: '0.5x', color: '#f97316', probability: 0.20 }, // 20% - Orange
    { multiplier: 1, label: '1x', color: '#eab308', probability: 0.20 }, // 20% - Yellow (break even)
    { multiplier: 1.5, label: '1.5x', color: '#84cc16', probability: 0.15 }, // 15% - Lime
    { multiplier: 2, label: '2x', color: '#22c55e', probability: 0.10 }, // 10% - Green
    { multiplier: 5, label: '5x', color: '#06b6d4', probability: 0.04 }, // 4% - Cyan
    { multiplier: 10, label: '10x', color: '#a855f7', probability: 0.01 }, // 1% - Purple
  ];

  const totalSegments = segments.length;
  const segmentAngle = 360 / totalSegments;

  const handleBetChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setBetAmount(Math.max(0, Math.min(value, profile?.coins || 0)));
  };

  const selectWinningSegment = () => {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (let i = 0; i < segments.length; i++) {
      cumulativeProbability += segments[i].probability;
      if (random <= cumulativeProbability) {
        return i;
      }
    }
    return 0; // Fallback
  };

  const spinWheel = async () => {
    if (isSpinning || !user || betAmount <= 0 || betAmount > profile?.coins) return;

    // Deduct bet amount
    await addCoins(user.id, -betAmount);
    await refreshProfile();

    setIsSpinning(true);
    setShowResult(false);
    setResult(null);

    // Determine winning segment
    const winningSegmentIndex = selectWinningSegment();
    const winningSegment = segments[winningSegmentIndex];

    // Calculate rotation (multiple full spins + landing position)
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const targetAngle = winningSegmentIndex * segmentAngle;
    // We need to land at the CENTER of the segment, pointer is at top (0°)
    // Adjust so the pointer lands in the middle of the segment
    const offsetAngle = segmentAngle / 2;
    const finalRotation = rotation + (spins * 360) + (360 - targetAngle - offsetAngle);

    setRotation(finalRotation);

    // Wait for spin to finish
    setTimeout(async () => {
      setIsSpinning(false);

      // Calculate winnings
      const winAmount = Math.floor(betAmount * winningSegment.multiplier);
      const netWin = winAmount - betAmount;

      // Add winnings if any
      if (winAmount > 0) {
        await addCoins(user.id, winAmount);
        await refreshProfile();
      }

      setResult({
        multiplier: winningSegment.multiplier,
        label: winningSegment.label,
        betAmount,
        winAmount,
        netWin,
      });
      setShowResult(true);
    }, 4000); // 4 second spin duration
  };

  const quickBet = (amount) => {
    setBetAmount(Math.min(amount, profile?.coins || 0));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4"
    >
      {/* Back Button - Top Left */}
      <button
        onClick={onBack}
        disabled={isSpinning}
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
            🎰 Test Your Luck! 🎰
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Spin the wheel and multiply your coins!
          </p>
          <p className="text-yellow-500 text-xs mt-2">
            Virtual coins only - No real money involved
          </p>
        </div>

        {/* Coin Balance */}
        <div className="text-center mb-6">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-full">
            <p className="text-2xl md:text-3xl font-bold text-yellow-400">
              {profile?.coins?.toLocaleString() || 0} 🪙
            </p>
          </div>
        </div>

        {/* Wheel Container */}
        <div className="relative mb-8">
          {/* Pointer at top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg" />
          </div>

          {/* Wheel */}
          <div className="relative w-full max-w-md mx-auto aspect-square">
            <div
              ref={wheelRef}
              className="absolute inset-0 rounded-full border-8 border-yellow-500 shadow-2xl overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              {segments.map((segment, index) => {
                const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
                const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

                // Calculate path for segment
                const x1 = 50 + 50 * Math.cos(startAngle);
                const y1 = 50 + 50 * Math.sin(startAngle);
                const x2 = 50 + 50 * Math.cos(endAngle);
                const y2 = 50 + 50 * Math.sin(endAngle);

                const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                // Text position (middle of segment)
                const textAngle = (index * segmentAngle + segmentAngle / 2) * (Math.PI / 180);
                const textX = 50 + 35 * Math.cos(textAngle - Math.PI / 2);
                const textY = 50 + 35 * Math.sin(textAngle - Math.PI / 2);

                return (
                  <svg
                    key={index}
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                  >
                    <path d={pathData} fill={segment.color} stroke="#000" strokeWidth="0.5" />
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-black text-white text-[8px] drop-shadow-lg"
                      transform={`rotate(${index * segmentAngle + segmentAngle / 2}, ${textX}, ${textY})`}
                    >
                      {segment.label}
                    </text>
                  </svg>
                );
              })}
            </div>

            {/* Center circle - Clickable to spin */}
            <button
              onClick={spinWheel}
              disabled={isSpinning || betAmount <= 0 || betAmount > (profile?.coins || 0)}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10 transition-all ${
                isSpinning || betAmount <= 0 || betAmount > (profile?.coins || 0)
                  ? 'cursor-not-allowed opacity-70'
                  : 'cursor-pointer hover:scale-110 hover:shadow-2xl active:scale-95'
              }`}
            >
              <span className="text-2xl">🎯</span>
            </button>
          </div>
        </div>

        {/* Betting Controls */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border-2 border-yellow-500/50 mb-6">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Place Your Bet</h3>

          {/* Bet Amount Input */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Bet Amount</label>
            <input
              type="number"
              value={betAmount}
              onChange={handleBetChange}
              disabled={isSpinning}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-xl font-bold text-center
                       focus:outline-none focus:border-yellow-500 disabled:opacity-50"
              min="0"
              max={profile?.coins || 0}
            />
          </div>

          {/* Quick Bet Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[100, 500, 1000, 5000].map((amount) => (
              <button
                key={amount}
                onClick={() => quickBet(amount)}
                disabled={isSpinning || amount > (profile?.coins || 0)}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {amount}
              </button>
            ))}
          </div>

          {/* Spin Button */}
          <motion.button
            whileHover={{ scale: isSpinning ? 1 : 1.05 }}
            whileTap={{ scale: isSpinning ? 1 : 0.95 }}
            onClick={spinWheel}
            disabled={isSpinning || betAmount <= 0 || betAmount > (profile?.coins || 0)}
            className={`w-full py-4 rounded-xl font-bold text-xl transition-all duration-300 ${
              isSpinning || betAmount <= 0 || betAmount > (profile?.coins || 0)
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-lg hover:shadow-yellow-500/50'
            }`}
          >
            {isSpinning ? '🎰 Spinning...' : '🎰 SPIN WHEEL!'}
          </motion.button>
        </div>

        {/* Odds Display */}
        <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
          <h4 className="text-center text-gray-400 text-sm font-bold mb-3">ODDS</h4>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {segments.map((segment, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center mb-1 font-bold text-white"
                  style={{ backgroundColor: segment.color }}
                >
                  {segment.label}
                </div>
                <p className="text-xs text-gray-400">{(segment.probability * 100).toFixed(0)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={`bg-gradient-to-br rounded-2xl p-8 max-w-md w-full border-4 ${
                result.netWin > 0
                  ? 'from-green-900 to-green-800 border-green-500'
                  : result.netWin === 0
                  ? 'from-yellow-900 to-yellow-800 border-yellow-500'
                  : 'from-red-900 to-red-800 border-red-500'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {result.netWin > 0 ? '🎉' : result.netWin === 0 ? '😐' : '😢'}
                </div>
                <h2 className="text-4xl font-black text-white mb-2">
                  {result.label}
                </h2>
                <p className="text-gray-300 mb-6">
                  You {result.netWin > 0 ? 'won' : result.netWin === 0 ? 'broke even' : 'lost'}!
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-400">Bet:</span>
                    <span className="text-white font-bold">{result.betAmount.toLocaleString()} 🪙</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-400">Won:</span>
                    <span className="text-white font-bold">{result.winAmount.toLocaleString()} 🪙</span>
                  </div>
                  <div className="border-t border-white/20 pt-2">
                    <div className="flex justify-between text-xl">
                      <span className="text-gray-300 font-bold">Net:</span>
                      <span className={`font-black ${
                        result.netWin > 0 ? 'text-green-400' : result.netWin === 0 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {result.netWin > 0 ? '+' : ''}{result.netWin.toLocaleString()} 🪙
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowResult(false)}
                  className="w-full py-3 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GamblingWheel;
