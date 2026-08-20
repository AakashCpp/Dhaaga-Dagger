import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product, size: string) => void;
  onViewProduct: (product: Product) => void;
}

export default function ProductCard({ product, index, onAddToCart, onViewProduct }: ProductCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ scale: 1.06, opacity: 0 }}
      animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 1.06, opacity: 0 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.2), ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowSizes(false); }}
    >
      <div className="relative aspect-[0.72] cursor-pointer overflow-hidden bg-white" onClick={() => onViewProduct(product)}>
        {product.images.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`${product.name} ${idx + 1}`}
            draggable={false}
            className={`absolute inset-0 h-full w-full object-cover object-top img-zoom-out ${idx === currentImage ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
          />
        ))}

        {product.isNew && (
          <span className="absolute left-4 top-4 z-20 bg-black px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">
            NEW!
          </span>
        )}

        {isHovered && product.images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-md" aria-label="Previous image">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-md" aria-label="Next image">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
          {product.images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentImage(idx); }}
              className={`h-1.5 rounded-full transition-all ${idx === currentImage ? 'w-4 bg-black/35' : 'w-1.5 bg-black/20'}`}
              aria-label={`Show image ${idx + 1}`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 12 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-0 left-0 right-0 z-30 p-3"
        >
          <button
            onClick={(e) => { e.stopPropagation(); setShowSizes(true); }}
            className="w-full bg-black py-3 text-[10px] font-bold tracking-[0.2em] text-white"
          >
            QUICK ADD
          </button>
        </motion.div>

        {showSizes && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/82" onClick={(e) => e.stopPropagation()}>
            <p className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-white">SELECT SIZE</p>
            <div className="flex flex-wrap justify-center gap-2 px-4">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product, size);
                    setShowSizes(false);
                  }}
                  className="min-w-10 border border-white/55 px-3 py-2 text-[11px] font-bold tracking-wider text-white hover:bg-white hover:text-black"
                >
                  {size}
                </button>
              ))}
            </div>
            <button onClick={(e) => { e.stopPropagation(); setShowSizes(false); }} className="mt-4 text-[10px] tracking-wider text-white/65 hover:text-white">
              CLOSE
            </button>
          </motion.div>
        )}
      </div>

      <div className="px-0 pb-3 pt-3">
        <h3 onClick={() => onViewProduct(product)} className="mb-1.5 cursor-pointer text-[13px] font-semibold uppercase leading-tight tracking-normal text-black hover:underline line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-medium text-[#b0443e]">Rs. {product.salePrice.toLocaleString()}.00</span>
          {product.salePrice < product.regularPrice && (
            <span className="text-[12px] text-black/55 line-through">Rs. {product.regularPrice.toLocaleString()}.00</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
