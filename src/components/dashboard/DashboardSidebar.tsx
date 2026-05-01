"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { CreditCard, FileSearch, LayoutDashboard, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useUser } from "@/hooks/queries/useUser";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";

export function DashboardSidebar() {
    const pathname = usePathname();

    const { data: userData } = useUser();
    const credits = userData?.user?.credits;
    const isSubscribed = userData?.user?.isSubscribed;
    const pricing = userData?.user?.pricing;

    const safeCredits = credits ?? 0;

    const maxPricing =
        pricing === "FREE" ? 2 : pricing === "RECOMMENDED" ? 10 : 100;

    const progressValue = Math.max(
        0,
        Math.min((safeCredits / maxPricing) * 100, 100),
    );

    /* ---------------- ACTIVE HELPERS ---------------- */
    const isExactActive = (href: string) => pathname === href;

    const isSectionActive = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`);

    return (
        <Sidebar className="text-foreground border-r bg-card/80 backdrop-blur-xl border border-border shadow-md">
            {/* ---------------- HEADER ---------------- */}
            <SidebarHeader className="px-6 h-16 py-3 text-lg font-semibold bg-card/80 border-b flex items-center justify-center">
                <Link href="/">
                    <h1 className="text-2xl font-semibold">
                        resumify
                        <span className="text-green-600 text-xl font-bold">
                            .
                        </span>
                    </h1>
                </Link>
            </SidebarHeader>

            {/* ---------------- CONTENT ---------------- */}
            <SidebarContent className="p-3 bg-card/80">
                <SidebarMenu className="flex flex-col gap-3">
                    {/* ================= DASHBOARD ================= */}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className={clsx(
                                isExactActive("/dashboard") &&
                                    "bg-primary text-primary-foreground",
                            )}
                        >
                            <Link href="/dashboard">
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* ================= SUBSCRIPTIONS ================= */}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className={clsx(
                                isExactActive("/dashboard/subscriptions") &&
                                    "bg-primary text-primary-foreground",
                            )}
                        >
                            <Link href="/dashboard/subscriptions">
                                <CreditCard className="h-4 w-4" />
                                <span>Subscriptions</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* ================= PROFILE ================= */}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className={clsx(
                                isExactActive("/dashboard/profile") &&
                                    "bg-primary text-primary-foreground",
                            )}
                        >
                            <Link href="/dashboard/profile">
                                <User2 className="h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* ================= WORKSPACE ================= */}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className={clsx(
                                isExactActive("/dashboard/ai-report") &&
                                    "bg-primary text-primary-foreground",
                            )}
                        >
                            <Link href="/dashboard/ai-report">
                                <FileSearch className="h-4 w-4" />
                                <span>AI Report</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            {/* ---------------- FOOTER ---------------- */}
            <SidebarFooter className="p-4 text-xs text-muted-foreground border-t bg-card/80">
                <div className="p-3 border rounded-xl space-y-3 bg-secondary">
                    <h2 className="flex items-center justify-between">
                        Remaining Credits
                        <span className="font-bold">
                            {safeCredits}/{maxPricing}
                        </span>
                    </h2>

                    <Progress value={progressValue} />

                    {!isSubscribed && (
                        <Link
                            href="/dashboard/subscriptions"
                            className="w-full"
                        >
                            <Button className="w-full">
                                Subscribe to get more credits
                            </Button>
                        </Link>
                    )}
                </div>
                © Resumify
            </SidebarFooter>
        </Sidebar>
    );
}
