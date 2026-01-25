import { Refine } from "@refinedev/core";
import { routerProvider } from "@refinedev/react-router-v6";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { adminDataProvider } from "@/admin/dataProvider";
import { AdminLayout } from "@/admin/AdminLayout";
import { AdminOverview } from "@/admin/pages/AdminOverview";
import { AdminUsers } from "@/admin/pages/AdminUsers";
import { AdminProducts } from "@/admin/pages/AdminProducts";
import { AdminOrders } from "@/admin/pages/AdminOrders";
import { AdminFactories } from "@/admin/pages/AdminFactories";

export default function AdminApp() {
  return (
    <BrowserRouter basename="/admin">
      <Refine
        routerProvider={routerProvider}
        dataProvider={adminDataProvider}
        resources={[
          { name: "dashboard", list: "/" },
          { name: "users", list: "/users" },
          { name: "products", list: "/products" },
          { name: "orders", list: "/orders" },
          { name: "factories", list: "/factories" },
        ]}
        options={{ syncWithLocation: true }}
      >
        <Routes>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="factories" element={<AdminFactories />} />
          </Route>
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}
