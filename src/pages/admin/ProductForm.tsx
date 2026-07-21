import { useState, type FormEvent, type ChangeEvent } from "react";
import { CATEGORIES, type Category, type ProductInput, type Product } from "../../types/product";
import { uploadImageToS3 } from "../../services/uploadService";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductInput) => void;
  isSubmitting?: boolean;
}

export function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [price, setPrice] = useState(initialData?.price ?? 0);
  const [stock, setStock] = useState(initialData?.stock ?? 0);
  const [category, setCategory] = useState<Category>(initialData?.category ?? CATEGORIES[0]);
  const [image, setImage] = useState(initialData?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const publicUrl = await uploadImageToS3(file);
      setImage(publicUrl);
    } catch {
      setUploadError("No se pudo subir la imagen. Intentá de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, price, stock, category, image });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nombre
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">
          Precio
        </label>
        <input
          id="price"
          type="number"
          min={0}
          step={0.01}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium mb-1">
          Stock
        </label>
        <input
          id="stock"
          type="number"
          min={0}
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Categoría
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="w-full border rounded px-3 py-2"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-1">
          Imagen
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploading}
          className="w-full border rounded px-3 py-2"
        />
        {uploading && (
          <p className="text-sm text-gray-500 mt-1">Subiendo imagen...</p>
        )}
        {uploadError && (
          <p className="text-sm text-red-600 mt-1">{uploadError}</p>
        )}
        {image && !uploading && (
          <img
            src={image}
            alt="preview"
            className="mt-2 w-32 h-32 object-cover rounded"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || uploading}
        className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {isSubmitting
          ? "Guardando..."
          : initialData
          ? "Actualizar producto"
          : "Crear producto"}
      </button>
    </form>
  );
}