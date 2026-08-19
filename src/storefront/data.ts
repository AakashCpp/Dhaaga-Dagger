import type { StoreProduct } from "./types";

export const storeProducts: StoreProduct[] = [
  { id: 1, name: "Raw Indigo Slim", fit: "Slim", price: 1299, color: "#274c77", image: "/assets/jean-raw-indigo.jpg", gallery: ["/assets/jean-raw-indigo.jpg", "/assets/jean-washed-black.jpg", "/assets/denim-construction-macros.jpg"], sizes: ["30", "32", "34", "36"] },
  { id: 2, name: "Stone Blue Regular", fit: "Regular", price: 1199, color: "#426a8c", image: "/assets/jean-stone-blue.jpg", gallery: ["/assets/jean-stone-blue.jpg", "/assets/jean-cloud-blue.jpg", "/assets/denim-anatomy.jpg"], sizes: ["30", "32", "34", "36"] },
  { id: 3, name: "Washed Black Taper", fit: "Skinny", price: 1399, color: "#172f4d", image: "/assets/jean-washed-black.jpg", gallery: ["/assets/jean-washed-black.jpg", "/assets/jean-raw-indigo.jpg", "/assets/denim-construction-macros.jpg"], sizes: ["28", "30", "32", "34"] },
  { id: 4, name: "Cloud Wash Loose", fit: "Relaxed", price: 1099, color: "#5b7183", image: "/assets/jean-cloud-blue.jpg", gallery: ["/assets/jean-cloud-blue.jpg", "/assets/jean-stone-blue.jpg", "/assets/denim-anatomy.jpg"], sizes: ["30", "32", "34", "36"] },
  { id: 5, name: "Raw Indigo Wide", fit: "Relaxed", price: 1599, color: "#142a43", image: "/assets/jean-raw-indigo.jpg", gallery: ["/assets/jean-raw-indigo.jpg", "/assets/jean-washed-black.jpg", "/assets/denim-anatomy.jpg"], sizes: ["28", "30", "32", "34", "36"] },
  { id: 6, name: "Stone Blue Straight", fit: "Regular", price: 1499, color: "#70879b", image: "/assets/jean-stone-blue.jpg", gallery: ["/assets/jean-stone-blue.jpg", "/assets/jean-cloud-blue.jpg", "/assets/denim-construction-macros.jpg"], sizes: ["30", "32", "34", "36", "38"] },
  { id: 7, name: "Midnight Taper", fit: "Slim", price: 1699, color: "#111c2c", image: "/assets/jean-washed-black.jpg", gallery: ["/assets/jean-washed-black.jpg", "/assets/jean-raw-indigo.jpg", "/assets/denim-construction-macros.jpg"], sizes: ["28", "30", "32", "34"] },
  { id: 8, name: "Cloud Blue Volume", fit: "Relaxed", price: 1399, color: "#91a5b3", image: "/assets/jean-cloud-blue.jpg", gallery: ["/assets/jean-cloud-blue.jpg", "/assets/jean-stone-blue.jpg", "/assets/denim-anatomy.jpg"], sizes: ["30", "32", "34", "36", "38"] },
];

export const reviews = [
  ["Aarav S.", "The fit is unreal. It feels broken-in from day one.", "5.0"],
  ["Maya R.", "Finally jeans that works through a full day and still looks sharp.", "4.9"],
  ["Kabir P.", "Great color, clean finish, and a silhouette that holds.", "5.0"],
  ["Nia K.", "I came back for a second pair within a week.", "4.8"],
];

export const money = (value: number) => `Rs. ${value.toLocaleString("en-IN")}`;
