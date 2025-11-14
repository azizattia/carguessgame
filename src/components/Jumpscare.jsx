import { motion } from 'framer-motion';
import { playWrongSound } from '../utils/sounds';
import { useEffect } from 'react';

const Jumpscare = ({ jumpscare, onDismiss }) => {
  useEffect(() => {
    playWrongSound();
    const timer = setTimeout(() => {
      onDismiss();
    }, jumpscare.isSpinningCat ? 3000 : 2000);

    return () => clearTimeout(timer);
  }, [onDismiss, jumpscare.isSpinningCat]);

  // Special spinning cat meme
  if (jumpscare.isSpinningCat) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-blue-500/30 backdrop-blur-md flex items-center justify-center z-[100]"
        onClick={onDismiss}
      >
        <div className="text-center">
          {/* Spinning cat with distortion */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 0.8, 1.3, 1],
              x: [0, -30, 30, -20, 20, 0],
              y: [0, -20, 20, -30, 0],
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 0.5, ease: "linear" },
              scale: { repeat: Infinity, duration: 0.3 },
              x: { repeat: Infinity, duration: 0.4 },
              y: { repeat: Infinity, duration: 0.35 },
            }}
            className="text-[25rem] leading-none mb-8 filter drop-shadow-2xl"
            style={{
              textShadow: '0 0 100px rgba(255, 0, 255, 0.8), 0 0 50px rgba(0, 255, 255, 0.6)',
              filter: 'hue-rotate(0deg)',
              animation: 'hueRotate 0.5s infinite linear'
            }}
          >
            {jumpscare.emoji}
          </motion.div>

          {/* Glitchy text */}
          <motion.h1
            animate={{
              scale: [1, 1.4, 0.9, 1.3, 1],
              x: [0, -10, 10, -5, 5, 0],
              rotate: [0, -2, 2, -1, 1, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.2
            }}
            className="text-6xl md:text-9xl font-bold mb-4"
            style={{
              background: 'linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(255, 0, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.6)',
              fontFamily: 'Impact, sans-serif',
              letterSpacing: '0.1em',
              filter: 'blur(0.5px)'
            }}
          >
            {jumpscare.text}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.3 }}
            className="text-xl text-white mt-4"
          >
            (Click to escape the madness)
          </motion.p>
        </div>

        <style>{`
          @keyframes hueRotate {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
          }
        `}</style>
      </motion.div>
    );
  }

  // Regular jumpscares
  return (
    <motion.div
      initial={{ scale: 0, rotate: 0 }}
      animate={{
        scale: [0, 1.5, 1],
        rotate: [0, 360, 720, 360, 0],
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100]"
      onClick={onDismiss}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, -5, 5, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 0.3
        }}
        className="text-center"
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.5
          }}
          className="text-[20rem] leading-none mb-8 filter drop-shadow-2xl"
          style={{
            textShadow: '0 0 100px rgba(255, 0, 0, 0.8), 0 0 50px rgba(255, 255, 0, 0.6)'
          }}
        >
          {jumpscare.emoji}
        </motion.div>

        <motion.h1
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.4
          }}
          className="text-6xl md:text-8xl font-bold text-red-500 mb-4"
          style={{
            textShadow: '0 0 30px rgba(255, 0, 0, 0.8), 0 0 60px rgba(255, 0, 0, 0.6)',
            fontFamily: 'Impact, sans-serif',
            letterSpacing: '0.2em'
          }}
        >
          {jumpscare.text}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xl text-gray-400"
        >
          (Click to continue)
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Jumpscare;
