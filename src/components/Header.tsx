import { Link } from "react-router-dom";
import { CartIcon } from "./CartIcon";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
      <Link to="/" className="font-bold text-lg">
        Patagonix Tech
      </Link>

      <nav className="flex items-center gap-4">
        <Link to="/products" className="text-sm hover:underline">
          Productos
        </Link>
        <CartIcon />
      </nav>
    </header>
  );
}