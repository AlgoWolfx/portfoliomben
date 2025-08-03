import { useState, useEffect, useCallback, useMemo } from 'react';

interface MobileOptimizationSettings {
  isMobile: boolean;
  isLowEndDevice: boolean;
  shouldReduceAnimations: boolean;
  prefersReducedMotion: boolean;
  connectionType: 'slow' | 'fast' | 'unknown';
}

// Device performance detection
const detectDevicePerformance = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for low-end device indicators
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const deviceMemory = (navigator as any).deviceMemory || 4;
  
  // Consider low-end if less than 4 cores or less than 4GB RAM
  return hardwareConcurrency < 4 || deviceMemory < 4;
};

// Connection type detection
const detectConnectionType = (): 'slow' | 'fast' | 'unknown' => {
  if (typeof window === 'undefined') return 'unknown';
  
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (!connection) return 'unknown';
  
  // Check for slow connections
  const slowConnections = ['slow-2g', '2g', '3g'];
  if (slowConnections.includes(connection.effectiveType)) {
    return 'slow';
  }
  
  return 'fast';
};

// Battery level detection
const getBatteryLevel = async (): Promise<number> => {
  if (typeof window === 'undefined') return 1;
  
  try {
    const battery = await (navigator as any).getBattery?.();
    return battery?.level || 1;
  } catch {
    return 1;
  }
};

export const useMobileOptimization = () => {
  const [settings, setSettings] = useState<MobileOptimizationSettings>({
    isMobile: false,
    isLowEndDevice: false,
    shouldReduceAnimations: false,
    prefersReducedMotion: false,
    connectionType: 'unknown'
  });

  const [batteryLevel, setBatteryLevel] = useState<number>(1);

  // Check if device is mobile
  const checkIsMobile = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  // Check for reduced motion preference
  const checkPrefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Update settings
  const updateSettings = useCallback(async () => {
    const isMobile = checkIsMobile();
    const isLowEndDevice = detectDevicePerformance();
    const prefersReducedMotion = checkPrefersReducedMotion();
    const connectionType = detectConnectionType();
    const batteryLevel = await getBatteryLevel();

    // Determine if animations should be reduced
    const shouldReduceAnimations = 
      prefersReducedMotion || 
      isLowEndDevice || 
      (isMobile && connectionType === 'slow') ||
      batteryLevel < 0.2; // Low battery

    setSettings({
      isMobile,
      isLowEndDevice,
      shouldReduceAnimations,
      prefersReducedMotion,
      connectionType
    });

    setBatteryLevel(batteryLevel);
  }, [checkIsMobile, checkPrefersReducedMotion]);

  // Initialize and handle resize
  useEffect(() => {
    updateSettings();

    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateSettings, 150);
    };

    window.addEventListener('resize', debouncedUpdate);
    
    // Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateSettings);
    }

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateSettings);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedUpdate);
      
      if (connection) {
        connection.removeEventListener('change', updateSettings);
      }
      
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateSettings);
      }
    };
  }, [updateSettings]);

  // Animation configuration based on settings
  const animationConfig = useMemo(() => {
    if (settings.shouldReduceAnimations) {
      return {
        duration: 0.1,
        ease: 'linear' as const,
        scale: { disabled: true },
        opacity: { disabled: false }, // Keep opacity for accessibility
        transform: { disabled: true }
      };
    }

    if (settings.isMobile) {
      return {
        duration: 0.3,
        ease: 'easeOut' as const,
        scale: { factor: 0.98, hover: false },
        opacity: { disabled: false },
        transform: { reduced: true }
      };
    }

    return {
      duration: 0.6,
      ease: 'easeInOut' as const,
      scale: { factor: 1.05, hover: true },
      opacity: { disabled: false },
      transform: { reduced: false }
    };
  }, [settings]);

  // Performance recommendations
  const performanceHints = useMemo(() => ({
    shouldLazyLoad: settings.isMobile || settings.connectionType === 'slow',
    shouldPreloadImages: settings.connectionType === 'fast' && batteryLevel > 0.5,
    shouldUseWebP: settings.connectionType !== 'slow',
    shouldReduceImageQuality: settings.connectionType === 'slow' || settings.isLowEndDevice,
    chunkSizeLimit: settings.isLowEndDevice ? 200 : 500, // KB
    maxConcurrentRequests: settings.isLowEndDevice ? 2 : 6
  }), [settings, batteryLevel]);

  return {
    ...settings,
    batteryLevel,
    animationConfig,
    performanceHints,
    updateSettings
  };
};

export default useMobileOptimization;