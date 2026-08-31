export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  salePrice: number;
  regularPrice: number;
  sizes: string[];
  isNew: boolean;
  images: string[];
  brand: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "WIDE LEG 001",
    category: "DENIMS",
    subcategory: "WIDE LEG",
    salePrice: 1499,
    regularPrice: 1699,
    sizes: ["28", "30", "32", "34", "36", "38"],
    isNew: true,
    images: [
      "/assets/wide-leg-001-front.png",
      "/assets/campaign-wide-leg-hero.png",
      "/assets/wide-leg-001-editorial.png",
    ],
    brand: "Dhaaga & Dagger",
  },
];

export const collections = [
  { name: "THE SAMPLE", count: 1, image: "/assets/wide-leg-001-front.png" },
];

export const navCategories = ["THE SAMPLE", "STRAIGHT FIT", "WIDE LEG", "BOOTCUT", "BAGGY FIT"];

export const heroSlides = [
  {
    image: "/assets/campaign-wide-leg-hero.png",
    title: "WIDE LEG 001",
    subtitle: "ONE SAMPLE. ONE CLEAR DIRECTION.",
  },
];
