import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Product, products } from '../data/products';

interface ProductGridProps {
  title?: string;
  category?: string;
  onAddToCart: (product: Product, size: string) => void;
  onViewProduct: (product: Product) => void;
  showFilters?: boolean;
  limit?: number;
}

export default function ProductGrid({ title, category, onAddToCart, onViewProduct, showFilters = false, limit }: ProductGridProps) {
  const [sortBy, setSortBy] = useState('date-new');
  const [visibleCount, setVisibleCount] = useState(limit || 12);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (category && category !== 'ALL') {
      if (category === 'NEW') {
        filtered = filtered.filter(p => p.isNew);
      } else {
        filtered = filtered.filter(p =>
          p.category === category ||
          p.subcategory === category
        );
      }
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case 'date-new':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'date-old':
        filtered.sort((a, b) => a.id - b.id);
        break;
    }

    return filtered;
  }, [category, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <section className="mx-auto max-w-[1720px] px-5 py-10 md:px-10 md:py-12 lg:px-14">
      {/* Header */}
      <div className="mb-9 flex flex-col gap-5 md:mb-11 md:flex-row md:items-center md:justify-between">
        <div>
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[18px] font-medium uppercase tracking-normal"
            >
              {title}
            </motion.h2>
          )}
          <p className={`${showFilters ? 'hidden' : ''} mt-2 text-[12px] text-black/75`}>
            {filteredProducts.length} products
          </p>
        </div>

        {showFilters && (
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button className="flex h-10 min-w-[112px] items-center justify-between rounded-md border border-[#d7d7d7] px-6 text-[13px]">
                Price
                <span className="text-lg leading-none">⌄</span>
              </button>
              <button className="flex h-10 min-w-[106px] items-center justify-between rounded-md border border-[#d7d7d7] px-6 text-[13px]">
                Size
                <span className="text-lg leading-none">⌄</span>
              </button>
            </div>
            <div className="ml-auto flex items-center gap-7">
              <span className="hidden text-[13px] text-black/80 md:inline">{filteredProducts.length * 10 - 8} products</span>
              <label className="text-[13px] text-black/70">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[13px] outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price, low to high</option>
              <option value="price-high">Price, high to low</option>
              <option value="date-old">Date, old to new</option>
              <option value="date-new">Date, new to old</option>
            </select>
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:gap-x-10 lg:gap-y-16">
        {displayedProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onAddToCart={onAddToCart}
            onViewProduct={onViewProduct}
          />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-[11px] text-gray-400 tracking-wider mb-5">
            You've viewed {displayedProducts.length} of {filteredProducts.length} results
          </p>
          <button
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="px-12 py-3.5 bg-black text-white text-[11px] font-bold tracking-[0.2em] hover:bg-gray-900 transition-colors"
          >
            LOAD MORE
          </button>
        </motion.div>
      )}
    </section>
  );
}
