import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import type { Order, OrderStatus } from "../../types/order";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  processing: "En proceso",
  completed: "Completada",
  cancelled: "Cancelada",
};

const STATUS_OPTIONS: OrderStatus[] = ["pending", "processing", "completed", "cancelled"];

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch {
      setError("No se pudieron cargar las órdenes");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      setError("No se pudo actualizar el estado");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredOrders =
    filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  if (loading) return <p className="p-4">Cargando órdenes...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-bold">Órdenes ({filteredOrders.length})</h1>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as OrderStatus | "all")}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="all">Todos los estados</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500">No hay órdenes con ese estado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-2">ID</th>
                <th className="py-2 pr-2">Fecha</th>
                <th className="py-2 pr-2">Usuario</th>
                <th className="py-2 pr-2">Total</th>
                <th className="py-2 pr-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-2 pr-2">{order.id.slice(0, 8)}</td>
                  <td className="py-2 pr-2">
                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                  </td>
                  <td className="py-2 pr-2">{order.userId.slice(0, 8)}</td>
                  <td className="py-2 pr-2">${order.total.toFixed(2)}</td>
                  <td className="py-2 pr-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      disabled={updatingId === order.id}
                      className="border rounded px-2 py-1 text-sm disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
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