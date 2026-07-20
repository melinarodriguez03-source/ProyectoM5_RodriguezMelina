import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-40 rounded" />
            <div className="bg-gray-200 h-4 mt-2 rounded w-3/4" />
            <div className="bg-gray-200 h-4 mt-1 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="p-4 text-gray-500">No hay productos disponibles.</p>;
  }

  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/products/${product.id}`}
          className="border rounded p-2 hover:shadow-md transition"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover rounded"
          />
          <h3 className="mt-2 font-medium text-sm truncate">{product.name}</h3>
          <p className="text-sm text-gray-600">${product.price}</p>
          {product.stock === 0 && (
            <span className="text-xs text-red-500">Sin stock</span>
          )}
        </Link>
      ))}
    </div>
  );
}