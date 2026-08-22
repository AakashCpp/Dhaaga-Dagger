export type StorePage =
  | "home"
  | "products"
  | "craft"
  | "wishlist"
  | "profile"
  | "auth"
  | "product-detail"
  | "cart"
  | "address"
  | "review"
  | "success"
  | "tracking";

export type StoreProduct = {
  id: number;
  category: "Jeans" | "Henley";
  subtype: string;
  name: string;
  fit: string;
  price: number;
  color: string;
  image: string;
  gallery?: string[];
  sizes: string[];
  sku?: string;
  stock?: number;
  description?: string;
  active?: boolean;
};

export type StoreLine = StoreProduct & { quantity: number; size: string };

export type StoreActions = {
  products: StoreProduct[];
  liked: Set<number>;
  toggleLike: (id: number) => void;
  openProduct: (product: StoreProduct) => void;
  add: (product: StoreProduct, size: string) => void;
};
