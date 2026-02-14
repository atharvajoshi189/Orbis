import { Globe, GraduationCap, Github, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black py-16 transition-colors duration-300 relative z-10">
            <div className="container-custom mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Globe className="h-4 w-4 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                                ORBIS
                            </h2>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-muted-foreground leading-relaxed">
                            Empowering students to achieve global career success through AI-driven insights, financial planning, and strategic career mapping.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-primary/20 dark:hover:bg-primary/20 transition-colors text-slate-600 dark:text-slate-400 hover:text-primary">
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-primary/20 dark:hover:bg-primary/20 transition-colors text-slate-600 dark:text-slate-400 hover:text-primary">
                                <Github className="h-4 w-4" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-primary/20 dark:hover:bg-primary/20 transition-colors text-slate-600 dark:text-slate-400 hover:text-primary">
                                <Linkedin className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Resources</h3>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Career Intelligence Blog</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Global Study Guides</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">ROI Calculator</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">University Rankings 2026</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Platform</h3>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-muted-foreground">
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">User Dashboard</Link></li>
                            <li><Link href="/guidance" className="hover:text-primary transition-colors">Profile Analysis</Link></li>
                            <li><Link href="/career-path" className="hover:text-primary transition-colors">Career Roadmap</Link></li>
                            <li><Link href="/scholarships" className="hover:text-primary transition-colors">Scholarship Finder</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Support</h3>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact Expert</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Privacy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                    <p>&copy; 2026 Orbis Intelligence Systems. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <span>Powered by AI-Core v4.2</span>
                        <div className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span>Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

