import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  UserPlus,
  MoreVertical,
  ShieldAlert,
  CheckCircle2,
  Ban,
  Trash2,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminUserManagement() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for skeleton
  const users = [
    {
      id: 1,
      name: "Ahmed Ali",
      email: "ahmed@example.com",
      role: "Buyer",
      status: "Active",
      joined: "2023-10-01",
    },
    {
      id: 2,
      name: "Zhejiang Tech",
      email: "info@zhejiang.cn",
      role: "Factory",
      status: "Pending",
      joined: "2023-10-05",
    },
    {
      id: 3,
      name: "John Smith",
      email: "john@global.com",
      role: "Buyer",
      status: "Blocked",
      joined: "2023-09-20",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {language === "ar" ? "إدارة المستخدمين" : "User Management"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar"
                ? "إدارة جميع المستخدمين والمصانع في المنصة."
                : "Manage all users and factories on the platform."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              {language === "ar" ? "تصدير" : "Export"}
            </Button>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              {language === "ar" ? "إضافة مستخدم" : "Add User"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                language === "ar"
                  ? "بحث بالاسم أو البريد..."
                  : "Search by name or email..."
              }
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              {language === "ar" ? "كل الأدوار" : "All Roles"}
            </Button>
            <Button variant="secondary">
              {language === "ar" ? "كل الحالات" : "All Status"}
            </Button>
          </div>
        </div>

        <div className="border rounded-xl bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === "ar" ? "المستخدم" : "User"}</TableHead>
                <TableHead>{language === "ar" ? "الدور" : "Role"}</TableHead>
                <TableHead>{language === "ar" ? "الحالة" : "Status"}</TableHead>
                <TableHead>
                  {language === "ar" ? "تاريخ الانضمام" : "Joined"}
                </TableHead>
                <TableHead className="text-right">
                  {language === "ar" ? "إجراءات" : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Active"
                          ? "default"
                          : user.status === "Pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {user.joined}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                          {language === "ar" ? "تفعيل" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Ban className="w-4 h-4 mr-2 text-orange-500" />
                          {language === "ar" ? "حظر" : "Block"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          {language === "ar" ? "حذف" : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Bulk Actions Bar (Skeleton) */}
        <div className="bg-muted/50 p-4 rounded-lg flex items-center justify-between border border-dashed">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {language === "ar" ? "إجراءات جماعية:" : "Bulk Actions:"}
            </span>
            <Button size="sm" variant="outline">
              {language === "ar" ? "تفعيل المختار" : "Activate Selected"}
            </Button>
            <Button size="sm" variant="outline" className="text-destructive">
              {language === "ar" ? "حذف المختار" : "Delete Selected"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground italic">
            {language === "ar"
              ? "اختر مستخدمين لتفعيل الإجراءات الجماعية"
              : "Select users to enable bulk actions"}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
