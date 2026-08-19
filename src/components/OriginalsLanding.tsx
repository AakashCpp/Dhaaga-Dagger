import { motion } from 'framer-motion';

interface OriginalsLandingProps { onShop: () => void; }

const lookbook = [
  'https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=760',
  'https://images.pexels.com/photos/30930107/pexels-photo-30930107.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=760',
  'https://images.pexels.com/photos/35347257/pexels-photo-35347257.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=760',
];

export default function OriginalsLanding({ onShop }: OriginalsLandingProps) {
  return <section className="bg-black text-white">
    <div className="relative min-h-[calc(100svh-104px)] overflow-hidden bg-[#a6a6a6] md:min-h-[680px]">
      <img src="https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1300&w=1900" alt="Blurg Originals denim" className="absolute inset-0 h-full w-full object-cover object-[center_43%]" />
      <div className="absolute inset-0 bg-black/15" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="absolute inset-x-6 bottom-12 md:inset-x-[12vw] md:bottom-20">
        <p className="mb-4 text-[11px] uppercase tracking-[0.22em]">Blurg Originals</p><h1 className="max-w-4xl text-4xl font-light uppercase leading-none tracking-[0.04em] sm:text-6xl lg:text-8xl">Lead With<br />Confidence</h1>
        <button onClick={onShop} className="mt-8 border border-white px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-white hover:text-black">Explore the collection</button>
      </motion.div>
    </div>
    <div className="grid border-t-4 border-black md:grid-cols-3">
      {lookbook.map((image, index) => <motion.div key={image} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="relative aspect-[4/5] overflow-hidden border-b-4 border-black md:border-b-0 md:border-r-4 last:border-r-0"><img src={image} alt="Blurg Originals lookbook" className="h-full w-full object-cover object-top" /></motion.div>)}
    </div>
    <div className="relative min-h-[520px] overflow-hidden bg-[#a5a5a5] md:min-h-[650px]">
      <img src="https://images.pexels.com/photos/30269897/pexels-photo-30269897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1300&w=1900" alt="Blurg Originals philosophy" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute left-7 top-1/2 max-w-xs -translate-y-1/2 md:left-[32vw] md:max-w-sm"><h2 className="text-3xl font-medium uppercase md:text-5xl">Blurg Originals</h2><p className="mt-4 text-base leading-relaxed text-white/90 md:text-lg">Everyday streetwear, designed by us to become part of your daily rotation. Simple pieces you will keep coming back to.</p></div>
    </div>
  </section>;
}
