import { Routes, Route } from "react-router-dom";
import { Header } from "../components/Header";
import { ProductList } from "../pages/ProductList";
import { ProductDetail } from "../pages/ProductDetail";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";


export function AppRouter() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        {<Route path="/cart" element={<Cart />} />}
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </>
  );
}