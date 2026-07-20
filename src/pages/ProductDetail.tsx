import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../hooks/useCart";
import type { Product } from "../types/product";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const data = await getProductById(id);
        if (!data) {
          setError("Producto no encontrado");
          return;
        }
        setProduct(data);
      } catch {
        setError("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-4 max-w-2xl mx-auto animate-pulse">
        <div className="bg-gray-200 h-64 rounded" />
        <div className="bg-gray-200 h-6 mt-4 rounded w-2/3" />
        <div className="bg-gray-200 h-4 mt-2 rounded w-1/3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-600">{error}</p>
        <Link to="/products" className="text-blue-600 underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const outOfStock = product.stock === 0;

  return (
    <div className="p-4 max-w-2xl mx-auto flex flex-col sm:flex-row gap-6">
      <img
        src={product.image}
        alt={product.name}
        className="w-full sm:w-1/2 h-64 object-cover rounded"
      />

      <div className="flex-1">
        <h1 className="text-xl font-bold">{product.name}</h1>
        <p className="text-gray-600 mt-1">{product.category}</p>
        <p className="text-2xl font-semibold mt-2">${product.price}</p>
        <p className="text-gray-700 mt-4">{product.description}</p>

        {outOfStock ? (
          <p className="text-red-600 font-medium mt-4">Sin stock</p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mt-4">{product.stock} disponibles</p>

            <div className="flex items-center gap-3 mt-3">
              <label htmlFor="quantity" className="text-sm">
                Cantidad
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.min(Number(e.target.value), product.stock))
                }
                className="w-16 border rounded px-2 py-1"
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-4 w-full sm:w-auto bg-blue-600 text-white rounded px-6 py-2 hover:bg-blue-700 transition"
            >
              {added ? "¡Agregado! ✓" : "Agregar al carrito"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}