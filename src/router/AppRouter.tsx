import { Routes, Route } from "react-router-dom";
import { Header } from "../components/Header";
import { ProtectedRoute } from "./ProtectedRoute";
import { ProductList } from "../pages/ProductList";
import { ProductDetail } from "../pages/ProductDetail";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
// import { Login } from "../pages/Login";
// import { Register } from "../pages/Register";
// import { NewProduct } from "../pages/admin/NewProduct";
// import { EditProduct } from "../pages/admin/EditProduct";

export function AppRouter() {
  return (
    <>
      <Header />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<ProductList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Rutas protegidas: cualquier usuario logueado (customer o admin) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          {/* <Route path="/orders" element={<OrderHistory />} /> */}
          {/* <Route path="/orders/:id" element={<OrderDetail />} /> */}
        </Route>

        {/* Rutas protegidas: solo admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          {/* <Route path="/admin/products/new" element={<NewProduct />} /> */}
          {/* <Route path="/admin/products/:id/edit" element={<EditProduct />} /> */}
          {/* <Route path="/admin/orders" element={<AdminOrders />} /> */}
        </Route>
      </Routes>
    </>
  );
}