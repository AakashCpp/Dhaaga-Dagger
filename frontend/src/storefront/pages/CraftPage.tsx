import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import type { StorePage } from "../types";
import { CraftAtlas } from "../components/CraftAtlas";
import { CraftDetailIndex } from "../components/CraftDetailIndex";
import { CraftRoute } from "../components/CraftRoute";
import { StoreFooter } from "../components/StoreFooter";

export function CraftPage({ go }: { go: (page: StorePage) => void }) {
  return (
    <main className="craft-page craft-story-page">
      <section className="craft-story-intro">
        <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="eyebrow">Dhaaga & Dagger / Product stories 001—002</p>
          <h1>Look<br /><em>closer.</em></h1>
          <p>A garment is never one object. Denim or Henley, it is hundreds of decisions seen one layer at a time.</p>
        </motion.div>
        <div className="scroll-cue"><span>Scroll through the construction</span><ArrowDownRight /></div>
      </section>

      <section className="story-prologue">
        <div><span>Story 001 / Denim</span><h2>Not made in<br />one gesture.</h2><p>Follow a single Dhaaga & Dagger jean from silhouette to seam, then into the details built to outlast the season.</p></div>
        <img src="/assets/craft-denim-story.webp" alt="Raw indigo jeans being inspected on a tailor's cutting table" loading="eager" />
      </section>

      <CraftAtlas />

      <section className="fabric-interlude">
        <div><p className="eyebrow">The cloth / 13.5 oz</p><h2>Dense enough to hold. Soft enough to move.</h2></div>
        <div className="fabric-numbers">
          <article><b>11.5</b><span>Ends per inch</span></article>
          <article><b>3×</b><span>Stress-point reinforcement</span></article>
          <article><b>10–12 oz</b><span>Cotton pocket bags</span></article>
        </div>
      </section>

      <section className="henley-craft-chapter">
        <div className="henley-craft-image henley-craft-gallery"><img src="/assets/henley-craft-macro.webp" alt="Close view of the reinforced three-button Henley placket" loading="lazy" decoding="async" /><img src="/assets/henley-indigo-waffle.webp" alt="Indigo waffle Henley showing the complete garment texture" loading="lazy" decoding="async" /><span>Story 002 / Henley</span></div>
        <div className="henley-craft-copy"><p className="eyebrow">The placket / three points of restraint</p><h2>Soft cloth.<br /><em>Held with intent.</em></h2><p>The Henley begins with breathable cotton slub, then earns its structure through a bound neckline, a reinforced placket and seams designed to sit cleanly beneath a jacket—or stand on their own.</p><div className="henley-craft-notes"><article><b>100%</b><span>Cotton slub</span></article><article><b>3</b><span>Anchored buttons</span></article><article><b>2×</b><span>Shoulder binding</span></article></div><button className="primary" onClick={() => go("products")}>Explore Henleys <ArrowDownRight size={14} /></button></div>
      </section>

      <CraftDetailIndex />

      <section className="craft-route-dark story-route">
        <div className="section-intro">
          <div><p className="eyebrow">The complete route</p><h2>Measured.<br />Made. Checked.</h2></div>
          <p>Every detail belongs to one controlled journey from selected cloth to your front door.</p>
        </div>
        <CraftRoute />
      </section>

      <section className="craft-cta">
        <p className="eyebrow">Now you know what is inside</p>
        <h2>Wear the proof.</h2>
        <button className="primary" onClick={() => go("products")}>Explore the full collection <ArrowDownRight size={14} /></button>
      </section>
      <StoreFooter go={go} />
    </main>
  );
}
