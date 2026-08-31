import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { money, reviews } from "../data";
import type { StoreActions, StorePage, StoreProduct } from "../types";
import { CraftRoute } from "../components/CraftRoute";
import { ProductTile } from "../components/ProductTile";
import { StoreFooter } from "../components/StoreFooter";

const fitGuide = [
  { fit: "Straight fit", note: "Clean line from hip to hem" },
  { fit: "Wide leg", note: "Volume with an easy fall" },
  { fit: "Bootcut", note: "Subtle flare below the knee" },
  { fit: "Baggy fit", note: "Maximum room to move" },
];

export function LandingPage({
  go,
  actions,
}: {
  go: (page: StorePage) => void;
  actions: StoreActions;
}) {
  const products = actions.products.filter((item) => item.active !== false);
  const jeans = products.filter((item) => item.category === "Jeans");
  const balancedProducts = jeans.slice(0, 1) as StoreProduct[];
  const carouselProducts = balancedProducts.length
    ? balancedProducts
    : products;
  const heroProduct = jeans[0] || products[0];
  const [active, setActive] = useState(0);
  const slideCount = Math.max(Math.min(carouselProducts.length, 6), 1);
  const carouselProduct = carouselProducts[active % slideCount];

  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % slideCount),
      5600,
    );
    return () => window.clearInterval(timer);
  }, [slideCount]);

  useEffect(() => {
    const next = carouselProducts[(active + 1) % slideCount];
    if (!next) return;
    const preload = new Image();
    preload.src = next.image;
  }, [active, carouselProducts, slideCount]);

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
        <button
          className="editorial-hero-media editorial-product-shot"
          onClick={() => actions.openProduct(heroProduct)}
        >
          <img src="/assets/campaign-wide-leg-hero.png" alt="Model wearing a black Henley with pale wide-leg denim" />
          <span>
            <small>Sample release / 01</small>
            <strong>{heroProduct.name}</strong>
          </span>
          <ArrowUpRight />
        </button>

        <div className="editorial-hero-copy">
          <p className="eyebrow">One sample / one clear direction</p>
          <h1>
            Dhaaga <span>& Dagger</span>
          </h1>
          <p>
            One exaggerated wide-leg jean, styled with clean long-sleeve
            Henleys. A focused sample of where Dhaaga & Dagger is going.
          </p>
          <button className="primary" onClick={() => go("products")}>
            View the sample <ArrowDownRight size={14} />
          </button>
          <div className="editorial-proof">
            <span>
              <b>13.5 oz</b> ring-spun cloth
            </span>
            <span>
              <b>12 days</b> easy return
              <small className="return-review-note">No size or measurement difference is accepted. Every return is strictly reviewed by the vendor.</small>
            </span>
          </div>
        </div>

        <button
          className="editorial-hero-media editorial-craft-shot"
          onClick={() => go("craft")}
        >
          <img
            src="/assets/wide-leg-001-front.png"
            alt="Model wearing a white Henley with pale wide-leg denim"
          />
          <span>
            <small>The styling language</small>
            <strong>Wide denim / clean Henley</strong>
          </span>
          <ArrowUpRight />
        </button>
      </section>

      <section
        className="editorial-category-section"
        aria-labelledby="category-heading"
      >
        <header>
          <div>
            <p className="eyebrow">Build the uniform</p>
            <h2 id="category-heading">
              One sample.
              <br />
              Four future fits.
            </h2>
          </div>
          <p>
            The wide-leg sample is live now. Straight, bootcut and baggy
            silhouettes define the wider fit direction.
          </p>
        </header>
        <div className="editorial-category-grid">
          <button
            className="category-panel category-premium"
            onClick={() => go("products")}
          >
            <span>01 / Denim</span>
            <strong>Wide Leg 001</strong>
            <small>Our only shoppable sample</small>
            <ArrowUpRight />
          </button>
          <button
            className="category-panel category-craft"
            onClick={() => go("products")}
          >
            <span>02 / Henleys</span>
            <strong>Henley styling</strong>
            <small>The top half of the visual language</small>
            <ArrowUpRight />
          </button>
          <button
            className="category-panel category-fit"
            onClick={() => go("craft")}
          >
            <span>03 / Construction</span>
            <strong>Crafted details</strong>
            <small>See every considered choice</small>
            <ArrowUpRight />
          </button>
        </div>
      </section>

      <motion.section
        className="henley-arrival"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          className="henley-arrival-media"
          onClick={() =>
            actions.openProduct(heroProduct)
          }
        >
          <motion.img
            src="/assets/henley-duo-editorial.png"
            alt="Two models wearing ecru and oxblood Henleys with wide-leg denim"
            loading="eager"
            whileHover={{ scale: 1.025 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          />
          <span>Styling study / Henley</span>
        </button>
        <motion.div
          className="henley-arrival-copy"
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, delay: 0.12 }}
        >
          <p className="eyebrow">The other half of the uniform</p>
          <h2>
            Henley
            <br />
            <em>enters the scene.</em>
          </h2>
          <p>
            Cotton slub, honest plackets and an easy layer that belongs
            naturally beside our denim. Nothing loud. Everything considered.
          </p>
          <div>
            <button
              className="primary"
              onClick={() =>
                actions.openProduct(heroProduct)
              }
            >
              View the styled sample <ArrowDownRight size={14} />
            </button>
            <button onClick={() => go("craft")}>
              See how it is made <ArrowUpRight size={14} />
            </button>
          </div>
        </motion.div>
      </motion.section>

      <section className="henley-visual-story" aria-label="Henley colour and construction story">
        <motion.figure
          className="henley-palette-panel"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <img src="/assets/henley-palette-flatlay.png" alt="Ecru, oxblood, white and black Henleys arranged with pale denim" loading="lazy" decoding="async" />
          <figcaption><span>01 / Palette</span><strong>Four quiet tones.</strong><small>Ecru · Oxblood · White · Black</small></figcaption>
        </motion.figure>
        <motion.figure
          className="henley-material-panel"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.12 }}
        >
          <img src="/assets/henley-material-study.png" alt="Henley placket, cotton slub, cuff and denim material study" loading="lazy" decoding="async" />
          <figcaption><span>02 / Material index</span><strong>Texture, measured.</strong><button onClick={() => go("craft")}>Read the construction <ArrowUpRight size={14} /></button></figcaption>
        </motion.figure>
      </section>

      <section
        className="heritage-carousel"
        aria-label="Featured garment carousel"
      >
        <div className="heritage-carousel-copy">
          <p className="eyebrow">Featured piece / 0{active + 1}</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselProduct.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.38 }}
            >
              <span>
                {carouselProduct.category} / {carouselProduct.subtype}
              </span>
              <h2>{carouselProduct.name}</h2>
              <p>
                A considered everyday piece with honest structure, tactile
                comfort and a finish designed to become your own.
              </p>
              <div>
                <b>{money(carouselProduct.price)}</b>
                <button
                  className="primary"
                  onClick={() => actions.openProduct(carouselProduct)}
                >
                  View this piece <ArrowDownRight size={14} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="heritage-carousel-controls">
            <button
              aria-label="Previous featured pair"
              onClick={() => setActive((active + slideCount - 1) % slideCount)}
            >
              <ChevronLeft />
            </button>
            <div>
              {carouselProducts.slice(0, 6).map((item, index) => (
                <button
                  aria-label={`Show ${item.name}`}
                  className={index === active ? "active" : ""}
                  onClick={() => setActive(index)}
                  key={item.id}
                />
              ))}
            </div>
            <button
              aria-label="Next featured pair"
              onClick={() => setActive((active + 1) % slideCount)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="heritage-carousel-visual">
          <AnimatePresence mode="wait">
            <motion.img
              key={carouselProduct.image}
              src={carouselProduct.image}
              alt={carouselProduct.name}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            />
          </AnimatePresence>
          <span>
            0{active + 1} / 0{slideCount}
          </span>
        </div>
      </section>

      <section className="signal-strip">
        <span>13.5 oz ring-spun denim</span>
        <span>Styled with long-sleeve Henleys</span>
        <span>Free delivery across India</span>
        <span>12-day return window</span>
      </section>

      <section className="fit-editorial">
        <div>
          <p className="eyebrow">The fit guide</p>
          <h2>
            Find your
            <br />
            everyday fit.
          </h2>
          <p>
            Four silhouettes shape our denim language. Wide Leg 001 is the
            single sample available today.
          </p>
        </div>
        <div className="fit-rail">
          {fitGuide.map((item, index) => (
            <button key={item.fit} onClick={() => actions.openProduct(heroProduct)}>
              <span>0{index + 1}</span>
              <strong>{item.fit}</strong>
              <small>{item.note}</small>
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
            Inside every garment <ArrowDownRight size={15} />
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
            <h2>The sample, three ways</h2>
          </div>
          <button onClick={() => go("products")}>
            View all <ChevronRight size={15} />
          </button>
        </div>
        <div className="collection-grid landing-products">
          {carouselProducts.slice(0, 1).map((item, index) => (
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
          src="/assets/campaign-wide-leg-hero.png"
          alt="Wide-leg denim and black Henley editorial campaign"
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
