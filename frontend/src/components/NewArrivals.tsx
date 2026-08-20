import { motion } from 'framer-motion';
import { products, Product } from '../data/products';
import ProductCard from './ProductCard';

interface NewArrivalsProps {
  onAddToCart: (product: Product, size: string) => void;
  onViewProduct: (product: Product) => void;
  onNavigate: (page: string, category?: string) => void;
}

export default function NewArrivals({ onAddToCart, onViewProduct, onNavigate }: NewArrivalsProps) {
  const newProducts = products.filter((product) => product.isNew).slice(0, 4);

  return (
    <section className="border-b-4 border-black bg-white py-10 md:py-14">
      <div className="flex items-center justify-between px-5 pb-6 md:px-10 md:pb-8">
        <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[16px] font-medium uppercase md:text-[18px]">Shop New Arrivals</motion.h2>
        <button onClick={() => onNavigate('collections', 'NEW')} className="border-b border-black pb-0.5 text-[11px] uppercase tracking-[0.08em] hover:opacity-60">View all</button>
      </div>
      <div className="grid grid-cols-2 gap-[3px] px-[3px] md:grid-cols-4">
        {newProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} onAddToCart={onAddToCart} onViewProduct={onViewProduct} />)}
      </div>
    </section>
  );
}
