import type { CartItem } from "./cart";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
}

export type OrderInput = Omit<Order, "id" | "createdAt">;