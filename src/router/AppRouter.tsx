import { Routes, Route } from "react-router-dom";
import { ProductList } from "../pages/ProductList";
import { ProductDetail } from "../pages/ProductDetail";
// import { NewProduct } from "../pages/admin/NewProduct";
// import { EditProduct } from "../pages/admin/EditProduct";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/products" element={<ProductList />} />
      {<Route path="/products/:id" element={<ProductDetail />} />}
      {/* <Route path="/admin/products/new" element={<NewProduct />} /> */}
      {/* <Route path="/admin/products/:id/edit" element={<EditProduct />} /> */}
    </Routes>
  );
}