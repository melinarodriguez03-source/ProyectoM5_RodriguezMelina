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

/**
 * Trae todos los productos activos.
 */
export async function getProducts(): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy("name")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

/**
 * Trae productos filtrados por categoría.
 */
export async function getProductsByCategory(category: Category): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where("category", "==", category),
    orderBy("name")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

/**
 * Trae un producto por id. Devuelve null si no existe.
 */
export async function getProductById(id: string): Promise<Product | null> {
  const ref = doc(db, PRODUCTS_COLLECTION, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}

/**
 * Crea un producto nuevo. Devuelve el id generado.
 */
export async function createProduct(data: ProductInput): Promise<string> {
  const ref = await addDoc(collection(db, PRODUCTS_COLLECTION), data);
  return ref.id;
}

/**
 * Actualiza campos de un producto existente.
 */
export async function updateProduct(id: string, data: ProductUpdate): Promise<void> {
  const ref = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(ref, { ...data });
}

/**
 * Elimina un producto.
 */
export async function deleteProduct(id: string): Promise<void> {
  const ref = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(ref);
}