import type { StoreProduct } from "./types";

export const storeProducts: StoreProduct[] = [
  {
    id: 1,
    category: "Jeans",
    subtype: "Wide leg",
    name: "Wide Leg 001",
    fit: "Wide leg",
    price: 1499,
    color: "#b7cad8",
    image: "/assets/wide-leg-001-front.png",
    gallery: [
      "/assets/wide-leg-001-front.png",
      "/assets/campaign-wide-leg-hero.png",
      "/assets/wide-leg-001-editorial.png",
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    sku: "DD-WL-0001",
    stock: 24,
    description: "Our sample silhouette: an exaggerated wide leg in a pale vintage wash, cut true at the waist and styled with the clean ease of a long-sleeve Henley.",
    active: true,
  },
];

export const reviews = [
  ["Aarav S.", "The waist sits true and the wide leg falls exactly how it should.", "5.0"],
  ["Maya R.", "The shape feels bold without trying too hard.", "4.9"],
  ["Kabir P.", "Great wash, clean finish, and a silhouette that holds.", "5.0"],
  ["Nia K.", "The Henley-and-denim styling makes the whole look feel complete.", "4.8"],
];

export const money = (value: number) => `Rs. ${value.toLocaleString("en-IN")}`;
