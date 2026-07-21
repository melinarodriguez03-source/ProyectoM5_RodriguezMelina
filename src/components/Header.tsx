import { Link } from "react-router-dom";
import { CartIcon } from "./CartIcon";
import { useAuth } from "../hooks/useAuth";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
      <Link to="/" className="font-bold text-lg">
        Patagonix Tech
      </Link>

      <nav className="flex items-center gap-4 text-sm">
        <Link to="/products" className="hover:underline">
          Productos
        </Link>

       {user?.role === "admin" && (
        <>
       <Link to="/admin/products" className="hover:underline font-medium text-blue-600">
        Productos (Admin)
       </Link>
        <Link to="/admin/orders" className="hover:underline font-medium text-blue-600">
        Órdenes (Admin)
       </Link>
      </>
      )}

        {user && (
          <Link to="/orders" className="hover:underline">
            Mis órdenes
          </Link>
        )}

        {user ? (
          <button onClick={logout} className="hover:underline">
            Salir
          </button>
        ) : (
          <Link to="/login" className="hover:underline">
            Ingresar
          </Link>
        )}

        <CartIcon />
      </nav>
    </header>
  );
}