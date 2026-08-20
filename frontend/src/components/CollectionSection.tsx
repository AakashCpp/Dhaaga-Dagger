import { motion } from 'framer-motion';
import { collections } from '../data/products';

interface CollectionSectionProps {
  onNavigate: (page: string, category?: string) => void;
}

export default function CollectionSection({ onNavigate }: CollectionSectionProps) {
  return (
    <section className="mx-auto max-w-[1840px] px-4 py-10 md:px-14 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[18px] font-medium uppercase tracking-normal"
        >
          SHOP BY COLLECTION
        </motion.h2>
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          onClick={() => onNavigate('collections', 'ALL')}
          className="text-[14px] uppercase border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
        >
          VIEW ALL
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-1.5 md:grid-cols-3">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.name}
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            onClick={() => onNavigate('collections', collection.name)}
            className="relative group cursor-pointer overflow-hidden rounded-[3px] aspect-[4/5] bg-[#d9d9d9]"
          >
            <img
              src={collection.image}
              alt={collection.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/8 group-hover:bg-black/18 transition-colors duration-300" />
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="w-full rounded-[4px] bg-white py-3.5 text-center text-[14px] font-medium uppercase text-black">
                {collection.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
