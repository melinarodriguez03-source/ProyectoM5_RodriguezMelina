import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { createOrder } from "../services/orderService";

export function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!user) {
      setError("Tenés que iniciar sesión para completar la compra.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const orderId = await createOrder({
        userId: user.uid,
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
        <p style={{ color: "var(--text-muted)" }}>No hay nada para comprar.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="font-display text-xl font-bold mb-4" style={{ color: "var(--text)" }}>
        Confirmar compra
      </h1>

      <div className="flex flex-col gap-3 mb-6">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between text-sm border-b pb-2"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <p className="font-display text-lg font-bold mb-4" style={{ color: "var(--primary)" }}>
        Total: ${total.toFixed(2)}
      </p>

      {error && (
        <p className="text-sm mb-4" style={{ color: "var(--accent)" }}>
          {error}
        </p>
      )}

      <button
        onClick={handleConfirm}
        disabled={isProcessing}
        className="w-full rounded-xl px-6 py-3 text-white transition disabled:opacity-50"
        style={{ backgroundColor: "var(--primary)" }}
      >
        {isProcessing ? "Procesando..." : "Confirmar compra"}
      </button>
    </div>
  );
}