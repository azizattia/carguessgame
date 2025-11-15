import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { playClickSound } from '../utils/sounds';

const Auth = ({ onShowLeaderboard }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  // Check for referral code in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode.toUpperCase());
      setIsLogin(false); // Switch to register mode
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error } = await signIn(email, password);
        if (error) {
          setError(error);
        } else {
          playClickSound();
        }
      } else {
        // Register
        if (!username.trim()) {
          setError('Username is required');
          setLoading(false);
          return;
        }

        if (username.length < 3) {
          setError('Username must be at least 3 characters');
          setLoading(false);
          return;
        }

        const { error, message } = await signUp(email, password, username, referralCode);
        if (error) {
          setError(error);
        } else {
          playClickSound();
          setError(message || 'Account created successfully!');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    playClickSound();
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error);
    }
  };

  const handleLeaderboard = () => {
    playClickSound();
    onShowLeaderboard();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold text-center mb-4 glow-text text-neon-blue"
        >
          Car Price Challenge
        </motion.h1>

        <motion.p
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-center mb-8 text-neon-purple glow-text"
        >
          Higher or Lower?
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-effect rounded-2xl p-8 shadow-neon-blue mb-4"
        >
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                playClickSound();
              }}
              className={`flex-1 py-3 rounded-lg font-bold transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon-blue'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                playClickSound();
              }}
              className={`flex-1 py-3 rounded-lg font-bold transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon-purple'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Google Sign In Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 bg-white text-gray-900 font-semibold rounded-xl
                       flex items-center justify-center gap-3 hover:bg-gray-100
                       transition-all duration-300 shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a unique username"
                  className="w-full px-4 py-3 bg-black/50 border-2 border-neon-blue/30 rounded-xl
                           focus:border-neon-blue focus:outline-none focus:shadow-neon-blue
                           transition-all duration-300"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-black/50 border-2 border-neon-blue/30 rounded-xl
                         focus:border-neon-blue focus:outline-none focus:shadow-neon-blue
                         transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-black/50 border-2 border-neon-blue/30 rounded-xl
                         focus:border-neon-blue focus:outline-none focus:shadow-neon-blue
                         transition-all duration-300"
                required
                minLength={6}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Referral Code <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="Enter friend's code"
                  className="w-full px-4 py-3 bg-black/50 border-2 border-neon-purple/30 rounded-xl
                           focus:border-neon-purple focus:outline-none focus:shadow-neon-purple
                           transition-all duration-300 uppercase"
                  maxLength={12}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You'll both get 5,000 coins when you reach level 15!
                </p>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg text-sm ${
                  error.includes('created') || error.includes('verify')
                    ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                    : 'bg-red-500/20 text-red-300 border border-red-500/50'
                }`}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple
                       rounded-xl shadow-neon-blue hover:shadow-neon-purple transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
            </motion.button>
          </form>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLeaderboard}
          className="w-full py-4 text-xl font-bold glass-effect rounded-xl
                   border-2 border-neon-purple/50 hover:border-neon-purple hover:shadow-neon-purple
                   transition-all duration-300"
        >
          View Leaderboard
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Auth;
