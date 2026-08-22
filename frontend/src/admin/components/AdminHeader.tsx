import { ArrowUpRight, Bell, Boxes, LayoutDashboard, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useAppSelector } from "../../store/hooks";
import { NotificationPanel, useAdminNotifications } from "./AdminNotifications";
import { useAdminNavigation } from "./AdminNavigation";

type SearchResult = {
  key: string;
  eyebrow: string;
  title: string;
  detail: string;
  icon: typeof Search;
  open: () => void;
};

function AdminSearchDialog({ close }: { close: () => void }) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const orders = useAppSelector((state) => state.orders.items);
  const products = useAppSelector((state) => state.catalog);
  const navigation = useAdminNavigation();

  useEffect(() => {
    input.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [close]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const sections: SearchResult[] = [
      { key: "section-dashboard", eyebrow: "Admin section", title: "Dashboard", detail: "Store overview and performance", icon: LayoutDashboard, open: () => navigation.go("admin") },
      { key: "section-orders", eyebrow: "Admin section", title: "Orders", detail: "Search and fulfil customer orders", icon: ShoppingBag, open: () => navigation.go("orders") },
      { key: "section-products", eyebrow: "Admin section", title: "Products", detail: "Manage catalog and inventory", icon: Boxes, open: () => navigation.go("admin-products") },
    ];
    const productResults: SearchResult[] = products.map((product) => ({
      key: `product-${product.id}`,
      eyebrow: "Product",
      title: product.name,
      detail: `${product.sku || `DK-${product.id}`} · ${product.category} / ${product.subtype} · ${product.stock || 0} in stock`,
      icon: Boxes,
      open: () => navigation.openProduct(product.id),
    }));
    const orderResults: SearchResult[] = orders.map((order) => ({
      key: `order-${order.id}`,
      eyebrow: "Order",
      title: `#${order.id} · ${order.customer.name}`,
      detail: `${order.customer.phone} · ${order.status}`,
      icon: ShoppingBag,
      open: () => navigation.openOrder(order.id),
    }));
    const all = [...sections, ...orderResults, ...productResults];
    if (!term) return sections;
    return all.filter((item) => `${item.eyebrow} ${item.title} ${item.detail}`.toLowerCase().includes(term)).slice(0, 12);
  }, [navigation, orders, products, query]);

  const choose = (result: SearchResult) => { result.open(); close(); };

  return <div className="admin-search-backdrop" role="presentation" onMouseDown={close}>
    <section className="admin-search-dialog" role="dialog" aria-modal="true" aria-label="Search admin workspace" onMouseDown={(event) => event.stopPropagation()}>
      <div className="admin-search-input"><Search /><input ref={input} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders, customers, products or sections…" aria-label="Search admin workspace" /><button aria-label="Close search" onClick={close}><X /></button></div>
      <div className="admin-search-results" aria-live="polite">
        {results.map((result) => { const Icon = result.icon; return <button key={result.key} onClick={() => choose(result)}><i><Icon /></i><span><small>{result.eyebrow}</small><b>{result.title}</b><em>{result.detail}</em></span><ArrowUpRight /></button>; })}
        {!results.length && <div className="admin-search-empty"><Search /><b>No matching result</b><span>Try an order number, customer name, phone, product, SKU or section.</span></div>}
      </div>
      <footer><span><kbd>Esc</kbd> close</span><span>{results.length} result{results.length === 1 ? "" : "s"}</span></footer>
    </section>
  </div>;
}

export function AdminHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const { unreadCount } = useAdminNotifications();

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setNotificationsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotificationsOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return <header className="admin-header">
    <div className="admin-header-title"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>
    <div className="admin-header-actions">
      {children && <div className="admin-header-primary-actions">{children}</div>}
      <div className="admin-header-utilities">
        <button className="admin-icon-button admin-search-trigger" aria-label="Search admin workspace" title="Search" onClick={() => { setNotificationsOpen(false); setSearchOpen(true); }}><Search /></button>
        <div className="admin-notification-wrap" ref={wrapper}><button className="admin-notification-trigger" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} title="Notifications" aria-expanded={notificationsOpen} onClick={() => { setSearchOpen(false); setNotificationsOpen((value) => !value); }}><Bell />{unreadCount > 0 && <i />}</button>{notificationsOpen && <NotificationPanel close={() => setNotificationsOpen(false)} />}</div>
      </div>
    </div>
    {searchOpen && <AdminSearchDialog close={() => setSearchOpen(false)} />}
  </header>;
}
