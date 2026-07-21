import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/productService";
import type { Product } from "../../types/product";

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("¿Seguro que querés eliminar este producto?");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("No se pudo eliminar el producto");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <p className="p-4">Cargando productos...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Productos ({products.length})</h1>
        <Link
          to="/admin/products/new"
          className="bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700"
        >
          + Nuevo producto
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No hay productos cargados todavía.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-2">Imagen</th>
                <th className="py-2 pr-2">Nombre</th>
                <th className="py-2 pr-2">Categoría</th>
                <th className="py-2 pr-2">Precio</th>
                <th className="py-2 pr-2">Stock</th>
                <th className="py-2 pr-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-2 pr-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 pr-2">{product.name}</td>
                  <td className="py-2 pr-2">{product.category}</td>
                  <td className="py-2 pr-2">${product.price}</td>
                  <td className="py-2 pr-2">
                    {product.stock === 0 ? (
                      <span className="text-red-600">Sin stock</span>
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className="py-2 pr-2">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        {deletingId === product.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}