import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

const navItems = [
  { label: "Overview", to: "/" },
  { label: "Users", to: "/users" },
  { label: "Products", to: "/products" },
  { label: "Orders", to: "/orders" },
  { label: "Factories", to: "/factories" },
];

export function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-white p-6">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</p>
            <h1 className="text-xl font-semibold">IFROF Console</h1>
          </div>
          <nav className="space-y-2">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="text-slate-500">Signed in as</p>
            <p className="font-medium text-slate-800">{user.name ?? user.email}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
