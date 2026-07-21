import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import { useDebounce } from "../hooks/useDebounce";
import { CATEGORIES, type Category, type Product } from "../types/product";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const debouncedSearch = useDebounce(search, 400);

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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [products, category, debouncedSearch]);

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

  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "all")}
          className="border rounded px-3 py-2"
        >
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Resultados */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">
          No se encontraron productos que coincidan con tu búsqueda.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
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
      )}
    </div>
  );
}