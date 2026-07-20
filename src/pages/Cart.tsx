import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export function Cart() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
        <Link to="/products" className="text-blue-600 underline">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Tu carrito</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-3 border-b pb-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="font-medium text-sm">{item.name}</h3>
              <p className="text-sm text-gray-600">${item.price}</p>

              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="border rounded w-7 h-7 flex items-center justify-center"
                  aria-label="Restar cantidad"
                >
                  -
                </button>

                <span className="w-6 text-center">{item.quantity}</span>

                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="border rounded w-7 h-7 flex items-center justify-center disabled:opacity-40"
                  aria-label="Sumar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-xs text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={clearCart}
          className="text-sm text-gray-500 hover:underline"
        >
          Vaciar carrito
        </button>
        <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="mt-4 w-full bg-blue-600 text-white rounded px-6 py-3 hover:bg-blue-700 transition"
      >
        Continuar con la compra
      </button>
    </div>
  );
}