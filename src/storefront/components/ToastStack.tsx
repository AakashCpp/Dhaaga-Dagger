import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export function ToastStack({ messages }: { messages: { id: number; text: string }[] }) {
  return <div className="toast-stack"><AnimatePresence>{messages.map((message) => <motion.div key={message.id} initial={{ opacity: 0, x: 30, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 20 }}><Check size={15} />{message.text}</motion.div>)}</AnimatePresence></div>;
}

