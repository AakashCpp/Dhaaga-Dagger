import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminApp } from "./admin/AdminApp";
import { AdminLoginPage } from "./admin/pages/AdminLoginPage";
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
import { OtpPage } from "./storefront/pages/OtpPage";
import { ProductDetailPage } from "./storefront/pages/ProductDetailPage";
import { ProfilePage } from "./storefront/pages/ProfilePage";
import { TrackingPage } from "./storefront/pages/TrackingPage";
import { WishlistPage } from "./storefront/pages/WishlistPage";
import type { StoreActions, StorePage, StoreProduct } from "./storefront/types";

export default function App() {
  const [page, setPage] = useState<AppPage>(pageFromLocation);
  const controller = useStorefrontController();

  useEffect(() => {
    const restoreRoute = () => setPage(pageFromLocation());
    window.addEventListener("popstate", restoreRoute);
    return () => window.removeEventListener("popstate", restoreRoute);
  }, []);

  const go = useCallback((next: AppPage) => {
    setPage(next);
    updatePageUrl(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const storefrontGo = go as (page: StorePage) => void;
  const actions: StoreActions = useMemo(() => ({
    ...controller.actions,
    openProduct: (product: StoreProduct) => {
      controller.actions.openProduct(product);
      go("product-detail");
    },
  }), [controller.actions, go]);

  const isStorefront = storefrontPages.includes(page as StorePage);
  const cartCount = controller.cart.reduce((total, line) => total + line.quantity, 0);

  return <>
    {isStorefront && page !== "auth" && <StoreNav page={page as StorePage} cartCount={cartCount} likedCount={actions.liked.size} go={storefrontGo} />}

    {page === "home" && <LandingPage go={storefrontGo} actions={actions} />}
    {page === "products" && <CollectionPage actions={actions} />}
    {page === "craft" && <CraftPage go={storefrontGo} />}
    {page === "wishlist" && <WishlistPage go={storefrontGo} actions={actions} />}
    {page === "profile" && <ProfilePage go={storefrontGo} actions={actions} />}
    {page === "auth" && <AuthPage go={storefrontGo} notify={controller.notify} />}
    {page === "product-detail" && <ProductDetailPage product={controller.selected} actions={actions} go={storefrontGo} />}
    {page === "cart" && <CartPage lines={controller.cart} update={controller.update} remove={controller.remove} go={storefrontGo} />}
    {page === "otp" && <OtpPage go={storefrontGo} />}
    {page === "address" && <AddressPage lines={controller.cart} go={storefrontGo} />}
    {page === "review" && <OrderReviewPage lines={controller.cart} go={storefrontGo} placeOrder={controller.placeOrder} />}
    {page === "success" && <CheckoutSuccessPage go={storefrontGo} />}
    {page === "tracking" && <TrackingPage go={storefrontGo} />}

    {page === "admin-login" && <AdminLoginPage go={go} />}
    {adminPages.includes(page as AdminPage) && <AdminApp page={page as AdminPage} go={go} products={controller.catalog} setProducts={controller.setCatalog} notify={controller.notify} />}

    <ToastStack messages={controller.toasts} />
  </>;
}
