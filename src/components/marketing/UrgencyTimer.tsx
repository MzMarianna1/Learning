/**
 * Urgency Timer Component
 * Creates FOMO with countdown timer
 */

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface UrgencyTimerProps {
  expiryHours?: number;
  discountPercent?: number;
  className?: string;
}

export default function UrgencyTimer({ 
  expiryHours = 48, 
  discountPercent = 50,
  className = '' 
}: UrgencyTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Get or set expiry time in localStorage
    const storageKey = 'offer-expiry';
    let expiryTime = localStorage.getItem(storageKey);
    
    if (!expiryTime) {
      // Set new expiry time
      const now = new Date();
      now.setHours(now.getHours() + expiryHours);
      expiryTime = now.toISOString();
      localStorage.setItem(storageKey, expiryTime);
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiryTime!).getTime();
      const difference = expiry - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [expiryHours]);

  if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-4 shadow-xl ${className}`}
    >
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-bold">⚡ {discountPercent}% OFF EXPIRES IN:</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Hours */}
          <div className="bg-white text-red-600 rounded-lg px-3 py-2 min-w-[60px] text-center">
            <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs font-semibold">HOURS</div>
          </div>
          
          <span className="text-2xl font-bold">:</span>
          
          {/* Minutes */}
          <div className="bg-white text-red-600 rounded-lg px-3 py-2 min-w-[60px] text-center">
            <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs font-semibold">MINS</div>
          </div>
          
          <span className="text-2xl font-bold">:</span>
          
          {/* Seconds */}
          <div className="bg-white text-red-600 rounded-lg px-3 py-2 min-w-[60px] text-center">
            <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs font-semibold">SECS</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
