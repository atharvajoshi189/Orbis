import { OrbisChat } from "@/components/OrbisChat";
import { Topbar } from "@/components/shared/Topbar";
import { Sidebar } from "@/components/shared/Sidebar";

export default function ChatPage() {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col pl-64 transition-all duration-300">
                <Topbar />
                <main className="flex-1 pt-16 relative">
                    <div className="absolute inset-0 p-4">
                        <OrbisChat />
                    </div>
                </main>
            </div>
        </div>
    );
}
