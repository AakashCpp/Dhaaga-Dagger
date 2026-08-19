import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";

const garmentViews = [
  { number: "01", label: "Front form", title: "Built to settle.", copy: "A balanced rise and measured leg line give the denim room to learn the wearer." },
  { number: "02", label: "Back form", title: "Movement mapped.", copy: "The yoke and pocket placement hold the silhouette while the body stays free to move." },
  { number: "03", label: "Inside view", title: "Nothing secondary.", copy: "Pocket bags, fly protection and finished seams receive the same attention as the exterior." },
];

type AtlasStyle = CSSProperties & { "--atlas-index": number };

export function CraftAtlas() {
  const [activeView, setActiveView] = useState(0);

  return (
    <section className="craft-atlas">
      <motion.header className="craft-atlas-header" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.45 }}>
        <p className="eyebrow">Garment study / 01—03</p>
        <h2>One pair.<br />Three perspectives.</h2>
        <p>Read the structure from the surface inward. Every view answers a different part of how the jean wears.</p>
      </motion.header>

      <motion.figure className="craft-atlas-visual" style={{ "--atlas-index": activeView } as AtlasStyle} initial={{ opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.75 }}>
        <img src="/assets/craft-garment-atlas.jpg" alt="Raw indigo jeans shown from the front, back and inside" loading="lazy" decoding="async" />
        <div className="craft-atlas-labels" aria-hidden="true">
          {garmentViews.map((view) => <span key={view.number}>{view.number} / {view.label}</span>)}
        </div>
      </motion.figure>

      <div className="craft-atlas-notes" aria-label="Select a garment view">
        {garmentViews.map((view, index) => (
          <button className={activeView === index ? "active" : ""} key={view.number} onClick={() => setActiveView(index)} onMouseEnter={() => setActiveView(index)} onFocus={() => setActiveView(index)} aria-pressed={activeView === index}>
            <span>{view.number}</span><small>{view.label}</small><strong>{view.title}</strong><p>{view.copy}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
