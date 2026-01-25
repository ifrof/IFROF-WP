import { useList } from "@refinedev/core";
import { AdminListTable } from "@/admin/components/AdminListTable";

export function AdminFactories() {
  const { data, isLoading } = useList({ resource: "factories" });
  const factories = data?.data ?? [];

  return (
    <AdminListTable
      title="Factories"
      subtitle="Review factory onboarding and verification status."
      isLoading={isLoading}
      data={factories}
      columns={[
        { header: "ID", render: (factory: any) => factory.id },
        { header: "Name", render: (factory: any) => factory.name ?? "—" },
        { header: "Location", render: (factory: any) => factory.location ?? "—" },
        { header: "Status", render: (factory: any) => factory.verificationStatus },
        { header: "Rating", render: (factory: any) => factory.rating ?? "—" },
      ]}
    />
  );
}
