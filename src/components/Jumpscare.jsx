import { motion } from 'framer-motion';
import { playWrongSound } from '../utils/sounds';
import { useEffect } from 'react';

const Jumpscare = ({ jumpscare, onDismiss }) => {
  useEffect(() => {
    playWrongSound();
    const timer = setTimeout(() => {
      onDismiss();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

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
