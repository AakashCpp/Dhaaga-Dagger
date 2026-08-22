import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { io } from "socket.io-client";
import { addCartLine, addOrder, addPurchaseRecord, clearCart, removeCartLine, replaceCatalog, replaceWishlist, store, toggleLikedProduct, updateCartLine } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { storeProducts } from "../storefront/data";
import type { StoreActions, StoreProduct } from "../storefront/types";
import { backendApi, SOCKET_ORIGIN } from "../lib/api";
import type { AdminOrder } from "../admin/types";

export function useStorefrontController() {
  const dispatch = useAppDispatch();
  const catalog = useAppSelector((state) => state.catalog);
  const cart = useAppSelector((state) => state.cart);
  const authStatus = useAppSelector((state) => state.auth.status);
  const likedIds = useAppSelector((state) => state.customer.likedIds);
  const liked = useMemo(() => new Set(likedIds), [likedIds]);
  const [selected, setSelected] = useState<StoreProduct>(catalog[0] || storeProducts[0]);
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);

  useEffect(() => {
    let active = true;
    void backendApi.products().then((response) => {
      if (active && response.data.length) dispatch(replaceCatalog(response.data));
    }).catch(() => undefined);
    const socket = io(SOCKET_ORIGIN, { transports: ["websocket", "polling"], reconnection: true });
    socket.on("catalog:updated", (event: { action: "created" | "updated" | "deleted"; product?: StoreProduct; productId?: number }) => {
      const current = store.getState().catalog;
      if (event.action === "deleted" && event.productId) dispatch(replaceCatalog(current.filter((item) => item.id !== event.productId)));
      else if (event.product) dispatch(replaceCatalog(current.some((item) => item.id === event.product!.id) ? current.map((item) => item.id === event.product!.id ? event.product! : item) : [event.product, ...current]));
    });
    return () => { active = false; socket.disconnect(); };
  }, [dispatch]);

  useEffect(() => {
    if (!catalog.some((product) => product.id === selected.id)) setSelected(catalog[0] || storeProducts[0]);
  }, [catalog, selected.id]);

  const notify = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items, { id, text }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 2600);
  }, []);

  const syncCart = useCallback(() => {
    if (authStatus === "authenticated") void backendApi.replaceCart(store.getState().cart).catch(() => notify("Cart will sync when the connection returns"));
  }, [authStatus, notify]);

  const setCatalog: Dispatch<SetStateAction<StoreProduct[]>> = useCallback((update) => {
    const current = store.getState().catalog;
    dispatch(replaceCatalog(typeof update === "function" ? update(current) : update));
  }, [dispatch]);

  const add = useCallback((product: StoreProduct, size: string) => {
    if ((product.stock || 0) < 1) return notify("This piece is currently out of stock");
    dispatch(addCartLine({ product, size }));
    syncCart();
    notify(`${product.name} · ${product.category === "Jeans" ? "waist" : "size"} ${size} added to bag`);
  }, [dispatch, notify, syncCart]);

  const update = useCallback((id: number, amount: number) => {
    dispatch(updateCartLine({ id, amount }));
    syncCart();
  }, [dispatch, syncCart]);

  const remove = useCallback((id: number) => {
    dispatch(removeCartLine(id));
    syncCart();
    notify("Removed from your bag");
  }, [dispatch, notify, syncCart]);

  const toggleLike = useCallback((id: number) => {
    const removing = store.getState().customer.likedIds.includes(id);
    dispatch(toggleLikedProduct(id));
    if (authStatus === "authenticated") {
      void backendApi.updateWishlist(id, !removing).then((response) => dispatch(replaceWishlist(response.data.likedIds))).catch(() => {
        dispatch(toggleLikedProduct(id));
        notify("Saved pieces could not be synced");
      });
    }
    notify(removing ? "Removed from saved pieces" : "Saved to your edit");
  }, [authStatus, dispatch, notify]);

  const openProduct = useCallback((product: StoreProduct) => setSelected(product), []);

  const placeOrder = useCallback(async () => {
    const state = store.getState();
    if (!state.cart.length) { notify("Your bag is empty"); return null; }
    const now = new Date();
    const orderId = `DK${Date.now().toString().slice(-8)}`;
    const placedAt = now.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const order: AdminOrder = {
      id: orderId,
      customer: { name: state.checkout.fullName || state.customer.profile.name, phone: state.checkout.phone || state.customer.profile.phone, email: state.customer.profile.email },
      address: state.checkout.address,
      landmark: state.checkout.landmark,
      city: state.checkout.city,
      state: state.checkout.state,
      pin: state.checkout.pin,
      createdAt: placedAt,
      status: "Placed",
      payment: state.checkout.payment,
      items: state.cart.map((line) => ({ productId: line.id, name: line.name, image: line.image, size: line.size, quantity: line.quantity, price: line.price })),
      history: [{ status: "Placed", at: placedAt }],
    };
    try {
      const response = await backendApi.createOrder(order);
      const saved = response.data;
      dispatch(addOrder(saved));
      dispatch(addPurchaseRecord({ id: saved.id, date: saved.createdAt, status: "Processing", total: saved.total ?? saved.items.reduce((sum, item) => sum + item.price * item.quantity, 0) - (saved.discount || 0), productIds: saved.items.map((item) => item.productId) }));
      dispatch(clearCart());
      notify(`Order #${saved.id} placed successfully`);
      return saved.id;
    } catch (error) {
      notify(error instanceof Error ? error.message : "Unable to place order");
      return null;
    }
  }, [dispatch, notify]);

  const actions: StoreActions = useMemo(() => ({ products: catalog, liked, toggleLike, openProduct, add }), [add, catalog, liked, openProduct, toggleLike]);
  return { actions, cart, catalog, selected, setCatalog, toasts, notify, update, remove, placeOrder };
}
