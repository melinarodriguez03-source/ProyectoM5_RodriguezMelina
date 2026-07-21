import { useState, type FormEvent } from "react";
import { CATEGORIES, type Category, type ProductInput, type Product } from "../../types/product";

interface ProductFormProps {
  initialData?: Product;             // si viene, es edición; si no, es creación
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
       onChange={(e) => {
       const file = e.target.files?.[0];
       if (file) {
      // Preview temporal en el navegador. Se reemplaza por la URL real de S3
      // cuando conectemos el flujo de Presigned URL.
      setImage(URL.createObjectURL(file));
       }
       }}
       className="w-full border rounded px-3 py-2"
       />
        {image && (
          <img src={image} alt="preview" className="mt-2 w-32 h-32 object-cover rounded" />
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {isSubmitting ? "Guardando..." : initialData ? "Actualizar producto" : "Crear producto"}
      </button>
    </form>
  );
}