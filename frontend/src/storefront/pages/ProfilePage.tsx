import { motion } from "framer-motion";
import {
  ArrowRight,
  CircleUserRound,
  Heart,
  Mail,
  PackageCheck,
  Phone,
  ShoppingBag,
  LogIn,
  LogOut,
} from "lucide-react";
import { signedOut } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAuthGateway } from "../../services/firebase/authRegistry";
import { money } from "../data";
import type { StoreActions, StorePage } from "../types";
import { ProductTile } from "../components/ProductTile";

export function ProfilePage({
  go,
  actions,
}: {
  go: (page: StorePage) => void;
  actions: StoreActions;
}) {
  const { profile, purchases, likedIds } = useAppSelector(
    (state) => state.customer,
  );
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const savedProducts = actions.products.filter(
    (product) => product.active !== false && likedIds.includes(product.id),
  );
  const delivered = purchases.filter((order) => order.status === "Delivered").length;

  return (
    <main className="profile-page">
      <header className="profile-hero">
        <div>
          <p className="eyebrow">Dhaaga & Dagger account</p>
          <h1>Your denim,<br /><em>kept together.</em></h1>
        </div>
        <p>Orders, saved fits and the details tied to your account, all in one clear view.</p>
      </header>

      <section className="profile-overview">
        <motion.div className="profile-identity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="profile-avatar"><CircleUserRound /></div>
          <div>
            <p className="eyebrow">Member since {profile.joinedAt}</p>
            <h2>{profile.name}</h2>
          </div>
          <button className="profile-auth-action" onClick={async () => {
            if (auth.status === "authenticated") {
              try {
                await getAuthGateway()?.signOut();
              } finally {
                dispatch(signedOut());
                go("auth");
              }
            } else go("auth");
          }}>{auth.status === "authenticated" ? <><LogOut /> Sign out</> : <><LogIn /> Sign in to sync</>}</button>
          <dl>
            <div><dt><Mail /> Email</dt><dd>{profile.email}</dd></div>
            <div><dt><Phone /> Mobile</dt><dd>{profile.phone}</dd></div>
          </dl>
        </motion.div>

        <div className="profile-stats">
          <article><ShoppingBag /><span>Total orders</span><strong>{purchases.length.toString().padStart(2, "0")}</strong></article>
          <article><Heart /><span>Saved pieces</span><strong>{likedIds.length.toString().padStart(2, "0")}</strong></article>
          <article><PackageCheck /><span>Delivered</span><strong>{delivered.toString().padStart(2, "0")}</strong></article>
        </div>
      </section>

      <section className="profile-orders">
        <div className="profile-section-heading">
          <div><p className="eyebrow">Purchase history</p><h2>Past & active orders.</h2></div>
          <span>{purchases.length} recorded orders</span>
        </div>
        <div className="profile-order-list">
          {purchases.map((order, index) => {
            const products = order.productIds
              .map((id) => actions.products.find((product) => product.id === id))
              .filter(Boolean);
            return (
              <motion.article key={order.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
                <div className="profile-order-id"><span>Order</span><strong>#{order.id}</strong><small>{order.date}</small></div>
                <div className="profile-order-products">
                  {products.slice(0, 3).map((product) => product && <img key={product.id} src={product.image} alt={product.name} />)}
                  <div><span>{products.length} {products.length === 1 ? "piece" : "pieces"}</span><b>{products.map((product) => product?.name).join(" / ")}</b></div>
                </div>
                <div className="profile-order-total"><span>Total</span><b>{money(order.total)}</b></div>
                <span className={`profile-order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                <button aria-label={`View order ${order.id}`} onClick={() => go("tracking")}><ArrowRight /></button>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="profile-saved">
        <div className="profile-section-heading">
          <div><p className="eyebrow">Your edit</p><h2>Recently saved.</h2></div>
          <button onClick={() => go("wishlist")}>View all <ArrowRight /></button>
        </div>
        {savedProducts.length ? (
          <div className="collection-grid profile-saved-grid">
            {savedProducts.slice(0, 4).map((product, index) => (
              <ProductTile key={product.id} product={product} index={index} {...actions} />
            ))}
          </div>
        ) : (
          <div className="profile-saved-empty">
            <Heart />
            <p>Your saved fits will appear here.</p>
            <button className="primary" onClick={() => go("products")}>Explore collection</button>
          </div>
        )}
      </section>
    </main>
  );
}
