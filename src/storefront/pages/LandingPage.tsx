import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ChevronLeft, ChevronRight } from "lucide-react";
import { money, reviews } from "../data";
import type { StoreActions, StorePage } from "../types";
import { CraftRoute } from "../components/CraftRoute";
import { ProductTile } from "../components/ProductTile";
import { StoreFooter } from "../components/StoreFooter";

const fitNotes = [
  "Clean and close",
  "Balanced everyday",
  "Sharp contour",
  "Room to move",
];

export function LandingPage({
  go,
  actions,
}: {
  go: (page: StorePage) => void;
  actions: StoreActions;
}) {
  const products = actions.products.filter((item) => item.active !== false);
  const [active, setActive] = useState(0);
  const slideCount = Math.max(Math.min(products.length, 4), 1);
  const product = products[active % slideCount];

  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % slideCount),
      5200,
    );
    return () => window.clearInterval(timer);
  }, [slideCount]);

  useEffect(() => {
    const next = products[(active + 1) % slideCount];
    if (!next) return;
    const preload = new Image();
    preload.src = next.image;
  }, [active, products, slideCount]);

  if (!product) {
    return (
      <main className="wishlist-empty">
        <h2>Collection coming soon.</h2>
        <p>Add an active product from the admin catalog.</p>
      </main>
    );
  }

  return (
    <>
      <section className="hero-carousel refined-hero">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="hero-slide"
            style={{
              backgroundImage: `linear-gradient(90deg,rgba(3,8,14,.91),rgba(3,8,14,.08)),url(${product.image})`,
            }}
          />
        </AnimatePresence>
        <div className="hero-copy">
          <p className="eyebrow">Denim for real life</p>
          <h1>
            Move
            <br />
            <em>better.</em>
          </h1>
          <p>Precision fits. Lived-in comfort. Made to become yours.</p>
          <button className="primary" onClick={() => go("products")}>
            Find your pair <ArrowDownRight size={14} />
          </button>
        </div>
        <div className="hero-index">
          <span>0{active + 1}</span>
          <div>
            {products.slice(0, 4).map((item, index) => (
              <button
                aria-label={`Show ${item.name}`}
                className={index === active ? "selected" : ""}
                onClick={() => setActive(index)}
                key={item.id}
              />
            ))}
          </div>
          <span>0{slideCount}</span>
        </div>
        <button
          className="hero-arrow left"
          aria-label="Previous product"
          onClick={() => setActive((active + slideCount - 1) % slideCount)}
        >
          <ChevronLeft />
        </button>
        <button
          className="hero-arrow right"
          aria-label="Next product"
          onClick={() => setActive((active + 1) % slideCount)}
        >
          <ChevronRight />
        </button>
        <button
          className="hero-product"
          onClick={() => actions.openProduct(product)}
        >
          <span>{product.fit} fit</span>
          <b>{product.name}</b>
          <small>{money(product.price)} · View piece</small>
        </button>
      </section>

      <section className="signal-strip">
        <span>13.5 oz ring-spun denim</span>
        <span>Movement-first patterning</span>
        <span>Free delivery across India</span>
        <span>30-day fit exchange</span>
      </section>

      <section className="fit-editorial">
        <div>
          <p className="eyebrow">Choose your energy</p>
          <h2>
            Four fits.
            <br />
            No filler.
          </h2>
          <p>Different proportions, one obsession with how denim moves.</p>
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
            <p className="eyebrow">Made deliberately</p>
            <h2>
              Touch every
              <br />
              detail.
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
            <p className="eyebrow">Current rotation</p>
            <h2>Most wanted</h2>
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
          <p className="eyebrow">The inside matters</p>
          <h2>
            Built from
            <br />
            both sides.
          </h2>
          <p>
            Front, back and inside-out. Every layer exists for wear, repair and
            repeat.
          </p>
          <button onClick={() => go("craft")}>
            Explore construction <ArrowDownRight size={15} />
          </button>
        </div>
      </section>

      <section className="reviews">
        <div className="review-heading">
          <p className="eyebrow">Community notes</p>
          <h2>
            Worn.
            <br />
            Repeated.
          </h2>
          <p>
            Real words from people building everyday uniforms with Dhaaga &
            Dagger.
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
