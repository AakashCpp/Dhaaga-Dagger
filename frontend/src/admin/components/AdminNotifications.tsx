import { CheckCheck, Package, Radio, WifiOff } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { io } from "socket.io-client";
import { addOrder, hydrateOrders, replaceCatalog, updateOrderStatus } from "../../store";
import { useAppDispatch } from "../../store/hooks";
import { backendApi, SOCKET_ORIGIN } from "../../lib/api";
import type { AdminAnalytics, AdminNotification } from "../../lib/api";
import type { AdminOrder } from "../types";
import { getAdminToken } from "../adminSession";
import { useAdminNavigation } from "./AdminNavigation";

type NotificationContextValue = {
  notifications: AdminNotification[];
  unreadCount: number;
  connected: boolean;
  loading: boolean;
  analytics: AdminAnalytics | null;
  lastSyncedAt: Date | null;
  syncError: string | null;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

function mergeNotifications(current: AdminNotification[], incoming: AdminNotification[]) {
  const seen = new Set<string>();
  return [...incoming, ...current].filter((item) => {
    if (seen.has(item._id)) return false;
    seen.add(item._id);
    return true;
  }).slice(0, 30);
}

export function AdminNotificationsProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [notificationResponse, orderResponse, productResponse, analyticsResponse] = await Promise.all([
        backendApi.notifications(30),
        backendApi.orders(),
        backendApi.adminProducts(),
        backendApi.orderAnalytics(7),
      ]);
      setNotifications((current) => mergeNotifications(current, notificationResponse.data));
      dispatch(hydrateOrders(orderResponse.data));
      dispatch(replaceCatalog(productResponse.data));
      setAnalytics(analyticsResponse.data);
      setLastSyncedAt(new Date());
      setSyncError(null);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : "Store data is temporarily unavailable");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    void refresh();
    const poll = window.setInterval(refresh, 30_000);
    const socket = io(SOCKET_ORIGIN, { auth: { token: getAdminToken() }, transports: ["polling", "websocket"], reconnection: true });
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("notification:new", (notification: AdminNotification) => {
      setNotifications((current) => mergeNotifications(current, [notification]));
    });
    socket.on("order:created", (order: AdminOrder) => { dispatch(addOrder(order)); void refresh(); });
    socket.on("order:updated", (order: AdminOrder) => { dispatch(updateOrderStatus({ id: order.id, status: order.status, at: order.history.at(-1)?.at || order.createdAt })); void refresh(); });
    return () => {
      window.clearInterval(poll);
      socket.disconnect();
    };
  }, [dispatch, refresh]);

  const markRead = useCallback((id: string) => {
    setNotifications((items) => items.map((item) => item._id === id ? { ...item, read: true } : item));
    void backendApi.markNotificationRead(id).catch(() => undefined);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    void backendApi.markAllNotificationsRead().catch(() => undefined);
  }, []);

  const value = useMemo(() => ({
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
    connected,
    loading,
    analytics,
    lastSyncedAt,
    syncError,
    markRead,
    markAllRead,
  }), [analytics, connected, lastSyncedAt, loading, markAllRead, markRead, notifications, syncError]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useAdminNotifications() {
  const value = useContext(NotificationContext);
  if (!value) throw new Error("useAdminNotifications must be used inside AdminNotificationsProvider");
  return value;
}

function relativeTime(value: string) {
  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 60_000) return "Just now";
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationPanel({ close }: { close: () => void }) {
  const { notifications, connected, loading, markRead, markAllRead, unreadCount } = useAdminNotifications();
  const navigation = useAdminNavigation();

  return <section className="admin-notification-panel" aria-label="Admin notifications">
    <div className="admin-notification-head">
      <div><span>Notifications</span><small className={connected ? "live" : "offline"}>{connected ? <Radio /> : <WifiOff />}{connected ? "Live" : "Syncing"}</small></div>
      {unreadCount > 0 && <button onClick={markAllRead}><CheckCheck /> Mark all read</button>}
    </div>
    <div className="admin-notification-list">
      {loading && notifications.length === 0 && <p className="admin-notification-empty">Connecting to store updates…</p>}
      {!loading && notifications.length === 0 && <p className="admin-notification-empty">No updates yet. New orders will appear here.</p>}
      {notifications.map((item) => <button className={item.read ? "read" : "unread"} key={item._id} onClick={() => { markRead(item._id); if (item.orderId) navigation.openOrder(item.orderId); close(); }}>
        <i><Package /></i>
        <span><b>{item.title}</b><small>{item.message}</small><em>{relativeTime(item.createdAt)}</em></span>
      </button>)}
    </div>
  </section>;
}
