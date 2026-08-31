import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminApp } from "./admin/AdminApp";
import { AdminLoginPage } from "./admin/pages/AdminLoginPage";
import { AdminGate } from "./admin/components/AdminGate";
import type { AdminPage } from "./admin/types";
import { adminPages, pageFromLocation, storefrontPages, updatePageUrl } from "./app/routes";
import type { AppPage } from "./app/routes";
import { useStorefrontController } from "./app/useStorefrontController";
import { AuthPage } from "./auth/pages/AuthPage";
import { StoreNav } from "./storefront/components/StoreNav";
import { ToastStack } from "./storefront/components/ToastStack";
import { AddressPage } from "./storefront/pages/AddressPage";
import { CartPage } from "./storefront/pages/CartPage";
import { CheckoutSuccessPage } from "./storefront/pages/CheckoutSuccessPage";
import { CollectionPage } from "./storefront/pages/CollectionPage";
import { CraftPage } from "./storefront/pages/CraftPage";
import { LandingPage } from "./storefront/pages/LandingPage";
import { OrderReviewPage } from "./storefront/pages/OrderReviewPage";
import { ProductDetailPage } from "./storefront/pages/ProductDetailPage";
import { ProfilePage } from "./storefront/pages/ProfilePage";
import { TrackingPage } from "./storefront/pages/TrackingPage";
import { WishlistPage } from "./storefront/pages/WishlistPage";
import type { StoreActions, StorePage, StoreProduct } from "./storefront/types";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { authSucceeded, clearCart, hydrateCustomer, hydrateOrders, replaceCart, replaceCheckout, resetCustomer, signedOut, store, updateCustomerProfile } from "./store";
import { getAuthGateway } from "./services/firebase/authRegistry";
import { backendApi } from "./lib/api";
import { clearOrderVerification, hasOrderVerification } from "./auth/orderVerificationSession";

const protectedStorefrontPages = new Set<StorePage>(["wishlist", "profile", "address", "review", "success", "tracking"]);
const orderVerifiedPages = new Set<StorePage>(["address", "review"]);

export default function App() {
  const [page, setPage] = useState<AppPage>(pageFromLocation);
  const [collectionCategory, setCollectionCategory] = useState<"All" | "Jeans" | "Henley">("All");
  const [authContinueTo, setAuthContinueTo] = useState<StorePage>("profile");
  const controller = useStorefrontController();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const hadAuthenticatedSession = useRef(false);

  useEffect(() => {
    const restoreRoute = () => setPage(pageFromLocation());
    window.addEventListener("popstate", restoreRoute);
    return () => window.removeEventListener("popstate", restoreRoute);
  }, []);

  useEffect(() => {
    const gateway = getAuthGateway();
    if (!gateway) {
      dispatch(signedOut());
      return;
    }
    return gateway.subscribe((user) => {
      if (!user) {
        clearOrderVerification();
        dispatch(signedOut());
        if (hadAuthenticatedSession.current) {
          dispatch(resetCustomer());
          dispatch(clearCart());
          hadAuthenticatedSession.current = false;
        }
        return;
      }
      hadAuthenticatedSession.current = true;
      dispatch(authSucceeded(user));
      dispatch(updateCustomerProfile({ uid: user.uid, name: user.displayName || "Dhaaga & Dagger member", email: user.email || "" }));
      const guestCart = store.getState().cart;
      void backendApi.customerState().then(async (response) => {
        let remote = response.data;
        if (!remote.cart.length && guestCart.length) remote = (await backendApi.replaceCart(guestCart)).data;
        dispatch(hydrateCustomer({ profile: remote.profile, likedIds: remote.likedIds, purchases: remote.purchases }));
        dispatch(replaceCart(remote.cart));
        if (remote.checkout) dispatch(replaceCheckout(remote.checkout));
        dispatch(hydrateOrders(remote.orders));
      }).catch(() => undefined);
    });
  }, [dispatch]);

  const go = useCallback((next: AppPage) => {
    setPage(next);
    updatePageUrl(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const storefrontGo = useCallback((next: StorePage) => {
    if (protectedStorefrontPages.has(next) && auth.status !== "authenticated") {
      setAuthContinueTo(next);
      go("auth");
      return;
    }
    if (orderVerifiedPages.has(next) && !hasOrderVerification(auth.user?.uid)) {
      setAuthContinueTo(next);
      go("auth");
      return;
    }
    if (next === "products") setCollectionCategory("All");
    go(next);
  }, [auth.status, auth.user?.uid, go]);

  useEffect(() => {
    if (!protectedStorefrontPages.has(page as StorePage) || auth.status === "loading" || auth.status === "authenticated") return;
    setAuthContinueTo(page as StorePage);
    go("auth");
  }, [auth.status, go, page]);
  const beginCheckout = useCallback(() => {
    if (auth.status === "authenticated" && hasOrderVerification(auth.user?.uid)) {
      storefrontGo("address");
      return;
    }
    setAuthContinueTo("address");
    go("auth");
  }, [auth.status, auth.user?.uid, go, storefrontGo]);
  const openAdminLogin = useCallback(() => go("admin-login"), [go]);
  const actions: StoreActions = useMemo(() => ({
    ...controller.actions,
    toggleLike: (id: number) => {
      if (auth.status !== "authenticated") {
        setAuthContinueTo("wishlist");
        go("auth");
        return;
      }
      controller.actions.toggleLike(id);
    },
    openProduct: (product: StoreProduct) => {
      controller.actions.openProduct(product);
      go("product-detail");
    },
  }), [auth.status, controller.actions, go]);

  const isStorefront = storefrontPages.includes(page as StorePage);
  const cartCount = controller.cart.reduce((total, line) => total + line.quantity, 0);

  if (protectedStorefrontPages.has(page as StorePage) && auth.status !== "authenticated") {
    if (auth.status === "loading") return <main className="secure-route-check"><span>Verifying your secure session…</span></main>;
    return <><AuthPage go={storefrontGo} notify={controller.notify} continueTo={page as StorePage} /><ToastStack messages={controller.toasts} /></>;
  }

  if (orderVerifiedPages.has(page as StorePage) && !hasOrderVerification(auth.user?.uid)) {
    return <><AuthPage go={storefrontGo} notify={controller.notify} continueTo={page as StorePage} /><ToastStack messages={controller.toasts} /></>;
  }

  return <>
    {isStorefront && page !== "auth" && <StoreNav page={page as StorePage} cartCount={cartCount} likedCount={actions.liked.size} go={storefrontGo} />}

    {page === "home" && <LandingPage go={storefrontGo} actions={actions} />}
    {page === "products" && <CollectionPage key={collectionCategory} actions={actions} initialCategory={collectionCategory} />}
    {page === "craft" && <CraftPage go={storefrontGo} />}
    {page === "wishlist" && <WishlistPage go={storefrontGo} actions={actions} />}
    {page === "profile" && <ProfilePage go={storefrontGo} actions={actions} />}
    {page === "auth" && <AuthPage go={storefrontGo} notify={controller.notify} continueTo={authContinueTo} />}
    {page === "product-detail" && <ProductDetailPage product={controller.selected} actions={actions} go={storefrontGo} />}
    {page === "cart" && <CartPage lines={controller.cart} update={controller.update} remove={controller.remove} go={storefrontGo} checkout={beginCheckout} />}
    {page === "address" && <AddressPage lines={controller.cart} go={storefrontGo} />}
    {page === "review" && <OrderReviewPage lines={controller.cart} go={storefrontGo} placeOrder={controller.placeOrder} />}
    {page === "success" && <CheckoutSuccessPage go={storefrontGo} />}
    {page === "tracking" && <TrackingPage go={storefrontGo} />}

    {page === "admin-login" && <AdminLoginPage go={go} />}
    {adminPages.includes(page as AdminPage) && <AdminGate onUnauthorized={openAdminLogin}><AdminApp page={page as AdminPage} go={go} products={controller.catalog} setProducts={controller.setCatalog} notify={controller.notify} /></AdminGate>}

    <ToastStack messages={controller.toasts} />
  </>;
}
