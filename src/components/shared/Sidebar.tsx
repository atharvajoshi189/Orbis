"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Globe,
    LogOut,
    TrendingUp,
    Compass,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "ROI", href: "/roi", icon: TrendingUp },
    { name: "Guidance", href: "/guidance", icon: Compass },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl transition-transform">
            <div className="flex h-full flex-col px-3 py-4">
                <div className="mb-8 flex items-center px-4">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr from-primary to-purple-600 shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                        <Globe className="h-6 w-6 text-white" />
                    </div>
                    <span className="self-center whitespace-nowrap text-2xl font-bold tracking-wider text-white">
                        ORBIS
                    </span>
                </div>

                <div className="mb-6 px-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary">
                            <AvatarImage src="/avatar-placeholder.png" />
                            <AvatarFallback>OP</AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="text-sm font-bold text-white">Operator</h4>
                            <span className="text-xs text-primary">Lvl 5 Strategist</span>
                        </div>
                    </div>
                </div>

                <ul className="flex-1 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-[inset_0_0_10px_rgba(0,243,255,0.1)] border-r-2 border-primary"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "mr-3 h-5 w-5 transition-colors",
                                            isActive ? "text-primary drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" : "group-hover:text-white"
                                        )}
                                    />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-auto px-4 pb-4">
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20">
                        <LogOut className="h-4 w-4" />
                        <span>Abort Mission</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
