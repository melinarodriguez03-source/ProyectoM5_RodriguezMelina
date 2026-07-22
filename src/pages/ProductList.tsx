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
          <div
            key={i}
            className="rounded-2xl p-3 border animate-pulse"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div className="h-40 rounded-xl" style={{ backgroundColor: "var(--border)" }} />
            <div className="h-4 mt-3 rounded w-3/4" style={{ backgroundColor: "var(--border)" }} />
            <div className="h-4 mt-2 rounded w-1/2" style={{ backgroundColor: "var(--border)" }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="p-4 text-center" style={{ color: "var(--accent)" }}>
        {error}
      </p>
    );
  }

  return (
    <div className="p-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl px-3 py-2 border outline-none"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "all")}
          className="rounded-xl px-3 py-2 border outline-none"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
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
        <p style={{ color: "var(--text-muted)" }} className="text-center mt-8">
          No se encontraron productos que coincidan con tu búsqueda.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="rounded-2xl p-3 border transition hover:-translate-y-1 hover:shadow-xl"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <span
                  className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  {product.category}
                </span>
              </div>

              <h3
                className="font-display font-medium text-sm mt-3 line-clamp-2"
                style={{ color: "var(--text)" }}
              >
                {product.name}
              </h3>

              <p
                className="font-display text-lg font-bold mt-1"
                style={{ color: "var(--primary)" }}
              >
                ${product.price.toLocaleString("es-AR")}
              </p>

              {product.stock === 0 ? (
                <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
                  Sin stock
                </span>
              ) : (
                <span
                  className="inline-block text-xs font-medium mt-1 px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--success) 15%, transparent)",
                    color: "var(--success)",
                  }}
                >
                  ✓ Stock disponible
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}