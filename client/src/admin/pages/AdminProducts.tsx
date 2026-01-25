import { useList } from "@refinedev/core";
import { AdminListTable } from "@/admin/components/AdminListTable";

export function AdminProducts() {
  const { data, isLoading } = useList({ resource: "products" });
  const products = data?.data ?? [];

  return (
    <AdminListTable
      title="Products"
      subtitle="Monitor catalog items managed by factories."
      isLoading={isLoading}
      data={products}
      columns={[
        { header: "ID", render: (product: any) => product.id },
        { header: "Name", render: (product: any) => product.name ?? product.nameEn ?? product.nameAr ?? "—" },
        { header: "Category", render: (product: any) => product.category ?? "—" },
        { header: "Price", render: (product: any) => (product.basePrice ? `$${product.basePrice}` : "—") },
        { header: "Active", render: (product: any) => (product.active ? "Yes" : "No") },
      ]}
    />
  );
}
