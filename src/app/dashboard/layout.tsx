import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <div className="pl-64">
                <Topbar />
                <main className="min-h-[calc(100vh-4rem)] pt-16 p-6">
                    <div className="container-custom py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
