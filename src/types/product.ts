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


export type ProductInput = Omit<Product, "id">;


export type ProductUpdate = Partial<ProductInput>;

export const CATEGORIES: Category[] = [
  "laptops",
  "smartphones",
  "accessories",
  "monitors",
  "peripherals",
  "components",
];