import { createContext, useReducer, useEffect, useMemo, type ReactNode } from "react";
import { cartReducer, initialCartState } from "./cartReducer";
import type { CartState, CartItem } from "../types/cart";
import type { Product } from "../types/product";

const STORAGE_KEY = "patagonix_cart";

interface CartContextValue {
  state: CartState;
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { items: JSON.parse(raw) } : initialCartState;
  } catch {
    return initialCartState;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const total = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const itemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const addItem = (product: Product, quantity = 1) =>
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });

  const removeItem = (productId: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });

  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{ state, items: state.items, total, itemCount, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}