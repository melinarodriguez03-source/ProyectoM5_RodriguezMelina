import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../../services/productService";
import { ProductForm } from "./ProductForm";
import type { Product, ProductInput } from "../../types/product";

export function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const data = await getProductById(id!);
        if (!data) {
          setError("Producto no encontrado");
          return;
        }
        setProduct(data);
      } catch {
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleUpdate = async (data: ProductInput) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateProduct(id, data);
      navigate("/admin/products");
    } catch {
      setError("Error al actualizar el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="p-4">Cargando producto...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!product) return null;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar producto</h1>
      <ProductForm
        initialData={product}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}