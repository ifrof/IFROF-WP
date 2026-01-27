import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import {
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Users,
  Factory,
  FileText,
  Settings,
  Home,
  ShieldCheck,
} from "lucide-react";
import { CSSProperties, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { useLanguage } from "@/contexts/LanguageContext";

const SIDEBAR_WIDTH_KEY = "admin-sidebar-width";
const DEFAULT_WIDTH = 260;

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });

  const { loading, user } = useAuth();
  const [, setLocation] = useLocation();

  // Always run effects at the top level
  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  // Use a single return for the loading state to keep hook order consistent
  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  // If not admin, don't render content but still maintain hook consistency by not returning early before hooks
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <SidebarProvider
      style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}
    >
      <AdminDashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </AdminDashboardLayoutContent>
    </SidebarProvider>
  );
}

function AdminDashboardLayoutContent({
  children,
  setSidebarWidth,
}: {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
}) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const { t, language } = useLanguage();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: language === "ar" ? "نظرة عامة" : "Overview",
      path: "/admin",
    },
    {
      icon: Users,
      label: language === "ar" ? "إدارة المستخدمين" : "Manage Users",
      path: "/admin/users",
    },
    {
      icon: Factory,
      label: language === "ar" ? "إدارة المصانع" : "Manage Factories",
      path: "/admin/factories",
    },
    {
      icon: FileText,
      label: language === "ar" ? "إدارة الطلبات" : "Manage Requests",
      path: "/admin/requests",
    },
    {
      icon: ShieldCheck,
      label: language === "ar" ? "الصلاحيات" : "Permissions",
      path: "/admin/permissions",
    },
    {
      icon: Settings,
      label: language === "ar" ? "إعدادات النظام" : "Settings",
      path: "/admin/settings",
    },
    { icon: Home, label: language === "ar" ? "الرئيسية" : "Home", path: "/" },
  ];

  const activeMenuItem = menuItems.find(item => location === item.path);

  return (
    <>
      <Sidebar collapsible="icon" className="border-r shadow-sm">
        <SidebarHeader className="h-16 justify-center border-b bg-slate-900 text-white">
          <div className="flex items-center gap-3 px-2 w-full">
            <button
              onClick={toggleSidebar}
              className="h-8 w-8 flex items-center justify-center hover:bg-slate-800 rounded-lg shrink-0"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
            {!isCollapsed && (
              <span className="font-bold truncate">IFROF Admin</span>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent className="gap-0 py-4">
          <SidebarMenu className="px-2 py-1">
            {menuItems.map(item => {
              const isActive = location === item.path;
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => setLocation(item.path)}
                    tooltip={item.label}
                    className={`h-11 mb-1 rounded-md ${isActive ? "bg-primary/10 text-primary" : "hover:bg-accent"}`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-3 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent/50 w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none">
                <Avatar className="h-9 w-9 border shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-semibold truncate">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-slate-50/50">
        {isMobile && (
          <div className="flex border-b h-14 items-center px-4 bg-background sticky top-0 z-40">
            <SidebarTrigger className="h-9 w-9 mr-2" />
            <span className="font-semibold">
              {activeMenuItem?.label ?? "Admin Panel"}
            </span>
          </div>
        )}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
      </SidebarInset>
    </>
  );
}
