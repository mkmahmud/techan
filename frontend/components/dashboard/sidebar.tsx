"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, History, LayoutDashboard, LogOut, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLogout } from "@/modules/auth";

interface SidebarProps {
    role: "ADMIN" | "USER";
}

type NavItem = {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    roles: Array<"ADMIN" | "USER">;
};

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const logoutMutation = useLogout();

    const routes: NavItem[] = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            roles: ["ADMIN", "USER"],
        },
        {
            label: "Tasks",
            icon: ClipboardList,
            href: "/dashboard/tasks",
            roles: ["ADMIN", "USER"],
        },
        {
            label: "Audit Logs",
            icon: History,
            href: "/dashboard/audit_logs",
            roles: ["ADMIN"],
        },
        {
            label: "Manage Users",
            icon: Users,
            href: "/admin/users",
            roles: ["ADMIN"],
        },
    ];

    return (
        <div className="flex h-full w-full flex-col bg-accent text-card-foreground">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center">
                    <h1 className="text-xl font-bold tracking-tight text-primary">TechAn</h1>
                </Link>
                <p className="mt-1 text-xs   text-muted-foreground">
                    {role === "ADMIN" ? "Admin panel" : "User panel"}
                </p>
            </div>
            <ScrollArea className="flex-1 px-3">
                <div className="space-y-1">
                    {routes
                        .filter((route) => route.roles.includes(role))
                        .map((route) => (
                            <Link key={route.href} href={route.href} className="cursor-pointer">
                                <Button
                                    variant={pathname === route.href ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3 cursor-pointer",
                                        pathname === route.href && "bg-muted"
                                    )}
                                >
                                    <route.icon className="h-5 w-5" />
                                    {route.label}
                                </Button>
                            </Link>
                        ))}
                </div>
            </ScrollArea>
            <div className="mt-auto p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                >
                    <LogOut className="h-5 w-5" />
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
            </div>
        </div>
    );
}