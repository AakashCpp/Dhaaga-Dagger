import type { StorePage } from "../types";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./Brand";

export function StoreFooter({ go }: { go: (page: StorePage) => void }) {
  return <>
    <section className="footer-manifesto" aria-label="The Dhaaga and Dagger craft">
      <div className="footer-manifesto-visual">
        <img src="/assets/brand/dhaaga-dagger-banner.jpeg" alt="Denim, thread and tailoring tools arranged around the Dhaaga mark" loading="lazy" decoding="async" />
      </div>
      <div className="footer-manifesto-copy">
        <p className="eyebrow">Dhaaga & Dagger / Made with intent</p>
        <h2>Every thread<br />has a purpose.</h2>
        <p>We shape dependable denim and tactile Henleys through considered cloth, precise construction and details that grow more personal with every wear.</p>
        <button onClick={() => go("craft")}>Discover our craft <ArrowUpRight /></button>
      </div>
    </section>
    <footer className="modern-footer"><div><Brand /><p>Denim and Henleys, made for movement and built as one everyday uniform.</p></div><nav><b>Explore</b><button onClick={() => go("products")}>Collection</button><button onClick={() => go("craft")}>Our craft</button><button>Size guide</button></nav><nav><b>Contact</b><a href="mailto:hello@dhaagaanddagger.com">hello@dhaagaanddagger.com</a><a href="tel:+919876543210">+91 98765 43210</a><span>New Delhi, India</span></nav><div className="footer-bottom"><span>© 2026 Dhaaga & Dagger. All rights reserved.</span><span>Made for daily motion.</span></div></footer>
  </>;
}
