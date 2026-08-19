import type { AdminOrder, OrderStatus } from "./types";
import type { StoreProduct } from "../storefront/types";

export const orderStatuses: OrderStatus[] = ["Placed", "Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"];

export function createInitialOrders(products: StoreProduct[]): AdminOrder[] {
  const customers = [
    ["Rohan Kumar", "98765 43210", "rohan@email.com", "New Delhi", "110001"],
    ["Aman Singh", "98111 20482", "aman@email.com", "Gurugram", "122001"],
    ["Priya Verma", "99208 51003", "priya@email.com", "Mumbai", "400001"],
    ["Neha Joshi", "98990 32145", "neha@email.com", "Noida", "201301"],
    ["Yash Mehta", "97661 88210", "yash@email.com", "Pune", "411001"],
  ];
  return customers.map(([name, phone, email, city, pin], index) => {
    const status = orderStatuses[Math.min(index + 1, orderStatuses.length - 1)];
    const selected = [products[index % products.length], products[(index + 2) % products.length]].filter(Boolean);
    return {
      id: `DK1234567${8 + index}`,
      customer: { name, phone, email },
      address: `${123 + index}, Market Road, Central District`,
      city,
      pin,
      createdAt: `${18 - index} Aug 2026, ${10 + index}:30 AM`,
      status,
      payment: index % 2 ? "UPI" : "COD",
      discount: 0,
      items: selected.map((product, itemIndex) => ({ productId: product.id, name: product.name, image: product.image, size: product.sizes[itemIndex] || product.sizes[0], quantity: 1, price: product.price })),
      history: orderStatuses.slice(0, orderStatuses.indexOf(status) + 1).map((item, historyIndex) => ({ status: item, at: `${18 - index} Aug, ${10 + historyIndex}:30 AM` })),
    };
  });
}

export const orderTotal = (order: AdminOrder) => order.items.reduce((total, item) => total + item.price * item.quantity, 0) - (order.discount || 0);
