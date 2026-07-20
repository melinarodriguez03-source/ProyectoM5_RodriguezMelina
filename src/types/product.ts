export type Category =
  | "laptops"
  | "smartphones"
  | "accessories"
  | "monitors"
  | "peripherals"
  | "components";

export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
}

// Para crear un producto nuevo (el id lo genera Firestore)
export type ProductInput = Omit<Product, "id">;

// Para editar un producto (campos opcionales)
export type ProductUpdate = Partial<ProductInput>;

export const CATEGORIES: Category[] = [
  "laptops",
  "smartphones",
  "accessories",
  "monitors",
  "peripherals",
  "components",
];