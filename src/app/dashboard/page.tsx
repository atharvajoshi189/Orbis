"use client";

import Navbar from "@/components/Navbar";
import { TrendingUp, Compass, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

export default function DashboardPage() {
    const { user } = useAppStore();

    return (
        <div className="min-h-screen font-sans transition-colors duration-300">
            <Navbar />

            <div className="container-custom mx-auto py-20 px-4">
                {/* Welcome Section */}
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-4">
                        Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
                        Your mission control for academic success. Track your ROI and navigate your path effectively.
                    </p>
                </div>

                {/* Core Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* ROI Module Card */}
                    <Link href="/roi" className="group relative overflow-hidden rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-green-100 dark:bg-green-500/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                                <TrendingUp size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">ROI Analytics</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Analyze the return on investment for your education. Track debt repayment, projecting earnings, and financial freedom.
                            </p>
                            <span className="inline-flex items-center gap-2 font-bold text-green-600 dark:text-green-400 group-hover:gap-4 transition-all">
                                Open ROI Tracker <ArrowRight size={18} />
                            </span>
                        </div>
                    </Link>

                    {/* Guidance Module Card */}
                    <Link href="/guidance" className="group relative overflow-hidden rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Compass size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                                <Compass size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Guidance System</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Get personalized AI-driven advice for your academic journey, visa processes, and university selection.
                            </p>
                            <span className="inline-flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 group-hover:gap-4 transition-all">
                                Launch Guidance <ArrowRight size={18} />
                            </span>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
}
