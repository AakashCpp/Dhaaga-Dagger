import { motion } from 'framer-motion';

interface HeroCarouselProps {
  onShop: () => void;
}

export default function HeroCarousel({ onShop }: HeroCarouselProps) {
  return (
    <section className="relative min-h-[calc(100svh-142px)] overflow-hidden bg-[#aeaeae] md:min-h-[600px]">
      <motion.img initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} src="https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1800" alt="Wide fit denim collection" className="absolute inset-0 h-full w-full object-cover object-[center_38%]" />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-end px-7 text-center sm:px-12 md:px-[10vw] md:text-left">
        <div className="max-w-[690px] text-white">
          <p className="mb-4 text-[11px] uppercase tracking-[0.22em] sm:text-[13px]">New season / 2026</p>
          <h1 className="text-4xl font-light uppercase leading-[0.96] tracking-[0.04em] sm:text-6xl lg:text-[78px]">Wide Denim<br />Collection</h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/90 sm:text-base">Designed for everyday movement. Built with the confidence to take up space.</p>
          <button onClick={onShop} className="mt-8 border border-white px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-white hover:text-black">Shop new drops</button>
        </div>
      </div>
    </section>
  );
}
