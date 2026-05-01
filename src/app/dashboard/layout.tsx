import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export const metadata: Metadata = {
    title: {
        default: "Resumify Dashboard | Resumify",
        template: "%s | Dashboard | Resumify",
    },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <SidebarProvider>
            <DashboardSidebar />

            <div className="w-full">
                <DashboardHeader />
                <main className="p-4 md:p-6">{children}</main>
            </div>
        </SidebarProvider>
    );
}
