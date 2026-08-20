import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MESSAGES = [
  'LEAD WITH CONFIDENCE',
  'FREE SHIPPING ON EVERY ORDERS',
];

export default function TopBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black text-white overflow-hidden">
      <div className="h-[32px] flex items-center justify-center gap-24">
        <ChevronLeft size={14} className="text-white/70" />
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-[10px] md:text-[11px] tracking-normal font-light uppercase whitespace-nowrap"
          >
            {MESSAGES[index]}
          </motion.p>
        </AnimatePresence>
        <ChevronRight size={14} className="text-white/70" />
      </div>
    </div>
  );
}
