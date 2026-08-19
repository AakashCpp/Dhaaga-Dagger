import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';

export default function RecentActivity() {
  const [show, setShow] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(0);

  useEffect(() => {
    // Show first notification after 5 seconds
    const initialTimer = setTimeout(() => {
      setShow(true);
    }, 5000);

    // Cycle through products
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setCurrentProduct(prev => (prev + 1) % products.length);
        setShow(true);
      }, 500);
    }, 8000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // Auto-hide after 4 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [show, currentProduct]);

  const product = products[currentProduct];
  const minutes = Math.floor(Math.random() * 30) + 1;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 z-[60] bg-white shadow-2xl border border-gray-100 p-3 flex gap-3 max-w-[300px]"
        >
          <div className="w-14 h-16 bg-gray-100 flex-shrink-0 overflow-hidden">
            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 tracking-wider">{product.name}</p>
            <p className="text-[10px] font-bold mt-0.5">{minutes} mins ago</p>
            <p className="text-[9px] text-gray-300 mt-0.5">Someone purchased this</p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="absolute top-1.5 right-1.5 text-gray-300 hover:text-gray-600"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
