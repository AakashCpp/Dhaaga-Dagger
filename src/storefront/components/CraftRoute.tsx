import { motion } from "framer-motion";
import { Droplets, MapPin, PackageCheck, Scissors } from "lucide-react";

const stops = [
  [MapPin, "01", "Source", "Selected long-staple cotton"],
  [Scissors, "02", "Cut", "Movement-first patterning"],
  [Droplets, "03", "Finish", "Character-building wash"],
  [PackageCheck, "04", "Deliver", "Checked and tracked"],
] as const;

export function CraftRoute() {
  return <div className="process-route">{stops.map(([Icon, number, title, text], index) => <motion.article initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .1 }} key={title}><div className="route-node"><Icon /><span>{number}</span></div><h3>{title}</h3><p>{text}</p></motion.article>)}</div>;
}

