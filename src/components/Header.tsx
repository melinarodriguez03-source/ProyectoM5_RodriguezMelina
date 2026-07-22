import { Link } from "react-router-dom";
import { CartIcon } from "./CartIcon";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      <Link to="/" className="font-display font-bold text-lg" style={{ color: "var(--primary)" }}>
        Patagonix<span style={{ color: "var(--accent)" }}>.</span>
      </Link>

      <nav className="flex items-center gap-4 text-sm" style={{ color: "var(--text)" }}>
        <Link to="/products" className="hover:opacity-70">Productos</Link>

        {user?.role === "admin" && (
          <>
            <Link to="/admin/products" className="hover:opacity-70 font-medium" style={{ color: "var(--primary)" }}>
              Productos (Admin)
            </Link>
            <Link to="/admin/orders" className="hover:opacity-70 font-medium" style={{ color: "var(--primary)" }}>
              Órdenes (Admin)
            </Link>
          </>
        )}

        {user && (
          <Link to="/orders" className="hover:opacity-70">Mis órdenes</Link>
        )}

        {user ? (
          <button onClick={logout} className="hover:opacity-70">Salir</button>
        ) : (
          <Link to="/login" className="hover:opacity-70">Ingresar</Link>
        )}

        <button
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          className="w-9 h-9 rounded-full flex items-center justify-center border"
          style={{ borderColor: "var(--border)" }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <CartIcon />
      </nav>
    </header>
  );
}