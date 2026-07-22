import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCart } from "./useCart";
import { CartTestWrapper } from "../test/test-utils";
import type { Product } from "../types/product";

const mockProduct: Product = {
  id: "prod-1",
  name: "Mouse Test",
  image: "test.jpg",
  description: "Un mouse de prueba",
  price: 50,
  stock: 10,
  category: "peripherals",
};

beforeEach(() => {
  localStorage.clear();
});

describe("useCart", () => {
  it("empieza con el carrito vacío", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartTestWrapper });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it("agrega un producto y actualiza el total", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartTestWrapper });

    act(() => {
      result.current.addItem(mockProduct, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.total).toBe(100); // 50 * 2
    expect(result.current.itemCount).toBe(2);
  });

  it("elimina un producto correctamente", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartTestWrapper });

    act(() => {
      result.current.addItem(mockProduct, 1);
    });

    act(() => {
      result.current.removeItem("prod-1");
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it("lanza error si se usa fuera del CartProvider", () => {
    const consoleError = console.error;
    console.error = () => {};

    expect(() => renderHook(() => useCart())).toThrow(
      "useCart debe usarse dentro de un CartProvider"
    );

    console.error = consoleError;
  });
});