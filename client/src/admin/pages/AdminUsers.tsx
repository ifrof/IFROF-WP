import { useList } from "@refinedev/core";
import { AdminListTable } from "@/admin/components/AdminListTable";

export function AdminUsers() {
  const { data, isLoading } = useList({ resource: "users" });
  const users = data?.data ?? [];

  return (
    <AdminListTable
      title="Users"
      subtitle="Review registered buyers, factories, and admins."
      isLoading={isLoading}
      data={users}
      columns={[
        { header: "ID", render: (user: any) => user.id },
        { header: "Name", render: (user: any) => user.name ?? "—" },
        { header: "Email", render: (user: any) => user.email },
        { header: "Role", render: (user: any) => user.role },
        { header: "Verified", render: (user: any) => (user.emailVerified ? "Yes" : "No") },
      ]}
    />
  );
}
