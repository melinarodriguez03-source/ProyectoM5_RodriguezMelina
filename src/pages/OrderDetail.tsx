import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import type { Order, OrderStatus } from "../types/order";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  processing: "En proceso",
  completed: "Completada",
  cancelled: "Cancelada",
};

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchOrder() {
      try {
        const data = await getOrderById(id!);
        if (!data) {
          setError("Orden no encontrada");
          return;
        }
        setOrder(data);
      } catch {
        setError("No se pudo cargar la orden");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  if (loading) return <p className="p-4">Cargando orden...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!order) return null;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Link to="/orders" className="text-sm text-blue-600 underline">
        ← Volver a mis órdenes
      </Link>

      <h1 className="text-xl font-bold mt-2">Orden #{order.id.slice(0, 8)}</h1>
      <p className="text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleString("es-AR")}
      </p>
      <p className="mt-1 text-sm font-medium">
        Estado: {STATUS_LABELS[order.status]}
      </p>

      <div className="flex flex-col gap-3 mt-4">
        {order.items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm border-b pb-2">
            <div className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
              <span>
                {item.name} x{item.quantity}
              </span>
            </div>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <p className="text-lg font-bold mt-4">Total: ${order.total.toFixed(2)}</p>
    </div>
  );
}