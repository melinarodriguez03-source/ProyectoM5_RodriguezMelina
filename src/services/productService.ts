import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product, ProductInput, ProductUpdate, Category } from "../types/product";

const PRODUCTS_COLLECTION = "products";


export async function getProducts(): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy("name")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}


export async function getProductsByCategory(category: Category): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where("category", "==", category),
    orderBy("name")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}


export async function getProductById(id: string): Promise<Product | null> {
  const ref = doc(db, PRODUCTS_COLLECTION, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}


export async function createProduct(data: ProductInput): Promise<string> {
  const ref = await addDoc(collection(db, PRODUCTS_COLLECTION), data);
  return ref.id;
}


export async function updateProduct(id: string, data: ProductUpdate): Promise<void> {
  const ref = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(ref, { ...data });
}


export async function deleteProduct(id: string): Promise<void> {
  const ref = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(ref);
}