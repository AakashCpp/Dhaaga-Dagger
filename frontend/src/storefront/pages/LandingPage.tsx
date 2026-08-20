import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { money, reviews } from "../data";
import type { StoreActions, StorePage } from "../types";
import { CraftRoute } from "../components/CraftRoute";
import { ProductTile } from "../components/ProductTile";
import { StoreFooter } from "../components/StoreFooter";

const fitNotes = [
  "Close through the leg",
  "Easy everyday balance",
  "Clean tapered shape",
  "Relaxed room to move",
];

export function LandingPage({
  go,
  actions,
}: {
  go: (page: StorePage) => void;
  actions: StoreActions;
}) {
  const products = actions.products.filter((item) => item.active !== false);
  const heroProduct = products[0];
  const [active, setActive] = useState(0);
  const slideCount = Math.max(Math.min(products.length, 4), 1);
  const carouselProduct = products[active % slideCount];

  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % slideCount),
      5600,
    );
    return () => window.clearInterval(timer);
  }, [slideCount]);

  useEffect(() => {
    const next = products[(active + 1) % slideCount];
    if (!next) return;
    const preload = new Image();
    preload.src = next.image;
  }, [active, products, slideCount]);

  if (!heroProduct || !carouselProduct) {
    return (
      <main className="wishlist-empty">
        <h2>Collection coming soon.</h2>
        <p>Add an active product from the admin catalog.</p>
      </main>
    );
  }

  return (
    <>
      <section className="editorial-landing-hero">
        <button className="editorial-hero-media editorial-product-shot" onClick={() => actions.openProduct(heroProduct)}>
          <img src={heroProduct.image} alt={heroProduct.name} />
          <span><small>New season / 01</small><strong>{heroProduct.name}</strong></span>
          <ArrowUpRight />
        </button>

        <div className="editorial-hero-copy">
          <p className="eyebrow">Artisanal denim / shaped edge</p>
          <h1>Dhaaga <span>& Dagger</span></h1>
          <p>Cut with purpose. Worn your way. Denim that gets more personal with every day.</p>
          <button className="primary" onClick={() => go("products")}>
            Shop the collection <ArrowDownRight size={14} />
          </button>
          <div className="editorial-proof">
            <span><b>13.5 oz</b> ring-spun cloth</span>
            <span><b>30 days</b> fit exchange</span>
          </div>
        </div>

        <button className="editorial-hero-media editorial-craft-shot" onClick={() => go("craft")}>
          <img src="/assets/brand/dhaaga-dagger-banner.jpeg" alt="Dhaaga and Dagger tailoring table" />
          <span><small>Inside the atelier</small><strong>Made with intent</strong></span>
          <ArrowUpRight />
        </button>
      </section>

      <section className="editorial-category-grid" aria-label="Explore Dhaaga and Dagger">
        <button className="category-panel category-premium" onClick={() => go("products")}>
          <span>01 / Collection</span><strong>Premium denim</strong><ArrowUpRight />
        </button>
        <button className="category-panel category-craft" onClick={() => go("craft")}>
          <span>02 / Construction</span><strong>Crafted details</strong><ArrowUpRight />
        </button>
        <button className="category-panel category-fit" onClick={() => go("products")}>
          <span>03 / Fit guide</span><strong>Rethinking jeans</strong><ArrowUpRight />
        </button>
      </section>

      <section className="heritage-carousel" aria-label="Featured denim carousel">
        <div className="heritage-carousel-copy">
          <p className="eyebrow">Featured pair / 0{active + 1}</p>
          <AnimatePresence mode="wait">
            <motion.div key={carouselProduct.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .38 }}>
              <span>{carouselProduct.fit} fit</span>
              <h2>{carouselProduct.name}</h2>
              <p>A considered silhouette with honest structure, everyday comfort and a wash designed to become your own.</p>
              <div><b>{money(carouselProduct.price)}</b><button className="primary" onClick={() => actions.openProduct(carouselProduct)}>View this pair <ArrowDownRight size={14} /></button></div>
            </motion.div>
          </AnimatePresence>
          <div className="heritage-carousel-controls">
            <button aria-label="Previous featured pair" onClick={() => setActive((active + slideCount - 1) % slideCount)}><ChevronLeft /></button>
            <div>{products.slice(0, 4).map((item, index) => <button aria-label={`Show ${item.name}`} className={index === active ? "active" : ""} onClick={() => setActive(index)} key={item.id} />)}</div>
            <button aria-label="Next featured pair" onClick={() => setActive((active + 1) % slideCount)}><ChevronRight /></button>
          </div>
        </div>
        <div className="heritage-carousel-visual">
          <AnimatePresence mode="wait">
            <motion.img key={carouselProduct.image} src={carouselProduct.image} alt={carouselProduct.name} initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .45 }} />
          </AnimatePresence>
          <span>0{active + 1} / 0{slideCount}</span>
        </div>
      </section>

      <section className="signal-strip">
        <span>13.5 oz ring-spun denim</span>
        <span>Movement-first patterning</span>
        <span>Free delivery across India</span>
        <span>30-day fit exchange</span>
      </section>

      <section className="fit-editorial">
        <div>
          <p className="eyebrow">The fit guide</p>
          <h2>
            Find your
            <br />
            everyday fit.
          </h2>
          <p>Four considered silhouettes, each shaped around a different way of moving.</p>
        </div>
        <div className="fit-rail">
          {products.slice(0, 4).map((item, index) => (
            <button key={item.id} onClick={() => actions.openProduct(item)}>
              <span>0{index + 1}</span>
              <strong>{item.fit}</strong>
              <small>{fitNotes[index]}</small>
              <ArrowDownRight />
            </button>
          ))}
        </div>
      </section>

      <section className="process compact-process">
        <div className="section-intro">
          <div>
          <p className="eyebrow">From cloth to character</p>
            <h2>
              Details worth
              <br />
              looking closer.
            </h2>
          </div>
          <button onClick={() => go("craft")}>
            Inside the jean <ArrowDownRight size={15} />
          </button>
        </div>
        <CraftRoute />
        <div className="route-caption">
          <span>Selected fibre</span>
          <span>Checked by hand</span>
          <span>Ready to wear</span>
        </div>
      </section>

      <section className="featured modern-featured">
        <div className="section-title">
          <div>
            <p className="eyebrow">The current edit</p>
            <h2>Everyday signatures</h2>
          </div>
          <button onClick={() => go("products")}>
            View all <ChevronRight size={15} />
          </button>
        </div>
        <div className="collection-grid landing-products">
          {products.slice(0, 4).map((item, index) => (
            <ProductTile
              key={item.id}
              product={item}
              index={index}
              {...actions}
            />
          ))}
        </div>
      </section>

      <section className="landing-anatomy">
        <img
          src="/assets/denim-anatomy.jpg"
          alt="Denim front back and interior views"
          loading="lazy"
          decoding="async"
        />
        <div>
          <p className="eyebrow">Honest construction</p>
          <h2>
            Good from
            <br />
            every side.
          </h2>
          <p>
            Front, back and inside-out. Every layer is considered for comfort,
            repair and years of repeat wear.
          </p>
          <button onClick={() => go("craft")}>
            Explore construction <ArrowDownRight size={15} />
          </button>
        </div>
      </section>

      <section className="reviews">
        <div className="review-heading">
          <p className="eyebrow">From the fitting room</p>
          <h2>
            Worn often.
            <br />
            Kept longer.
          </h2>
          <p>
            Notes from people who made Dhaaga & Dagger part of their everyday
            uniform.
          </p>
        </div>
        <div className="review-window">
          <div className="review-track">
            {[...reviews, ...reviews].map(([name, text, rating], index) => (
              <article key={`${name}-${index}`}>
                <div>
                  <span>★★★★★</span>
                  <b>{rating}</b>
                </div>
                <p>“{text}”</p>
                <small>{name} · Verified buyer</small>
              </article>
            ))}
          </div>
        </div>
      </section>
      <StoreFooter go={go} />
    </>
  );
}
