"use client";

import { Home, LayoutGrid, TrendingUp, Compass, Menu, User, LogIn, Globe, Sun, Moon, Map } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Translate from "./Translate";
import LanguageToggle from "./LanguageToggle";

const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/career-path", label: "Career Path", icon: Map },
    { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/roi", label: "ROI", icon: TrendingUp },
    { href: "/guidance", label: "Guidance", icon: Compass },
]

export default function Navbar() {
    // ... existing hooks ...


    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, theme, toggleTheme } = useAppStore();
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll for glass effect intensity or minimizing
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Desktop Floating Pill Navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-4">
                <nav className={cn(
                    "flex items-center gap-2 p-2 px-6 rounded-full border transition-all duration-300 shadow-xl min-w-[600px] justify-between",
                    theme === 'dark'
                        ? "bg-black/60 border-white/10 backdrop-blur-2xl shadow-purple-500/10"
                        : "bg-white/40 border-white/50 backdrop-blur-2xl shadow-emerald-500/10 supports-[backdrop-filter]:bg-white/30"
                )}>
                    {/* Brand / Logo */}
                    <Link href="/" className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                            <Globe className="w-5 h-5" />
                        </div>
                    </Link>

                    <div className="w-px h-6 bg-border mx-1" />

                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "relative px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300 whitespace-nowrap",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-active"
                                        className={cn(
                                            "absolute inset-0 rounded-full shadow-sm",
                                            theme === 'dark' ? "bg-white/10" : "bg-white"
                                        )}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <link.icon className="w-4 h-4" />
                                    <Translate text={link.label} />
                                </span>
                            </Link>
                        );
                    })}

                    <div className="w-px h-6 bg-border mx-2" />

                    {/* Right Actions: Theme Toggle & Profile */}
                    <div className="flex items-center gap-2">
                        <LanguageToggle />
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
                        </button>

                        {user ? (
                            <Link href="/profile" className="relative group ml-1">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <span>{user.name.charAt(0)}</span>
                                    )}
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2 ml-1">
                                <Link href="/login" className={cn(
                                    "px-4 py-2 rounded-full font-medium text-sm transition-all text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/10 whitespace-nowrap"
                                )}>
                                    <Translate text="Log In" />
                                </Link>
                                <Link href="/signup" className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap",
                                    "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20"
                                )}>
                                    <span><Translate text="Get Started" /></span>
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
                <nav className={cn(
                    "flex items-center justify-around p-4 rounded-2xl border backdrop-blur-xl shadow-2xl",
                    theme === 'dark' ? "bg-black/90 border-white/10" : "bg-white/95 border-slate-200"
                )}>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <link.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                                {/* <span className="text-[10px] font-medium">{link.label}</span> */}
                            </Link>
                        );
                    })}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-indigo-500" />}
                    </button>

                    <LanguageToggle direction="up" />

                    {user ? (
                        <Link href="/profile">
                            <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                {user.name.charAt(0)}
                            </div>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <User className="w-6 h-6 text-muted-foreground" />
                        </Link>
                    )}
                </nav>
            </div>
        </>
    );
}
