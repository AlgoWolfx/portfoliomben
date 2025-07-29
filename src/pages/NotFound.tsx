import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import FogBackground from '../components/FogBackground';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <FogBackground />
      <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-md w-full text-center">
          {/* 404 Image */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="mb-8"
          >
            <motion.img 
              src="/404-image.png" 
              alt="404 Not Found" 
              className="w-64 h-64 mx-auto object-contain opacity-80"
              animate={{
                x: [0, 15, -12, 8, -3, 0],
                y: [0, -8, 12, -6, 8, 0],
                rotate: [0, 3, -2, 1, -0.5, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 0
              }}
            />
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-400 text-lg">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          {/* Return Home Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={20} className="mr-2" />
              Return Home
            </motion.button>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Animated Lines */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`line-${i}`}
                className="absolute bg-gray-700/20"
                style={{
                  height: '1px',
                  width: '100%',
                  left: 0,
                  top: `${20 + i * 15}%`,
                }}
                animate={{
                  x: ['-100%', '100%'],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 15 + i * 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}

            {/* Glitch Effect */}
            <motion.div
              animate={{
                opacity: [0, 0.015, 0],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: 5 + Math.random() * 10,
              }}
              className="absolute inset-0 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 