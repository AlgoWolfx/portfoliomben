import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Mobil kontrolü için yardımcı fonksiyon
const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;

const FogBackground: React.FC = React.memo(() => {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setMobile(isMobile());
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobilde sadece 1 katman, desktop'ta 3 katman
  const fogLayers = mobile ? 1 : 3;
  // Mobilde parçacık sayısını azalt
  const particleCount = mobile ? 5 : 15;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Fog Layer 1 */}
      {fogLayers >= 1 && (
        <motion.div
          className="absolute inset-0 opacity-30 will-change-transform"
          animate={{
            x: mobile ? [0, 50, 0] : [0, 100, 0],
            y: mobile ? [0, -25, 0] : [0, -50, 0],
          }}
          transition={{
            duration: mobile ? 30 : 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div 
            className="w-full h-full bg-gradient-to-br from-gray-600/20 to-transparent"
            style={{
              filter: `blur(${mobile ? 40 : 60}px)`,
              transform: `scale(${mobile ? 1.2 : 1.5}) translateZ(0)`,
              backfaceVisibility: 'hidden',
              perspective: 1000,
            }}
          />
        </motion.div>
      )}

      {/* Fog Layer 2 - Desktop only */}
      {fogLayers >= 2 && (
        <motion.div
          className="absolute inset-0 opacity-20 will-change-transform"
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
              transform: 'scale(1.3) translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: 1000,
            }}
          />
        </motion.div>
      )}

      {/* Fog Layer 3 - Desktop only */}
      {fogLayers >= 3 && (
        <motion.div
          className="absolute inset-0 opacity-25 will-change-transform"
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
              transform: 'scale(1.8) translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: 1000,
            }}
          />
        </motion.div>
      )}

      {/* Floating Particles - Reduced on mobile */}
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gray-400/20 rounded-full will-change-transform"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
          animate={{
            y: [0, mobile ? -50 : -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: mobile ? 12 : (8 + Math.random() * 4),
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
});

FogBackground.displayName = 'FogBackground';

export default FogBackground;