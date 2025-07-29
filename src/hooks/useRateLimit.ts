import { useState, useEffect } from 'react';
import { RateLimiter } from '../lib/security';

export const useRateLimit = () => {
  const [canAttempt, setCanAttempt] = useState(true);
  const [remainingTime, setRemainingTime] = useState<number | undefined>();
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  useEffect(() => {
    checkRateLimit();
    
    // Her 30 saniyede bir kontrol et
    const interval = setInterval(checkRateLimit, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkRateLimit = () => {
    const result = RateLimiter.checkLoginAttempts();
    setCanAttempt(result.canAttempt);
    setRemainingTime(result.remainingTime);
    setRemainingAttempts(RateLimiter.getRemainingAttempts());
  };

  const recordFailedAttempt = () => {
    RateLimiter.recordFailedLoginAttempt();
    checkRateLimit();
  };

  const recordSuccessfulAttempt = () => {
    RateLimiter.recordSuccessfulLogin();
    checkRateLimit();
  };

  const getFormattedRemainingTime = (): string => {
    if (!remainingTime) return '';
    
    const minutes = Math.floor(remainingTime);
    const seconds = Math.floor((remainingTime - minutes) * 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    canAttempt,
    remainingTime,
    remainingAttempts,
    recordFailedAttempt,
    recordSuccessfulAttempt,
    getFormattedRemainingTime,
    checkRateLimit
  };
}; 