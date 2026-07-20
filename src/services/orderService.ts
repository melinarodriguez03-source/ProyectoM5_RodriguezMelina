import { collection, addDoc, doc, getDoc, getDocs, query, where, orderBy, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Order, OrderInput, OrderStatus } from "../types/order";

const ORDERS_COLLECTION = "orders";

export async function createOrder(data: OrderInput): Promise<string> {
  const ref = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...data,
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const ref = doc(db, ORDERS_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Order;
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const ref = doc(db, ORDERS_COLLECTION, id);
  await updateDoc(ref, { status });
}