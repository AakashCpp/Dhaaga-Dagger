import { motion } from 'framer-motion';

interface MarqueeBannerProps {
  text: string;
  bgColor?: string;
  textColor?: string;
}

export default function MarqueeBanner({ text, bgColor = 'bg-black', textColor = 'text-white' }: MarqueeBannerProps) {
  const repeatedText = Array(12).fill(text).join("   ★   ");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`${bgColor} ${textColor} overflow-hidden whitespace-nowrap py-4 md:py-5`}
    >
      <div className="animate-marquee flex shrink-0">
        <span className="font-oswald text-sm md:text-base font-bold tracking-[0.25em] px-6">
          {repeatedText}
        </span>
        <span className="font-oswald text-sm md:text-base font-bold tracking-[0.25em] px-6">
          {repeatedText}
        </span>
      </div>
    </motion.div>
  );
}
