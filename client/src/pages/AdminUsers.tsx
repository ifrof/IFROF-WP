import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Search, Shield, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";

export default function AdminUsers() {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");

  const {
    data: users,
    isLoading,
    refetch,
  } = trpc.admin.getUsers.useQuery({ search });

  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success(
        language === "ar" ? "تم تحديث صلاحيات المستخدم" : "User role updated"
      );
      refetch();
    },
  });

  const handleRoleChange = (userId: number, newRole: any) => {
    updateRoleMutation.mutate({ id: userId, role: newRole });
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === "ar" ? "إدارة المستخدمين" : "User Management"}
          </h1>
          <p className="text-muted-foreground">
            {language === "ar"
              ? "إدارة صلاحيات المستخدمين ومراقبة النشاط"
              : "Manage user roles and monitor activity"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={
                  language === "ar"
                    ? "بحث عن مستخدم بالاسم أو البريد..."
                    : "Search users by name or email..."
                }
                className="pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#1e3a5f]" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {language === "ar" ? "المستخدم" : "User"}
                    </TableHead>
                    <TableHead>
                      {language === "ar" ? "البريد الإلكتروني" : "Email"}
                    </TableHead>
                    <TableHead>
                      {language === "ar" ? "الدور" : "Role"}
                    </TableHead>
                    <TableHead>
                      {language === "ar" ? "تاريخ الانضمام" : "Joined"}
                    </TableHead>
                    <TableHead className="text-right">
                      {language === "ar" ? "تغيير الدور" : "Change Role"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium">
                            {user.name || "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                          className={
                            user.role === "admin" ? "bg-purple-600" : ""
                          }
                        >
                          {user.role === "admin" && (
                            <Shield className="w-3 h-3 mr-1" />
                          )}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          defaultValue={user.role}
                          onValueChange={val => handleRoleChange(user.id, val)}
                        >
                          <SelectTrigger className="h-8 w-[120px] ml-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="buyer">Buyer</SelectItem>
                            <SelectItem value="factory">Factory</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users?.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-muted-foreground"
                      >
                        No users found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
