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
    name: "RELEX ASH WIDE",
    category: "DENIMS",
    subcategory: "WIDE",
    salePrice: 1399,
    regularPrice: 1600,
    sizes: ["28", "30", "32", "34", "36"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30269897/pexels-photo-30269897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30930107/pexels-photo-30930107.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/11862262/pexels-photo-11862262.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 2,
    name: "RELEX BLUE WIDE",
    category: "DENIMS",
    subcategory: "WIDE",
    salePrice: 1399,
    regularPrice: 1600,
    sizes: ["28", "30", "32", "34", "36", "38"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/30930107/pexels-photo-30930107.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/17720437/pexels-photo-17720437.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/7764611/pexels-photo-7764611.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 3,
    name: "FRONX DARK WIDE",
    category: "DENIMS",
    subcategory: "WIDE",
    salePrice: 1399,
    regularPrice: 1600,
    sizes: ["28", "30", "32", "34", "36", "38"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/35347257/pexels-photo-35347257.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30269897/pexels-photo-30269897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/11862262/pexels-photo-11862262.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 4,
    name: "VOX BLUE WIDE",
    category: "DENIMS",
    subcategory: "WIDE",
    salePrice: 1399,
    regularPrice: 1600,
    sizes: ["28", "30", "32", "34"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/4271568/pexels-photo-4271568.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30930107/pexels-photo-30930107.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/17720437/pexels-photo-17720437.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/7764611/pexels-photo-7764611.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 5,
    name: "EMERALD GREEN WIDE",
    category: "DENIMS",
    subcategory: "WIDE",
    salePrice: 1399,
    regularPrice: 1600,
    sizes: ["28", "30", "32", "34"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/3998648/pexels-photo-3998648.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30269897/pexels-photo-30269897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/35347257/pexels-photo-35347257.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 6,
    name: "SMOKE ASH WIDE",
    category: "DENIMS",
    subcategory: "WIDE",
    salePrice: 1399,
    regularPrice: 1600,
    sizes: ["28", "30", "32", "34"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/8099697/pexels-photo-8099697.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30930107/pexels-photo-30930107.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/4271568/pexels-photo-4271568.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 7,
    name: "CYBER GREEN WIDE",
    category: "DENIMS",
    subcategory: "WIDE",
    salePrice: 1399,
    regularPrice: 1600,
    sizes: ["28", "30", "32", "34", "36"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/36128751/pexels-photo-36128751.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/34442288/pexels-photo-34442288.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30269897/pexels-photo-30269897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/11862262/pexels-photo-11862262.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 8,
    name: "AXO SKY BLUE WIDE",
    category: "DENIMS",
    subcategory: "WIDE",
    salePrice: 1399,
    regularPrice: 1600,
    sizes: ["28", "30", "32", "34", "36"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/17720437/pexels-photo-17720437.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/7764611/pexels-photo-7764611.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30930107/pexels-photo-30930107.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/4271568/pexels-photo-4271568.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 9,
    name: "ECO HASH STRAIGHT",
    category: "DENIMS",
    subcategory: "STRAIGHT",
    salePrice: 1299,
    regularPrice: 1500,
    sizes: ["28", "30", "32", "34", "36"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/35347257/pexels-photo-35347257.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30269897/pexels-photo-30269897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/3998648/pexels-photo-3998648.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 10,
    name: "ECO BROWN STRAIGHT",
    category: "DENIMS",
    subcategory: "STRAIGHT",
    salePrice: 1299,
    regularPrice: 1500,
    sizes: ["28", "30", "32", "34", "36"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/3998648/pexels-photo-3998648.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/8099697/pexels-photo-8099697.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/4271568/pexels-photo-4271568.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 11,
    name: "ROAX BLUE BAGGY",
    category: "DENIMS",
    subcategory: "BAGGY",
    salePrice: 1299,
    regularPrice: 1500,
    sizes: ["28", "30", "32", "34", "36"],
    isNew: false,
    images: [
      "https://images.pexels.com/photos/30930107/pexels-photo-30930107.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/17720437/pexels-photo-17720437.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/7764611/pexels-photo-7764611.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 12,
    name: "ROAX BROWN BAGGY",
    category: "DENIMS",
    subcategory: "BAGGY",
    salePrice: 1299,
    regularPrice: 1500,
    sizes: ["28", "30", "32", "34", "36"],
    isNew: false,
    images: [
      "https://images.pexels.com/photos/36128751/pexels-photo-36128751.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/35347257/pexels-photo-35347257.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30269897/pexels-photo-30269897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/34442288/pexels-photo-34442288.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 13,
    name: "GOTHIC WAFFLE TEE",
    category: "TOPS",
    subcategory: "TOPS",
    salePrice: 1099,
    regularPrice: 1300,
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/2451200/pexels-photo-2451200.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/804402/pexels-photo-804402.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/1868566/pexels-photo-1868566.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/26797742/pexels-photo-26797742.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 14,
    name: "RAGLAN STAR WAFFLE",
    category: "TOPS",
    subcategory: "TOPS",
    salePrice: 1099,
    regularPrice: 1300,
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/804402/pexels-photo-804402.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/2451200/pexels-photo-2451200.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/5366297/pexels-photo-5366297.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/1868566/pexels-photo-1868566.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 15,
    name: "RAGLAN STRIPED BLACK",
    category: "TOPS",
    subcategory: "TOPS",
    salePrice: 899,
    regularPrice: 1100,
    sizes: ["S", "M", "L"],
    isNew: false,
    images: [
      "https://images.pexels.com/photos/1868566/pexels-photo-1868566.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/26797742/pexels-photo-26797742.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/804402/pexels-photo-804402.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/2451200/pexels-photo-2451200.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 16,
    name: "HENLEY BLACK TIGHTFIT",
    category: "TOPS",
    subcategory: "TOPS",
    salePrice: 899,
    regularPrice: 1000,
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/5366316/pexels-photo-5366316.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30407760/pexels-photo-30407760.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/804402/pexels-photo-804402.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/21926928/pexels-photo-21926928.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 17,
    name: "VEXO GREEN WIDE",
    category: "DENIMS",
    subcategory: "WIDE",
    salePrice: 1399,
    regularPrice: 1600,
    sizes: ["28", "30", "32", "34"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/34442296/pexels-photo-34442296.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/36128751/pexels-photo-36128751.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30269897/pexels-photo-30269897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 18,
    name: "VEXO GREY WIDE",
    category: "DENIMS",
    subcategory: "WIDE",
    salePrice: 1399,
    regularPrice: 1600,
    sizes: ["28", "30", "32", "34"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/29463948/pexels-photo-29463948.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/35347257/pexels-photo-35347257.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30930107/pexels-photo-30930107.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/4271568/pexels-photo-4271568.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 19,
    name: "VEXO DARK WIDE",
    category: "DENIMS",
    subcategory: "WIDE",
    salePrice: 1399,
    regularPrice: 1600,
    sizes: ["28", "30", "32", "34"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/7764611/pexels-photo-7764611.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/8099697/pexels-photo-8099697.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/3998648/pexels-photo-3998648.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 20,
    name: "HENLEY WHITE TIGHTFIT",
    category: "TOPS",
    subcategory: "TOPS",
    salePrice: 899,
    regularPrice: 1000,
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/21926928/pexels-photo-21926928.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/5366297/pexels-photo-5366297.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/2451200/pexels-photo-2451200.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/804402/pexels-photo-804402.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 21,
    name: "LAP BROWN STRAIGHT",
    category: "DENIMS",
    subcategory: "STRAIGHT",
    salePrice: 1399,
    regularPrice: 1600,
    sizes: ["28", "30", "32", "34", "36"],
    isNew: false,
    images: [
      "https://images.pexels.com/photos/20777875/pexels-photo-20777875.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/3998648/pexels-photo-3998648.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/7764611/pexels-photo-7764611.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 22,
    name: "SET GREEN BAGGY",
    category: "DENIMS",
    subcategory: "BAGGY",
    salePrice: 1299,
    regularPrice: 1500,
    sizes: ["28", "30", "32", "34"],
    isNew: false,
    images: [
      "https://images.pexels.com/photos/34442288/pexels-photo-34442288.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/36128751/pexels-photo-36128751.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30269897/pexels-photo-30269897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/35347257/pexels-photo-35347257.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 23,
    name: "FIRE WAFFLE TEE",
    category: "TOPS",
    subcategory: "TOPS",
    salePrice: 1099,
    regularPrice: 1300,
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/26797742/pexels-photo-26797742.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/804402/pexels-photo-804402.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/1868566/pexels-photo-1868566.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/2451200/pexels-photo-2451200.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  },
  {
    id: 24,
    name: "RUBY GREEN WIDE",
    category: "DENIMS",
    subcategory: "WIDE",
    salePrice: 1399,
    regularPrice: 1600,
    sizes: ["28", "30", "32", "34", "36"],
    isNew: true,
    images: [
      "https://images.pexels.com/photos/36729022/pexels-photo-36729022.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/34442296/pexels-photo-34442296.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/30269897/pexels-photo-30269897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
      "https://images.pexels.com/photos/11862262/pexels-photo-11862262.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
    ],
    brand: "Dhaaga & Dagger"
  }
];

export const collections = [
  { name: "DENIMS", count: 195, image: "https://images.pexels.com/photos/29191559/pexels-photo-29191559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=500" },
  { name: "TOPS", count: 34, image: "https://images.pexels.com/photos/2451200/pexels-photo-2451200.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=500" },
  { name: "ACCESSORIES", count: 14, image: "https://images.pexels.com/photos/8099697/pexels-photo-8099697.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=500" }
];

export const navCategories = [
  "ALL DROPS",
  "NEW DROPS",
  "DENIMS",
  "BAGGY",
  "BOOTCUT",
  "WIDE",
  "STRAIGHT",
  "TOPS",
  "ACCESSORIES"
];

export const heroSlides = [
  {
    image: "https://images.pexels.com/photos/5236987/pexels-photo-5236987.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
    title: "NEW DROPS",
    subtitle: "LEAD WITH CONFIDENCE"
  },
  {
    image: "https://images.pexels.com/photos/38317521/pexels-photo-38317521.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
    title: "WIDE COLLECTION",
    subtitle: "OWN YOUR JOURNEY"
  },
  {
    image: "https://images.pexels.com/photos/38953285/pexels-photo-38953285.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
    title: "STREET STYLE",
    subtitle: "DEFINE YOUR LOOK"
  },
  {
    image: "https://images.pexels.com/photos/15051707/pexels-photo-15051707.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
    title: "PREMIUM DENIMS",
    subtitle: "CRAFTED FOR YOU"
  },
  {
    image: "https://images.pexels.com/photos/7230891/pexels-photo-7230891.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
    title: "BAGGY FIT",
    subtitle: "COMFORT MEETS STYLE"
  },
  {
    image: "https://images.pexels.com/photos/38317533/pexels-photo-38317533.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
    title: "TOP COLLECTION",
    subtitle: "STAY AHEAD"
  }
];
