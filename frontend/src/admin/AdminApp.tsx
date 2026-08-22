import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { updateOrderStatus as updateOrderStatusAction, updatePurchaseStatus } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { StoreProduct } from "../storefront/types";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminNotificationsProvider } from "./components/AdminNotifications";
import { DashboardPage } from "./pages/DashboardPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProductEditorPage } from "./pages/ProductEditorPage";
import { ProductsPage } from "./pages/ProductsPage";
import type { AdminPage, AdminRoute, OrderStatus } from "./types";
import { backendApi } from "../lib/api";
import { AdminNavigationProvider } from "./components/AdminNavigation";

export function AdminApp({ page, go, products, setProducts, notify }: { page: AdminPage; go: AdminRoute; products: StoreProduct[]; setProducts: Dispatch<SetStateAction<StoreProduct[]>>; notify: (message: string) => void }) {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.items);
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || "");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const selectedOrder = useMemo(() => orders.find((order) => order.id === selectedOrderId) || orders[0], [orders, selectedOrderId]);
  const selectedProduct = products.find((product) => product.id === selectedProductId) || null;
  const navigation = useMemo(() => ({
    go,
    openOrder: (id: string) => { setSelectedOrderId(id); go("order-detail"); },
    openProduct: (id: number) => { setSelectedProductId(id); go("admin-product-detail"); },
  }), [go]);

  const updateStatus = async (status: OrderStatus) => {
    if (!selectedOrder) return;
    try {
      const { data } = await backendApi.updateOrderStatus(selectedOrder.id, status);
      const at = data.history.at(-1)?.at || data.createdAt;
      dispatch(updateOrderStatusAction({ id: data.id, status: data.status, at }));
      const customerStatus = status === "Delivered" ? "Delivered" : status === "Shipped" || status === "Out for delivery" ? "Shipped" : "Processing";
      dispatch(updatePurchaseStatus({ id: data.id, status: customerStatus }));
      notify(`Order #${data.id} moved to ${status}`);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Order status could not be updated");
    }
  };
  const saveProduct = async (product: StoreProduct) => {
    const exists = products.some((item) => item.id === product.id);
    const { data } = exists ? await backendApi.updateProduct(product) : await backendApi.createProduct(product);
    setProducts((current) => current.some((item) => item.id === data.id) ? current.map((item) => item.id === data.id ? data : item) : [data, ...current]);
    setSelectedProductId(data.id);
    notify(`${data.name} saved to the storefront`);
    go("admin-products");
  };
  const deleteProduct = async (id: number) => {
    const item = products.find((product) => product.id === id);
    if (!item || !window.confirm(`Delete ${item.name}? This removes it from the customer storefront.`)) return;
    try {
      await backendApi.deleteProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
      notify(`${item.name} deleted`);
      go("admin-products");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Product could not be deleted");
    }
  };

  return <AdminNavigationProvider value={navigation}><AdminNotificationsProvider><div className="admin-app"><AdminSidebar page={page} go={go} /><main className="admin-workspace">{page === "admin" && <DashboardPage orders={orders} products={products} go={go} selectOrder={setSelectedOrderId} />}{page === "orders" && <OrdersPage orders={orders} go={go} selectOrder={setSelectedOrderId} />}{page === "order-detail" && selectedOrder && <OrderDetailPage order={selectedOrder} go={go} updateStatus={updateStatus} />}{page === "admin-products" && <ProductsPage products={products} go={go} editProduct={setSelectedProductId} deleteProduct={deleteProduct} />}{page === "admin-product-detail" && <ProductEditorPage product={selectedProduct} go={go} saveProduct={saveProduct} deleteProduct={deleteProduct} />}</main></div></AdminNotificationsProvider></AdminNavigationProvider>;
}
