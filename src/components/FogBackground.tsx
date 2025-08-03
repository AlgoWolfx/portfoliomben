import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Mobil cihaz kontrolü
const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;

const FogBackground: React.FC = React.memo(() => {
  // Mobil için optimize edilmiş parçacık sayısı
  const particleCount = useMemo(() => {
    return isMobile() ? 8 : 15; // Mobilde daha az parçacık
  }, []);

  // Mobil için optimize edilmiş animasyon ayarları
  const fogAnimationSettings = useMemo(() => ({
    mobile: {
      duration: 30, // Daha yavaş animasyon
      ease: "linear" as const
    },
    desktop: {
      duration: 20,
      ease: "linear" as const
    }
  }), []);

  const mobile = isMobile();
  const animationConfig = mobile ? fogAnimationSettings.mobile : fogAnimationSettings.desktop;

  // Parçacık animasyonları - memoized
  const particleAnimations = useMemo(() => 
    Array.from({ length: particleCount }, (_, i) => ({
      key: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      },
      animate: {
        y: [0, -100, 0],
        opacity: [0, 1, 0],
      },
      transition: {
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        delay: Math.random() * 8,
        ease: "easeInOut"
      }
    })), [particleCount]
  );

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
          duration: animationConfig.duration,
          repeat: Infinity,
          ease: animationConfig.ease
        }}
        // GPU katmanı optimizasyonu
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      >
        <div 
          className="w-full h-full bg-gradient-to-br from-gray-600/20 to-transparent"
          style={{
            filter: mobile ? 'blur(40px)' : 'blur(60px)', // Mobilde daha az blur
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
          duration: animationConfig.duration + 5,
          repeat: Infinity,
          ease: animationConfig.ease
        }}
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      >
        <div 
          className="w-full h-full bg-gradient-to-tl from-gray-500/15 to-transparent"
          style={{
            filter: mobile ? 'blur(60px)' : 'blur(80px)',
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
          duration: animationConfig.duration + 10,
          repeat: Infinity,
          ease: animationConfig.ease
        }}
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      >
        <div 
          className="w-full h-full bg-gradient-to-r from-gray-400/10 via-gray-600/20 to-transparent"
          style={{
            filter: mobile ? 'blur(80px)' : 'blur(100px)',
            transform: 'scale(1.8)',
          }}
        />
      </motion.div>

      {/* Floating Particles - Optimized */}
      {particleAnimations.map((particle) => (
        <motion.div
          key={particle.key}
          className="absolute w-2 h-2 bg-gray-400/20 rounded-full"
          style={{
            ...particle.style,
            willChange: 'transform, opacity',
            transform: 'translateZ(0)'
          }}
          animate={particle.animate}
          transition={particle.transition}
        />
      ))}
    </div>
  );
});

FogBackground.displayName = 'FogBackground';

export default FogBackground;