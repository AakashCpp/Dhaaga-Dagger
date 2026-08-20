import { Bell, Search } from "lucide-react";
import type { ReactNode } from "react";

export function AdminHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <header className="admin-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div><div className="admin-header-actions">{children}<button aria-label="Search"><Search /></button><button aria-label="Notifications"><Bell /><i /></button></div></header>;
}
