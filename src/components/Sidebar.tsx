"use client";

import { Orbit, Bot, TrendingUp, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Orbis Orbit", icon: Orbit, href: "/" },
    { name: "AI Counselor", icon: Bot, href: "/counselor" },
    { name: "ROI Analytics", icon: TrendingUp, href: "/roi" },
    { name: "Visa Vault", icon: Lock, href: "/documents" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-20 md:w-64 h-full flex flex-col items-center md:items-start py-8 px-4 glass border-r border-white/10 z-50 flex-shrink-0 transition-opacity duration-300">
            <div className="mb-12 w-full flex justify-center md:justify-start md:px-4">
                {/* Logo Text with Neon Effect */}
                <h1 className="hidden md:block text-2xl font-bold font-mono tracking-[0.2em] text-white relative">
                    ORBIS
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-neon-cyan to-transparent animate-pulse-slow" />
                </h1>
                {/* Mobile Logo */}
                <div className="md:hidden w-8 h-8 rounded-full border border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_rgba(0,245,255,0.5)] flex items-center justify-center">
                    <div className="w-3 h-3 bg-neon-cyan rounded-full animate-ping" />
                </div>
            </div>

            <nav className="flex-1 w-full space-y-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group hover:bg-white/5 border border-transparent",
                                isActive
                                    ? "bg-white/5 border-l-2 border-l-neon-cyan shadow-[inset_10px_0_20px_-10px_rgba(0,245,255,0.1)]"
                                    : "hover:border-white/5"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-5 h-5 transition-transform group-hover:scale-110",
                                    isActive ? "text-neon-cyan drop-shadow-[0_0_4px_rgba(0,245,255,0.8)]" : "text-gray-500 group-hover:text-gold"
                                )}
                            />
                            <span className={cn(
                                "hidden md:block font-medium text-xs uppercase tracking-wider font-mono",
                                isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto w-full px-4">
                <div className="orbis-card p-3 flex items-center gap-3 cursor-pointer group hover:border-gold/30 transition-colors">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-gold to-orange-600 flex items-center justify-center text-[10px] font-bold text-black font-mono">
                        ATH
                    </div>
                    <div className="hidden md:block overflow-hidden">
                        <p className="text-xs font-bold text-white group-hover:text-gold transition-colors truncate font-mono">ATHARVA</p>
                        <p className="text-[9px] text-gray-500 font-mono tracking-wide">STATUS: ONLINE</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
