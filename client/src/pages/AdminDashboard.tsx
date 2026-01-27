import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminStats {
  totalUsers: number;
  totalFactories: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVerifications: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalFactories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground">Factories</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalFactories}</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground">Orders</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground">Revenue</h3>
                <p className="text-3xl font-bold mt-2">${stats.totalRevenue}</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
                <p className="text-3xl font-bold mt-2">{stats.pendingVerifications}</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">Verify Factories</Button>
                  <Button className="w-full" variant="outline">Manage Users</Button>
                  <Button className="w-full" variant="outline">View Orders</Button>
                  <Button className="w-full" variant="outline">Analytics</Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">System Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Database</span>
                    <span className="text-green-600">✓ Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>API</span>
                    <span className="text-green-600">✓ Running</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cache</span>
                    <span className="text-green-600">✓ Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Email Service</span>
                    <span className="text-green-600">✓ Ready</span>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
