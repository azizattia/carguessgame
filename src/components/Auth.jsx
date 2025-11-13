import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { playClickSound } from '../utils/sounds';

const Auth = ({ onShowLeaderboard }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

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

        const { error, message } = await signUp(email, password, username);
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
