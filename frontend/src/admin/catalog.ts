import { storeProducts } from "../storefront/data";
import type { StoreProduct } from "../storefront/types";

const CATALOG_KEY = "dhaaga.catalog.single-product.v2";
const optimizedAssets = new Set(["jean-raw-indigo", "jean-washed-black", "jean-stone-blue", "jean-cloud-blue", "denim-anatomy", "denim-construction-macros"]);

function optimizeKnownAsset(url: string) {
  const match = url.match(/^\/assets\/(.+)\.png$/);
  return match && optimizedAssets.has(match[1]) ? `/assets/${match[1]}.jpg` : url;
}

function migrateLocalAssets(products: StoreProduct[]) {
  return products.map((product) => ({ ...product, category: product.category || "Jeans", subtype: product.subtype || product.fit || "Straight fit", image: optimizeKnownAsset(product.image), gallery: product.gallery?.map(optimizeKnownAsset) }));
}

export interface CatalogRepository {
  load: () => StoreProduct[];
  save: (products: StoreProduct[]) => void;
}

export function loadCatalog(): StoreProduct[] {
  try {
    const saved = window.localStorage.getItem(CATALOG_KEY) || window.sessionStorage.getItem(CATALOG_KEY);
    if (saved) return migrateLocalAssets(JSON.parse(saved) as StoreProduct[]);
  } catch {
    // Storage can be unavailable in privacy modes; defaults remain usable.
  }
  return migrateLocalAssets(storeProducts.map((product, index) => ({
    ...product,
    sku: product.sku || `DK-${String(product.id).padStart(4, "0")}`,
    stock: product.stock ?? 24 + index * 3,
    description: product.description || (product.category === "Henley"
      ? `A considered ${product.subtype.toLowerCase()} Henley in breathable cotton.`
      : `A considered ${product.fit.toLowerCase()} silhouette in durable ring-spun denim.`),
    active: product.active ?? true,
  })));
}

export function persistCatalog(products: StoreProduct[]) {
  storeProducts.splice(0, storeProducts.length, ...products);
  try {
    window.localStorage.setItem(CATALOG_KEY, JSON.stringify(products));
  } catch {
    try {
      window.sessionStorage.setItem(CATALOG_KEY, JSON.stringify(products));
    } catch {
      // The in-memory catalog still keeps the current session functional.
    }
  }
}

export const localCatalogRepository: CatalogRepository = {
  load: loadCatalog,
  save: persistCatalog,
};
