"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const statsData = [
    { subject: 'CGPA', A: 120, fullMark: 150 },
    { subject: 'Skills', A: 98, fullMark: 150 },
    { subject: 'Exp', A: 86, fullMark: 150 },
    { subject: 'Extra', A: 99, fullMark: 150 },
    { subject: 'Logic', A: 85, fullMark: 150 },
    { subject: 'Comm', A: 65, fullMark: 150 },
];

export default function ProfilePage() {
    return (
        <div className="min-h-screen font-sans transition-colors duration-300">
            <Navbar />
            <div className="container-custom mx-auto py-20 px-4 space-y-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">Operative Profile</h1>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Player Identity Card */}
                    <Card className="glass-card bg-white dark:bg-black/40 border-slate-200 dark:border-primary/30 md:col-span-1 shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-colors">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                        <CardHeader className="text-center pb-2">
                            <div className="relative mx-auto mb-4 h-32 w-32">
                                <div className="absolute inset-0 rounded-full border-2 border-primary border-dashed animate-[spin_10s_linear_infinite]" />
                                <Avatar className="h-full w-full border-4 border-white dark:border-black shadow-xl">
                                    <AvatarImage src="/avatar-placeholder.png" />
                                    <AvatarFallback className="bg-primary/20 text-3xl font-bold text-primary">JD</AvatarFallback>
                                </Avatar>
                                <Badge variant="neon" className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-black dark:text-black font-black">
                                    LEVEL 5
                                </Badge>
                            </div>
                            <CardTitle className="text-2xl mt-4 text-slate-900 dark:text-white">John Doe</CardTitle>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <span className="text-2xl">🇮🇳</span>
                                <span className="text-slate-500 dark:text-muted-foreground font-medium">Mumbai, India</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="rounded-lg bg-slate-100 dark:bg-white/5 p-3 border border-slate-200 dark:border-white/5">
                                    <p className="text-xs text-slate-500 dark:text-muted-foreground uppercase font-bold tracking-wider">Class</p>
                                    <p className="font-bold text-primary">Strategist</p>
                                </div>
                                <div className="rounded-lg bg-slate-100 dark:bg-white/5 p-3 border border-slate-200 dark:border-white/5">
                                    <p className="text-xs text-slate-500 dark:text-muted-foreground uppercase font-bold tracking-wider">XP</p>
                                    <p className="font-bold text-yellow-600 dark:text-yellow-500">12,450</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500 dark:text-muted-foreground font-bold">Rank Progress</span>
                                        <span className="text-primary font-bold">78%</span>
                                    </div>
                                    <Progress value={78} className="h-2 bg-slate-200 dark:bg-slate-800" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats & Skills */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="glass-card bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 shadow-sm transition-colors">
                            <CardHeader>
                                <CardTitle className="text-slate-900 dark:text-white">Attribute Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={statsData}>
                                                <PolarGrid stroke="#64748b" opacity={0.2} />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                                                <Radar
                                                    name="John"
                                                    dataKey="A"
                                                    stroke="#00f3ff"
                                                    strokeWidth={2}
                                                    fill="#00f3ff"
                                                    fillOpacity={0.2}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-700 dark:text-slate-300 font-medium">CGPA Power</span>
                                                <span className="text-primary font-bold">9.2/10</span>
                                            </div>
                                            <Progress value={92} className="h-2 bg-slate-200 dark:bg-slate-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-700 dark:text-slate-300 font-medium">Skill Match</span>
                                                <span className="text-purple-600 dark:text-purple-500 font-bold">High</span>
                                            </div>
                                            <Progress value={85} className="h-2 bg-purple-100 dark:bg-purple-950" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-700 dark:text-slate-300 font-medium">Financial Strength</span>
                                                <span className="text-green-600 dark:text-green-500 font-bold">Solid</span>
                                            </div>
                                            <Progress value={70} className="h-2 bg-green-100 dark:bg-green-950" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-700 dark:text-slate-300 font-medium">Risk Tolerance</span>
                                                <span className="text-red-600 dark:text-red-500 font-bold">Moderate</span>
                                            </div>
                                            <Progress value={50} className="h-2 bg-red-100 dark:bg-red-950" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 shadow-sm transition-colors">
                            <CardHeader>
                                <CardTitle className="text-slate-900 dark:text-white">Active Missions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-colors">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20 text-primary font-bold">1</div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 dark:text-white">Complete GRE Mock Test</h4>
                                            <p className="text-xs text-slate-500 dark:text-muted-foreground">Reward: +500 XP</p>
                                        </div>
                                        <Button size="sm" variant="outline" className="border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10">Start</Button>
                                    </div>
                                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-colors">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-500 font-bold">2</div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 dark:text-white">Upload Financial Documents</h4>
                                            <p className="text-xs text-slate-500 dark:text-muted-foreground">Reward: +200 XP</p>
                                        </div>
                                        <Button size="sm" variant="outline" className="border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10">Upload</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
