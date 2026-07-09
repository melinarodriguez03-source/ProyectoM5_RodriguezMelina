import type { CartState, CartAction } from "../types/cart";

export const initialCartState: CartState = {
  items: [],
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.productId === product.id);

      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, product.stock);
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: newQuantity }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: Math.min(quantity, product.stock),
            stock: product.stock,
          },
        ],
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(
          (item) => item.productId !== action.payload.productId
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.productId !== productId),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item
        ),
      };
    }

    case "CLEAR_CART":
      return initialCartState;

    case "LOAD_CART":
      return { ...state, items: action.payload.items };

    default:
      return state;
  }
}