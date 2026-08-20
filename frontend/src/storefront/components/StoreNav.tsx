import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleUserRound, Heart, Menu, ShoppingBag, X } from "lucide-react";
import type { StorePage } from "../types";

export function StoreNav({
  page,
  cartCount,
  likedCount,
  go,
}: {
  page: StorePage;
  cartCount: number;
  likedCount: number;
  go: (page: StorePage) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const navigate = (next: StorePage) => {
    setMenuOpen(false);
    go(next);
  };

  return <>
    <header className="store-nav">
      <button className="mobile-menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? <X /> : <Menu />}
      </button>
      <nav className="nav-left" aria-label="Primary navigation">
        <button className={page === "home" ? "active" : ""} onClick={() => go("home")}>Home</button>
        <button className={page === "products" || page === "product-detail" ? "active" : ""} onClick={() => go("products")}>Collection</button>
        <button className={page === "craft" ? "active" : ""} onClick={() => go("craft")}>Our craft</button>
      </nav>
      <button className="nav-brand-button" aria-label="Go to home" onClick={() => go("home")}><span className="nav-wordmark"><span>Dhaaga</span> <b>& Dagger</b></span></button>
      <div className="nav-actions">
        <button className="nav-counter" aria-label="Wishlist" onClick={() => go("wishlist")}><Heart size={16} />{likedCount > 0 && <span>{likedCount}</span>}</button>
        <button className={page === "profile" || page === "auth" ? "active" : ""} aria-label="Account" onClick={() => go("profile")}><CircleUserRound size={17} /></button>
        <button className="cart-button" onClick={() => go("cart")} aria-label="Cart"><ShoppingBag size={17} />{cartCount > 0 && <span>{cartCount}</span>}</button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-nav-overlay" role="dialog" aria-modal="true" aria-label="Navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)}>
            <motion.nav className="mobile-nav-sheet" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 280, damping: 30 }} onClick={(event) => event.stopPropagation()}>
              <div className="mobile-nav-heading"><span>Navigate</span><button aria-label="Close navigation" autoFocus onClick={() => setMenuOpen(false)}><X /></button></div>
              <button className={page === "home" ? "active" : ""} onClick={() => navigate("home")}><span>01</span> Home</button>
              <button className={page === "products" || page === "product-detail" ? "active" : ""} onClick={() => navigate("products")}><span>02</span> Collection</button>
              <button className={page === "craft" ? "active" : ""} onClick={() => navigate("craft")}><span>03</span> Our craft</button>
              <button className={page === "profile" ? "active" : ""} onClick={() => navigate("profile")}><span>04</span> My profile</button>
              <button className={page === "wishlist" ? "active" : ""} onClick={() => navigate("wishlist")}><span>05</span> Saved pieces <b>{likedCount}</b></button>
              <button className={page === "cart" ? "active" : ""} onClick={() => navigate("cart")}><span>06</span> Shopping bag <b>{cartCount}</b></button>
              <small>Dhaaga & Dagger / Built for everyday movement</small>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  </>;
}
