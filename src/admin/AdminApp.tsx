import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { updateOrderStatus as updateOrderStatusAction, updatePurchaseStatus } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { StoreProduct } from "../storefront/types";
import { AdminSidebar } from "./components/AdminSidebar";
import { DashboardPage } from "./pages/DashboardPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProductEditorPage } from "./pages/ProductEditorPage";
import { ProductsPage } from "./pages/ProductsPage";
import type { AdminPage, AdminRoute, OrderStatus } from "./types";

export function AdminApp({ page, go, products, setProducts, notify }: { page: AdminPage; go: AdminRoute; products: StoreProduct[]; setProducts: Dispatch<SetStateAction<StoreProduct[]>>; notify: (message: string) => void }) {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.items);
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || "");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const selectedOrder = useMemo(() => orders.find((order) => order.id === selectedOrderId) || orders[0], [orders, selectedOrderId]);
  const selectedProduct = products.find((product) => product.id === selectedProductId) || null;

  const updateStatus = (status: OrderStatus) => {
    if (!selectedOrder) return;
    const at = new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    dispatch(updateOrderStatusAction({ id: selectedOrder.id, status, at }));
    const customerStatus = status === "Delivered" ? "Delivered" : status === "Shipped" || status === "Out for delivery" ? "Shipped" : "Processing";
    dispatch(updatePurchaseStatus({ id: selectedOrder.id, status: customerStatus }));
    notify(`Order #${selectedOrder.id} moved to ${status}`);
  };
  const saveProduct = (product: StoreProduct) => {
    setProducts((current) => current.some((item) => item.id === product.id) ? current.map((item) => item.id === product.id ? product : item) : [product, ...current]);
    setSelectedProductId(product.id);
    notify(`${product.name} saved to the storefront`);
    go("admin-products");
  };
  const deleteProduct = (id: number) => {
    const item = products.find((product) => product.id === id);
    if (!item || !window.confirm(`Delete ${item.name}? This removes it from the customer storefront.`)) return;
    setProducts((current) => current.filter((product) => product.id !== id));
    notify(`${item.name} deleted`);
    go("admin-products");
  };

  return <div className="admin-app"><AdminSidebar page={page} go={go} /><main className="admin-workspace">{page === "admin" && <DashboardPage orders={orders} products={products} go={go} selectOrder={setSelectedOrderId} />}{page === "orders" && <OrdersPage orders={orders} go={go} selectOrder={setSelectedOrderId} />}{page === "order-detail" && selectedOrder && <OrderDetailPage order={selectedOrder} go={go} updateStatus={updateStatus} />}{page === "admin-products" && <ProductsPage products={products} go={go} editProduct={setSelectedProductId} deleteProduct={deleteProduct} />}{page === "admin-product-detail" && <ProductEditorPage product={selectedProduct} go={go} saveProduct={saveProduct} deleteProduct={deleteProduct} />}</main></div>;
}
