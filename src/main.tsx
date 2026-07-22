import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { AppRouter } from "./router/AppRouter";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppRouter />
          </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);