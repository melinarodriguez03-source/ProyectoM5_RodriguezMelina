import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { createOrder } from "../services/orderService";

export function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: reemplazar por el userId real cuando armemos AuthContext (useAuth().user.uid)
  const userId = "TEMP_USER_ID";

  const handleConfirm = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      // Simulación de pago (sin pasarela real)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const orderId = await createOrder({
        userId,
        items,
        total,
        status: "pending",
      });

      clearCart();
      navigate(`/orders/${orderId}`);
    } catch {
      setError("No se pudo procesar la compra. Intentá de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No hay nada para comprar.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Confirmar compra</h1>

      <div className="flex flex-col gap-3 mb-6">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm border-b pb-2">
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <p className="text-lg font-bold mb-4">Total: ${total.toFixed(2)}</p>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={isProcessing}
        className="w-full bg-blue-600 text-white rounded px-6 py-3 hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isProcessing ? "Procesando..." : "Confirmar compra"}
      </button>
    </div>
  );
}