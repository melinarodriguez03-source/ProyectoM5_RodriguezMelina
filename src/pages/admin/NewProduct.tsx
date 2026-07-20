import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/productService";
import { ProductForm } from "./ProductForm";
import type { ProductInput } from "../../types/product";

export function NewProduct() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (data: ProductInput) => {
    setIsSubmitting(true);
    try {
      await createProduct(data);
      navigate("/admin/products");
    } catch {
      setError("Error al crear el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Nuevo producto</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <ProductForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
    </div>
  );
}