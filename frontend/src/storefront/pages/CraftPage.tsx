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
          <p className="eyebrow">Dhaaga & Dagger / Product story 001</p>
          <h1>Look<br /><em>closer.</em></h1>
          <p>A jean is not one object. It is hundreds of decisions, seen one layer at a time.</p>
        </motion.div>
        <div className="scroll-cue"><span>Scroll through the construction</span><ArrowDownRight /></div>
      </section>

      <section className="story-prologue">
        <span>One pair</span>
        <h2>Not made in<br />one gesture.</h2>
        <p>Follow a single Dhaaga & Dagger jean from silhouette to seam, then into the details built to outlast the season.</p>
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
        <button className="primary" onClick={() => go("products")}>Explore all jeans <ArrowDownRight size={14} /></button>
      </section>
      <StoreFooter go={go} />
    </main>
  );
}
