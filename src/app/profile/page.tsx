"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useAppStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft, Download, Shield, Trophy, Target, Zap, Activity } from "lucide-react";
import { motion } from "framer-motion";

const statsData = [
    { subject: 'CGPA', A: 120, fullMark: 150 },
    { subject: 'Skills', A: 98, fullMark: 150 },
    { subject: 'Exp', A: 86, fullMark: 150 },
    { subject: 'Extra', A: 99, fullMark: 150 },
    { subject: 'Logic', A: 85, fullMark: 150 },
    { subject: 'Comm', A: 65, fullMark: 150 },
];

export default function ProfilePage() {
    const { user } = useAppStore();

    // Get initials
    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "OP";

    const handleDownloadCV = () => {
        // Placeholder for CV generation logic
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
            <Navbar />

            <div className="container-custom mx-auto pt-24 pb-12 px-4">

                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors gap-2 text-sm font-bold uppercase tracking-wider">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* LEFT SIDEBAR: OPERATIVE ID */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <Card className="bg-black/40 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)] relative overflow-hidden backdrop-blur-xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />

                            <CardHeader className="text-center pb-6 pt-8">
                                <div className="relative mx-auto mb-6 h-32 w-32 group">
                                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/50 border-dashed animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-20" />
                                    <Avatar className="h-full w-full border-4 border-black/50 shadow-2xl">
                                        <AvatarImage src={user?.avatar || "/avatar-placeholder.png"} />
                                        <AvatarFallback className="bg-cyan-950 text-cyan-400 text-3xl font-black">{initials}</AvatarFallback>
                                    </Avatar>
                                    <Badge variant="outline" className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-black border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                                        Level 5
                                    </Badge>
                                </div>

                                <CardTitle className="text-2xl font-black uppercase tracking-tight text-white mb-1">
                                    {user?.name || "Operative"}
                                </CardTitle>
                                <div className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-4">
                                    Strategist Class
                                </div>

                                <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3 h-3 text-purple-400" />
                                        <span>Security: High</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Trophy className="w-3 h-3 text-yellow-400" />
                                        <span>Rank: #42</span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
                                        <span>XP Progress</span>
                                        <span className="text-cyan-400">12,450 / 15,000</span>
                                    </div>
                                    <Progress value={83} className="h-1 bg-cyan-950" />
                                </div>

                                <Button
                                    onClick={handleDownloadCV}
                                    className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 uppercase font-black tracking-widest text-xs h-12 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] transition-all"
                                >
                                    <Download className="w-4 h-4 mr-2" /> Download Operative CV
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center">
                                <div className="text-2xl font-black text-white">9.2</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CGPA</div>
                            </div>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center">
                                <div className="text-2xl font-black text-white">99%</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attendance</div>
                            </div>
                        </div>

                    </motion.div>

                    {/* RIGHT MAIN CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-3 space-y-8"
                    >

                        {/* Attribute Analysis & Radar */}
                        <Card className="bg-black/20 border-white/10 backdrop-blur-md">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl font-black uppercase text-white">
                                    <Activity className="text-cyan-400 w-5 h-5" /> Attribute Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <div className="h-[300px] w-full relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={statsData}>
                                                <PolarGrid stroke="#ffffff10" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                                                <Radar
                                                    name={user?.name || "Operative"}
                                                    dataKey="A"
                                                    stroke="#22d3ee"
                                                    strokeWidth={2}
                                                    fill="#22d3ee"
                                                    fillOpacity={0.3}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none" />
                                    </div>

                                    <div className="space-y-8 pr-4">
                                        <SkillBar label="CGPA Power" value={92} color="bg-cyan-400" glow="shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                                        <SkillBar label="Skill Match" value={85} color="bg-purple-400" glow="shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                                        <SkillBar label="Financial Strength" value={70} color="bg-green-400" glow="shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                                        <SkillBar label="Risk Tolerance" value={50} color="bg-red-400" glow="shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Active Missions */}
                        <Card className="bg-black/20 border-white/10 backdrop-blur-md">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl font-black uppercase text-white">
                                    <Target className="text-red-400 w-5 h-5" /> Active Missions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <MissionCard
                                    id={1}
                                    title="Complete GRE Mock Test"
                                    reward="+500 XP"
                                    action="Start Mission"
                                    href="/guidance"
                                    theme="blue"
                                />
                                <MissionCard
                                    id={2}
                                    title="Upload Financial Documents"
                                    reward="+200 XP"
                                    action="Upload"
                                    href="/dashboard"
                                    theme="purple"
                                />
                            </CardContent>
                        </Card>

                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function SkillBar({ label, value, color, glow }: { label: string, value: number, color: string, glow: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-400">{label}</span>
                <span className="text-white">{value / 10}/10</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${color} ${glow} relative`}
                >
                    <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50" />
                </motion.div>
            </div>
        </div>
    );
}

function MissionCard({ id, title, reward, action, href, theme }: { id: number, title: string, reward: string, action: string, href: string, theme: 'blue' | 'purple' }) {
    const themeColor = theme === 'blue' ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' : 'text-purple-400 border-purple-500/30 bg-purple-500/10';
    const numColor = theme === 'blue' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400';

    return (
        <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
            <div className={`h-12 w-12 flex items-center justify-center rounded-xl font-black text-lg ${numColor}`}>
                {id}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors">{title}</h4>
                <div className="flex items-center gap-2 mt-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{reward}</span>
                </div>
            </div>
            <Link href={href}>
                <Button
                    variant="ghost"
                    className={`border uppercase font-black tracking-widest text-[10px] h-10 px-6 ${themeColor} hover:bg-white/10 hover:text-white transition-all`}
                >
                    {action}
                </Button>
            </Link>
        </div>
    );
}
