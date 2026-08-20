import { Camera, Play } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, category?: string) => void;
}

const reviews = [
  { name: 'Anonymous', product: 'FLOW DARK BAGGY', text: "It was great, next time I'll choose a better shade for jeans.", rating: 4 },
  { name: 'Milind.', product: 'FLYN GREEN WIDE', text: 'Good', rating: 5 },
  { name: 'Priti Kawala7', product: 'AERO BROWN WIDE', text: 'good', rating: 5 },
  { name: 'Anonymous', product: 'BOXY COLLAR TEE', text: 'Good quality and a clean fit.', rating: 5 },
];

function StarRow({ rating }: { rating: number }) {
  return <p className="text-[20px] tracking-[2px]">{'*'.repeat(rating)}<span className="text-black/20">{'*'.repeat(5 - rating)}</span></p>;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer id="site-footer" className="border-t border-black/10 bg-white text-black">
      <section className="overflow-hidden px-4 py-16 md:px-12 md:py-20">
        <h2 className="mb-8 text-center text-[17px] font-medium uppercase">Reviews</h2>
        <div className="mx-auto flex max-w-[1060px] gap-2 overflow-x-auto pb-2 no-scrollbar">
          {reviews.map((review) => (
            <article key={review.product} className="flex h-[180px] w-[286px] shrink-0 flex-col items-center justify-between rounded-md bg-[#e7e5e5] px-7 py-5 text-center md:w-[310px]">
              <p className="min-h-9 text-[12px] leading-[1.35]">{review.text}</p>
              <StarRow rating={review.rating} />
              <div>
                <p className="text-[13px] font-semibold">{review.name} <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-[8px] text-white">v</span></p>
                <p className="mt-3 text-[11px] text-black/45">{review.product}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="mx-auto grid max-w-[1840px] grid-cols-1 gap-12 px-7 pb-12 md:grid-cols-[1fr_1fr_auto] md:px-12 md:pb-16">
        <div>
          <h3 className="mb-5 text-[14px] font-medium uppercase">Quick Links</h3>
          <div className="flex flex-col items-start gap-3 text-[13px] text-black/75">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Search</button>
            <button onClick={() => onNavigate('collections', 'ALL')}>Shop</button>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Contact us</button>
            <button>Track your order</button>
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-[14px] font-medium uppercase">Policies</h3>
          <div className="flex flex-col items-start gap-3 text-[13px] text-black/75">
            {['Terms & Condition', 'Privacy Policy', 'Refund Policy', 'Shipping Policy', 'Returns & Exchanges'].map((policy) => <button key={policy}>{policy}</button>)}
          </div>
        </div>
        <div className="flex items-start gap-3 md:justify-self-end">
          <a aria-label="Instagram" href="https://www.instagram.com/blurgunseen/" className="grid h-9 w-9 place-items-center rounded-full border border-black"><Camera size={14} /></a>
          <a aria-label="YouTube" href="https://www.youtube.com/@BLURGVILLAGE/" className="grid h-9 w-9 place-items-center rounded-full border border-black"><Play size={15} /></a>
          <a aria-label="Pinterest" href="https://in.pinterest.com/blurgvillage/" className="grid h-9 w-9 place-items-center rounded-full border border-black text-[13px] font-semibold">P</a>
        </div>
      </div>
      <div className="mx-7 border-t border-black/10 py-7 text-[11px] text-black/70 md:mx-12">(c) 2026, Dhaaga & Dagger</div>
    </footer>
  );
}
