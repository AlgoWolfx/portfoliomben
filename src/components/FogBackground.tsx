import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FogBackground: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true } as AddEventListenerOptions);
    return () => window.removeEventListener('resize', checkMobile as EventListener);
  }, []);

  // Mobilde ağır animasyonları kapatıp statik, hafif bir arka plan göster
  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            filter: 'blur(40px)',
            transform: 'scale(1.2)'
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-600/20 to-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Fog Layer 1 */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div 
          className="w-full h-full bg-gradient-to-br from-gray-600/20 to-transparent"
          style={{
            filter: 'blur(60px)',
            transform: 'scale(1.5)',
          }}
        />
      </motion.div>

      {/* Fog Layer 2 */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          x: [0, -80, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div 
          className="w-full h-full bg-gradient-to-tl from-gray-500/15 to-transparent"
          style={{
            filter: 'blur(80px)',
            transform: 'scale(1.3)',
          }}
        />
      </motion.div>

      {/* Fog Layer 3 */}
      <motion.div
        className="absolute inset-0 opacity-25"
        animate={{
          x: [0, 60, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div 
          className="w-full h-full bg-gradient-to-r from-gray-400/10 via-gray-600/20 to-transparent"
          style={{
            filter: 'blur(100px)',
            transform: 'scale(1.8)',
          }}
        />
      </motion.div>

      {/* Floating Particles - Azaltıldı */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gray-400/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default FogBackground;