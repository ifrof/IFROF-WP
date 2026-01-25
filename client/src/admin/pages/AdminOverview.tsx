import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export function AdminOverview() {
  const statsQuery = trpc.admin.getStats.useQuery();

  if (statsQuery.isLoading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading admin overview
      </div>
    );
  }

  const stats = statsQuery.data?.stats;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Admin Overview</h2>
        <p className="text-sm text-slate-500">Key metrics across the marketplace.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Products" value={stats?.products ?? 0} />
        <StatCard label="Orders" value={stats?.orders ?? 0} />
        <StatCard label="Users" value={stats?.users ?? 0} />
        <StatCard label="Revenue" value={`$${(stats?.revenue ?? 0).toLocaleString()}`} />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <p className="mt-1 text-sm text-slate-500">
          Keep an eye on the newest orders and inquiries from the dashboard widgets.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
