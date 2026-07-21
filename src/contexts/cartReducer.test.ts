import { describe, it, expect } from "vitest";
import { cartReducer, initialCartState } from "./cartReducer";
import type { Product } from "../types/product";

const mockProduct: Product = {
  id: "prod-1",
  name: "Laptop Test",
  image: "test.jpg",
  description: "Una laptop de prueba",
  price: 1000,
  stock: 5,
  category: "laptops",
};

describe("cartReducer", () => {
  it("agrega un producto nuevo al carrito vacío", () => {
    const result = cartReducer(initialCartState, {
      type: "ADD_ITEM",
      payload: { product: mockProduct, quantity: 1 },
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].productId).toBe("prod-1");
    expect(result.items[0].quantity).toBe(1);
  });

  it("suma cantidad si el producto ya está en el carrito", () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: "ADD_ITEM",
      payload: { product: mockProduct, quantity: 1 },
    });

    const result = cartReducer(stateWithItem, {
      type: "ADD_ITEM",
      payload: { product: mockProduct, quantity: 2 },
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(3);
  });

  it("no permite agregar más cantidad que el stock disponible", () => {
    const result = cartReducer(initialCartState, {
      type: "ADD_ITEM",
      payload: { product: mockProduct, quantity: 10 }, // stock es 5
    });

    expect(result.items[0].quantity).toBe(5);
  });

  it("elimina un producto del carrito", () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: "ADD_ITEM",
      payload: { product: mockProduct, quantity: 1 },
    });

    const result = cartReducer(stateWithItem, {
      type: "REMOVE_ITEM",
      payload: { productId: "prod-1" },
    });

    expect(result.items).toHaveLength(0);
  });

  it("actualiza la cantidad de un producto", () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: "ADD_ITEM",
      payload: { product: mockProduct, quantity: 1 },
    });

    const result = cartReducer(stateWithItem, {
      type: "UPDATE_QUANTITY",
      payload: { productId: "prod-1", quantity: 3 },
    });

    expect(result.items[0].quantity).toBe(3);
  });

  it("elimina el producto si la cantidad actualizada es 0", () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: "ADD_ITEM",
      payload: { product: mockProduct, quantity: 1 },
    });

    const result = cartReducer(stateWithItem, {
      type: "UPDATE_QUANTITY",
      payload: { productId: "prod-1", quantity: 0 },
    });

    expect(result.items).toHaveLength(0);
  });

  it("vacía el carrito completamente", () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: "ADD_ITEM",
      payload: { product: mockProduct, quantity: 1 },
    });

    const result = cartReducer(stateWithItem, { type: "CLEAR_CART" });

    expect(result.items).toHaveLength(0);
  });
});