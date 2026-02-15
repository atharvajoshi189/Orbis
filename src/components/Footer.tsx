
"use client";

import Link from "next/link";
import { Globe, ShieldCheck, Mail, Twitter, Linkedin, Github, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Translate from "./Translate";

export default function Footer() {
    return (
        <footer className="relative bg-slate-950 text-slate-300 py-20 overflow-hidden border-t border-slate-900">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

            <div className="container-custom mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                                <Globe className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Orbis
                            </span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                            <Translate text="AI-powered Career & Financial Intelligence. Analyzing risks, ROI, and global opportunities for the next generation of students." />
                        </p>
                        <div className="flex gap-4">
                            <SocialLink icon={Twitter} href="#" />
                            <SocialLink icon={Linkedin} href="#" />
                            <SocialLink icon={Github} href="#" />
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-bold text-white mb-6"><Translate text="Platform" /></h4>
                        <ul className="space-y-3 text-sm">
                            <FooterLink href="/career-path"><Translate text="Career Path Engine" /></FooterLink>
                            <FooterLink href="/guidance"><Translate text="Document Analysis" /></FooterLink>
                            <FooterLink href="/market"><Translate text="Global Heatmap" /></FooterLink>
                            <FooterLink href="/roi"><Translate text="ROI Calculator" /></FooterLink>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-bold text-white mb-6"><Translate text="Resources" /></h4>
                        <ul className="space-y-3 text-sm">
                            <FooterLink href="/blog"><Translate text="Success Stories" /></FooterLink>
                            <FooterLink href="/visa"><Translate text="Visa Guides" /></FooterLink>
                            <FooterLink href="/universities"><Translate text="University Database" /></FooterLink>
                            <FooterLink href="/api"><Translate text="Developers API" /></FooterLink>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 className="font-bold text-white mb-6"><Translate text="Stay Updated" /></h4>
                        <p className="text-slate-500 text-sm mb-4"><Translate text="Get the latest global education trends directly to your inbox." /></p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white w-full focus:ring-1 focus:ring-cyan-500 outline-none"
                            />
                            <button className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg transition-colors">
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 mt-6 text-xs text-slate-500">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span><Translate text="Bank-grade security & privacy." /></span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                    <p>© 2026 Orbis Intelligence. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon: Icon, href }: { icon: any, href: string }) {
    return (
        <Link href={href} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all hover:scale-110">
            <Icon className="w-4 h-4" />
        </Link>
    )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-slate-400 hover:text-cyan-400 transition-colors block w-fit hover:translate-x-1 duration-300">
                {children}
            </Link>
        </li>
    )
}
