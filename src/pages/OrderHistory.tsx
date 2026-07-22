import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrdersByUser } from "../services/orderService";
import { useAuth } from "../hooks/useAuth";
import type { Order, OrderStatus } from "../types/order";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  processing: "En proceso",
  completed: "Completada",
  cancelled: "Cancelada",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchOrders() {
      try {
        const data = await getOrdersByUser(user!.uid);
        setOrders(data);
      } catch (err) {
  console.error("Error real:", err);
  setError("No se pudieron cargar tus órdenes.");
} finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="p-4 max-w-2xl mx-auto flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse border rounded p-4">
            <div className="bg-gray-200 h-4 w-1/3 rounded mb-2" />
            <div className="bg-gray-200 h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p className="p-4 text-red-600">{error}</p>;

  if (orders.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 mb-4">Todavía no hiciste ninguna compra.</p>
        <Link to="/products" className="text-blue-600 underline">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Mis órdenes</h1>

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="border rounded p-4 hover:shadow-md transition flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="font-medium">${order.total.toFixed(2)}</p>
              <p className="text-xs text-gray-400">
                {order.items.length} producto(s)
              </p>
            </div>

            <span
              className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}
            >
              {STATUS_LABELS[order.status]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}