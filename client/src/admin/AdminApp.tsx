import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminApp() {
  const [stats, setStats] = useState({ users: 0, factories: 0, orders: 0 });

  useEffect(() => {
    // Fetch admin stats
    fetch("/api/admin/dashboard")
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-3xl font-bold">{stats.users}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Factories</h2>
          <p className="text-3xl font-bold">{stats.factories}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-3xl font-bold">{stats.orders}</p>
        </Card>
      </div>
    </div>
  );
}
