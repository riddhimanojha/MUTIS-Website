import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 400);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: "#1a3370",
            color: "white",
            border: "1px solid #2d5090",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            zIndex: 90,
          }}
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
