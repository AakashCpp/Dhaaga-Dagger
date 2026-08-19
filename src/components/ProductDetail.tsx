import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, products } from '../data/products';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, size: string) => void;
  onViewProduct: (product: Product) => void;
}

export default function ProductDetail({ product, onBack, onAddToCart, onViewProduct }: ProductDetailProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [qty, setQty] = useState(1);

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const discount = Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Breadcrumb */}
      <div className="max-w-[1392px] mx-auto px-4 md:px-8 lg:px-12 py-5">
        <div className="flex items-center gap-2 text-[11px] tracking-wider text-gray-400">
          <button onClick={onBack} className="hover:text-black transition-colors">HOME</button>
          <span>/</span>
          <span className="text-black font-semibold">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1392px] mx-auto px-4 md:px-8 lg:px-12 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Image gallery */}
          <div>
            {/* Main image */}
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[3/4] overflow-hidden bg-gray-100 mb-4"
            >
              <img
                src={product.images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden border-2 transition-all duration-200 ${
                    idx === currentImage ? 'border-black' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:pt-4">
            <div className="flex items-center gap-2 mb-3">
              {product.isNew && (
                <span className="bg-black text-white text-[9px] font-bold tracking-wider px-2.5 py-1">NEW</span>
              )}
              {discount > 0 && (
                <span className="bg-red-600 text-white text-[9px] font-bold tracking-wider px-2.5 py-1">SALE</span>
              )}
            </div>

            <h1 className="font-oswald text-2xl md:text-4xl font-bold tracking-wider mb-2">
              {product.name}
            </h1>

            <p className="text-[10px] text-gray-400 tracking-[0.15em] mb-4">{product.brand}</p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl md:text-2xl font-bold">
                Rs. {product.salePrice.toLocaleString()}.00
              </span>
              {product.salePrice < product.regularPrice && (
                <span className="text-lg text-gray-400 line-through">
                  Rs. {product.regularPrice.toLocaleString()}.00
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm font-bold text-red-600">Save {discount}%</span>
              )}
            </div>

            {/* Size selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] font-bold tracking-[0.15em]">SIZE</label>
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="text-[10px] tracking-[0.1em] text-gray-500 underline hover:text-black transition-colors"
                >
                  Size Chart
                </button>
              </div>
            <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[52px] px-5 py-3.5 text-[12px] font-bold tracking-wider border-2 transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="text-[11px] font-bold tracking-[0.15em] block mb-3">QUANTITY</label>
              <div className="flex items-center border border-gray-200 w-fit">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg"
                >
                  −
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-[13px] font-bold border-x border-gray-200">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3 mb-8">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (selectedSize) onAddToCart(product, selectedSize);
                }}
                className={`flex-1 py-4 text-[12px] font-bold tracking-[0.2em] transition-all duration-300 ${
                  selectedSize
                    ? 'bg-black text-white hover:bg-gray-900'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!selectedSize}
              >
                {selectedSize ? 'ADD TO CART' : 'SELECT SIZE'}
              </motion.button>
              <button className="w-14 h-14 border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-[11px] font-bold tracking-[0.15em] mb-3">DESCRIPTION</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                {product.name}, Classic style meets everyday comfort. Soft, breathable, and easy to wear.
                Perfect for any casual outing. Discover the unmatched versatility and timeless appeal of
                our premium {product.category.toLowerCase()} – the perfect companion for every occasion.
                Designed for those who demand both style and substance, our {product.category.toLowerCase()} offers
                a flawless combination of durability, comfort, and modern design.
              </p>
            </div>

            {/* Share */}
            <div className="border-t border-gray-100 pt-5 mt-8">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold tracking-[0.15em] text-gray-400">SHARE:</span>
                <div className="flex gap-3">
                  {['facebook', 'twitter', 'pinterest'].map((social) => (
                    <button key={social} className="text-gray-400 hover:text-black transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size chart modal */}
      <AnimatePresence>
        {showSizeChart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setShowSizeChart(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 p-6 md:p-8 max-w-md w-[90%] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-oswald text-lg font-bold tracking-wider">SIZE CHART</h3>
                <button onClick={() => setShowSizeChart(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-bold">Size</th>
                    <th className="text-left py-2 font-bold">Waist</th>
                    <th className="text-left py-2 font-bold">Length</th>
                    <th className="text-left py-2 font-bold">Hip</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: '28', waist: '28"', length: '40"', hip: '36"' },
                    { size: '30', waist: '30"', length: '41"', hip: '38"' },
                    { size: '32', waist: '32"', length: '42"', hip: '40"' },
                    { size: '34', waist: '34"', length: '43"', hip: '42"' },
                    { size: '36', waist: '36"', length: '44"', hip: '44"' },
                  ].map((row) => (
                    <tr key={row.size} className="border-b border-gray-50">
                      <td className="py-2 font-semibold">{row.size}</td>
                      <td className="py-2 text-gray-600">{row.waist}</td>
                      <td className="py-2 text-gray-600">{row.length}</td>
                      <td className="py-2 text-gray-600">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1392px] mx-auto px-4 md:px-8 lg:px-12 py-14 md:py-20 border-t border-gray-100">
          <h2 className="font-oswald text-xl md:text-2xl font-bold tracking-wider mb-10">
            PEOPLE ALSO BOUGHT
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8">
            {relatedProducts.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onAddToCart={onAddToCart}
                onViewProduct={onViewProduct}
              />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
