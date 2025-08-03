import { useState, useEffect } from 'react';

interface MobileOptimizationResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  shouldReduceMotion: boolean;
  isSlowDevice: boolean;
  deviceMemory: number | undefined;
}

export const useMobileOptimization = (): MobileOptimizationResult => {
  const [deviceInfo, setDeviceInfo] = useState<MobileOptimizationResult>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    shouldReduceMotion: false,
    isSlowDevice: false,
    deviceMemory: undefined,
  });

  useEffect(() => {
    // Check screen size
    const checkDevice = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      // Check if user prefers reduced motion
      const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Check device memory (if available)
      const deviceMemory = (navigator as any).deviceMemory;
      const isSlowDevice = deviceMemory ? deviceMemory < 4 : false;

      // On mobile, always reduce motion for better performance
      const finalReduceMotion = isMobile || shouldReduceMotion || isSlowDevice;

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        shouldReduceMotion: finalReduceMotion,
        isSlowDevice,
        deviceMemory,
      });
    };

    checkDevice();

    // Add resize listener with debounce
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDevice, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return deviceInfo;
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  useEffect(() => {
    // Check for performance observer support
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });

      // Monitor First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });

      // Monitor Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsScore = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        });
        console.log('CLS:', clsScore);
      });

      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        fidObserver.observe({ type: 'first-input', buffered: true });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        // Fallback for browsers that don't support these metrics
        console.log('Performance monitoring not fully supported');
      }

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);
};

// Intersection observer hook for lazy loading
export const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
};