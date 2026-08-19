import { motion, AnimatePresence } from 'framer-motion';
import { collections } from '../data/products';

export interface CartItem {
  id: number;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, size: string, delta: number) => void;
  onRemove: (id: number, size: string) => void;
}

export default function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[70]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white z-[71] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
              <h2 className="font-inter text-[22px]">
                Your Cart <span className="inline-grid h-5 min-w-5 place-items-center rounded-full bg-black px-1 text-[12px] font-bold text-white">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
              </h2>
              <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-[#e8e8e8] hover:opacity-80 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
              {items.length === 0 ? (
                <div className="text-center">
                  <p className="text-[24px] leading-tight">Your cart is empty.</p>
                  <p className="mt-3 text-[13px] text-black/75">Find trending collection, products right below!</p>
                  <div className="mt-10 space-y-4">
                    {collections.map((collection) => (
                      <button key={collection.name} onClick={onClose} className="relative flex h-[144px] w-full items-center overflow-hidden rounded-[4px] bg-[#e7e7e7] text-left">
                        <span className="relative z-10 w-[36%] pl-6 text-[22px] uppercase">{collection.name}</span>
                        <img src={collection.image} alt={collection.name} className="absolute right-12 top-0 h-full w-[48%] object-cover" />
                        <span className="absolute right-6 z-10 grid h-12 w-12 place-items-center rounded-full bg-white text-[24px]">›</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4"
                    >
                      <div className="w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[12px] font-bold tracking-wider line-clamp-1">{item.name}</h3>
                        <p className="text-[10px] text-gray-400 tracking-wider mt-0.5">Size: {item.size}</p>
                        <p className="text-[12px] font-bold mt-1">Rs. {item.price.toLocaleString()}.00</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.size, -1)}
                              className="w-7 h-7 flex items-center justify-center text-xs hover:bg-gray-50"
                            >
                              −
                            </button>
                            <span className="w-7 h-7 flex items-center justify-center text-[11px] font-bold border-x border-gray-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.size, 1)}
                              className="w-7 h-7 flex items-center justify-center text-xs hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => onRemove(item.id, item.size)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-8 py-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold tracking-[0.15em]">SUBTOTAL</span>
                  <span className="text-[15px] font-bold">Rs. {total.toLocaleString()}.00</span>
                </div>
                <p className="text-[10px] text-gray-400 tracking-wider mb-4">Shipping calculated at checkout</p>
                <button className="w-full rounded-[4px] py-4 bg-black text-white text-[13px] font-bold hover:bg-gray-900 transition-colors">
                  CHECKOUT
                </button>
                <button
                  onClick={onClose}
                  className="w-full mt-2 py-3 text-[10px] font-bold tracking-[0.15em] text-gray-500 hover:text-black transition-colors"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
