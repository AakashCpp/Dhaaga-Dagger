import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";

const details = [
  { number: "04", label: "Chain stitch", title: "Thread follows movement.", copy: "Flexible thread paths distribute seam stress and reveal a richer finish as the denim wears in." },
  { number: "05", label: "Interlock", title: "A cleaner edge.", copy: "Dense overlocking protects every cut edge through daily friction, repeat washing and long rotation." },
  { number: "06", label: "Zip + tack", title: "Hardware that ages too.", copy: "Low-profile metal teeth, reinforced tape and copper-toned hardware gain character beside the cloth." },
  { number: "07", label: "Pocket rivet", title: "Strength where it counts.", copy: "Metal reinforcement and precise topstitching secure the places where small failures usually begin." },
];

type DetailStyle = CSSProperties & { "--detail-index": number };

export function CraftDetailIndex() {
  const [activeDetail, setActiveDetail] = useState(0);
  const detail = details[activeDetail];

  return (
    <section className="craft-detail-index">
      <motion.header className="craft-detail-heading" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.45 }}>
        <p className="eyebrow">Inspection index / 04—07</p>
        <h2>Four details.<br />One standard.</h2>
        <p>Select a construction point to inspect the choices that keep a pair in rotation for longer.</p>
      </motion.header>

      <motion.div className="craft-detail-visual" style={{ "--detail-index": activeDetail } as DetailStyle} initial={{ opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.75 }}>
        <img src="/assets/craft-detail-index.jpg" alt="Close views of denim stitching, interlock seam, zipper and rivet" loading="lazy" decoding="async" />
        <div className="craft-detail-focus" aria-hidden="true" />
      </motion.div>

      <div className="craft-detail-tabs" aria-label="Construction detail selector">
        {details.map((item, index) => (
          <button className={activeDetail === index ? "active" : ""} key={item.number} onClick={() => setActiveDetail(index)} onMouseEnter={() => setActiveDetail(index)} onFocus={() => setActiveDetail(index)} aria-pressed={activeDetail === index}>
            <span>{item.number}</span><strong>{item.label}</strong>
          </button>
        ))}
      </div>

      <div className="craft-detail-copy" aria-live="polite">
        <span>Inspecting {detail.number}</span><h3>{detail.title}</h3><p>{detail.copy}</p>
      </div>
    </section>
  );
}
