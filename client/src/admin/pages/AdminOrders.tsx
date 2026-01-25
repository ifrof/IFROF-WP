import { useList } from "@refinedev/core";
import { AdminListTable } from "@/admin/components/AdminListTable";

export function AdminOrders() {
  const { data, isLoading } = useList({ resource: "orders" });
  const orders = data?.data ?? [];

  return (
    <AdminListTable
      title="Orders"
      subtitle="Track recent orders and fulfillment status."
      isLoading={isLoading}
      data={orders}
      columns={[
        { header: "ID", render: (order: any) => order.id },
        { header: "Buyer", render: (order: any) => order.buyerId },
        { header: "Status", render: (order: any) => order.status },
        { header: "Total", render: (order: any) => (order.totalAmount ? `$${order.totalAmount / 100}` : "—") },
        { header: "Created", render: (order: any) => new Date(order.createdAt).toLocaleDateString() },
      ]}
    />
  );
}
