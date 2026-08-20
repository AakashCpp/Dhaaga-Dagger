import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  addOrder,
  addPurchaseRecord,
  addCartLine,
  clearCart,
  removeCartLine,
  replaceCatalog,
  store,
  toggleLikedProduct,
  updateCartLine,
} from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { storeProducts } from "../storefront/data";
import type { StoreActions, StoreProduct } from "../storefront/types";

export function useStorefrontController() {
  const dispatch = useAppDispatch();
  const catalog = useAppSelector((state) => state.catalog);
  const cart = useAppSelector((state) => state.cart);
  const likedIds = useAppSelector((state) => state.customer.likedIds);
  const liked = useMemo(() => new Set(likedIds), [likedIds]);
  const [selected, setSelected] = useState<StoreProduct>(catalog[0] || storeProducts[0]);
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);

  useEffect(() => {
    if (!catalog.some((product) => product.id === selected.id)) {
      setSelected(catalog[0] || storeProducts[0]);
    }
  }, [catalog, selected.id]);

  const notify = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items, { id, text }]);
    window.setTimeout(
      () => setToasts((items) => items.filter((item) => item.id !== id)),
      2600,
    );
  }, []);

  const setCatalog: Dispatch<SetStateAction<StoreProduct[]>> = useCallback(
    (update) => {
      const current = store.getState().catalog;
      dispatch(replaceCatalog(typeof update === "function" ? update(current) : update));
    },
    [dispatch],
  );

  const add = useCallback((product: StoreProduct, size: string) => {
    dispatch(addCartLine({ product, size }));
    notify(`${product.name} · waist ${size} added to bag`);
  }, [dispatch, notify]);

  const update = useCallback((id: number, amount: number) => {
    dispatch(updateCartLine({ id, amount }));
  }, [dispatch]);

  const remove = useCallback((id: number) => {
    dispatch(removeCartLine(id));
    notify("Removed from your bag");
  }, [dispatch, notify]);

  const toggleLike = useCallback((id: number) => {
    const removing = store.getState().customer.likedIds.includes(id);
    dispatch(toggleLikedProduct(id));
    notify(removing ? "Removed from saved pieces" : "Saved to your edit");
  }, [dispatch, notify]);

  const openProduct = useCallback((product: StoreProduct) => {
    setSelected(product);
  }, []);

  const placeOrder = useCallback(() => {
    const state = store.getState();
    if (!state.cart.length) {
      notify("Your bag is empty");
      return null;
    }

    const now = new Date();
    const orderId = `DK${Date.now().toString().slice(-8)}`;
    const subtotal = state.cart.reduce((total, line) => total + line.price * line.quantity, 0);
    const discount = subtotal > 3000 ? 200 : 0;
    const total = subtotal - discount;
    const placedAt = now.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const purchaseDate = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    dispatch(addOrder({
      id: orderId,
      customer: {
        name: state.checkout.fullName || state.customer.profile.name,
        phone: state.checkout.phone || state.customer.profile.phone,
        email: state.customer.profile.email,
      },
      address: [state.checkout.address, state.checkout.landmark].filter(Boolean).join(", "),
      city: state.checkout.city,
      pin: state.checkout.pin,
      createdAt: placedAt,
      status: "Placed",
      payment: state.checkout.payment,
      discount,
      items: state.cart.map((line) => ({ productId: line.id, name: line.name, image: line.image, size: line.size, quantity: line.quantity, price: line.price })),
      history: [{ status: "Placed", at: placedAt }],
    }));
    dispatch(addPurchaseRecord({ id: orderId, date: purchaseDate, status: "Processing", total, productIds: state.cart.map((line) => line.id) }));
    dispatch(clearCart());
    notify(`Order #${orderId} placed successfully`);
    return orderId;
  }, [dispatch, notify]);

  const actions: StoreActions = useMemo(() => ({
    products: catalog,
    liked,
    toggleLike,
    openProduct,
    add,
  }), [add, catalog, liked, openProduct, toggleLike]);

  return {
    actions,
    cart,
    catalog,
    selected,
    setCatalog,
    toasts,
    notify,
    update,
    remove,
    placeOrder,
  };
}
