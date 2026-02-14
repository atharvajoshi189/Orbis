"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/universities", label: "Universities" },
    { href: "/scholarships", label: "Scholarships" },
    { href: "/roi", label: "ROI Calculator" },
    { href: "/contact", label: "Contact" },
]

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm transition-all duration-300">
            <div className="container-custom mx-auto h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <h1 className="text-2xl font-bold text-[#1A73E8] tracking-tight">Orbis</h1>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`
                        text-sm font-medium text-gray-600 hover:text-[#1A73E8] transition-colors relative group py-2
                        ${pathname === link.href ? 'text-[#1A73E8]' : ''}
                    `}
                        >
                            {link.label}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1A73E8] transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <button className="text-sm font-medium text-[#1A73E8] hover:text-blue-800 transition-colors">
                        Sign In
                    </button>
                    <button className="px-6 py-2.5 bg-[#1A73E8] text-white text-sm font-bold rounded-full hover:bg-blue-700 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                        Get Started
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm p-4 space-y-4 shadow-lg transition-transform">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="block text-sm font-medium text-gray-600 hover:text-[#1A73E8]">{link.label}</Link>
                    ))}
                    <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                        <button className="w-full text-center text-sm font-medium text-[#1A73E8]">Sign In</button>
                        <button className="w-full bg-[#1A73E8] text-white py-3 rounded-full font-bold">Get Started</button>
                    </div>
                </div>
            )}
        </nav>
    );
}
