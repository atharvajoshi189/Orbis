"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

import { useAppStore } from "@/lib/store";

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

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Operative Profile</h1>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Player Identity Card */}
                <Card className="glass-card bg-black/40 border-primary/30 md:col-span-1 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                    <CardHeader className="text-center pb-2">
                        <div className="relative mx-auto mb-4 h-32 w-32">
                            <div className="absolute inset-0 rounded-full border-2 border-primary border-dashed animate-[spin_10s_linear_infinite]" />
                            <Avatar className="h-full w-full border-4 border-black">
                                <AvatarImage src={user?.avatar || "/avatar-placeholder.png"} />
                                <AvatarFallback className="bg-primary/20 text-3xl font-bold">{initials}</AvatarFallback>
                            </Avatar>
                            <Badge variant="neon" className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1">
                                LEVEL 5
                            </Badge>
                        </div>
                        <CardTitle className="text-2xl mt-4">{user?.name || "Operative"}</CardTitle>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="text-2xl">🇮🇳</span>
                            <span className="text-muted-foreground">Mumbai, India</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="rounded-lg bg-white/5 p-3">
                                <p className="text-xs text-muted-foreground">Class</p>
                                <p className="font-bold text-primary">Strategist</p>
                            </div>
                            <div className="rounded-lg bg-white/5 p-3">
                                <p className="text-xs text-muted-foreground">XP</p>
                                <p className="font-bold text-yellow-500">12,450</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Rank Progress</span>
                                    <span className="text-primary font-bold">78%</span>
                                </div>
                                <Progress value={78} className="h-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats & Skills */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Attribute Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={statsData}>
                                            <PolarGrid stroke="#333" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                                            <Radar
                                                name={user?.name || "Operative"}
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
                                            <span>CGPA Power</span>
                                            <span className="text-primary">9.2/10</span>
                                        </div>
                                        <Progress value={92} className="h-2" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Skill Match</span>
                                            <span className="text-purple-500">High</span>
                                        </div>
                                        <Progress value={85} className="h-2 bg-purple-950" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Financial Strength</span>
                                            <span className="text-green-500">Solid</span>
                                        </div>
                                        <Progress value={70} className="h-2 bg-green-950" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Risk Tolerance</span>
                                            <span className="text-red-500">Moderate</span>
                                        </div>
                                        <Progress value={50} className="h-2 bg-red-950" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Active Missions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20 text-primary font-bold">1</div>
                                    <div className="flex-1">
                                        <h4 className="font-bold">Complete GRE Mock Test</h4>
                                        <p className="text-xs text-muted-foreground">Reward: +500 XP</p>
                                    </div>
                                    <Button size="sm" variant="outline">Start</Button>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-500 font-bold">2</div>
                                    <div className="flex-1">
                                        <h4 className="font-bold">Upload Financial Documents</h4>
                                        <p className="text-xs text-muted-foreground">Reward: +200 XP</p>
                                    </div>
                                    <Button size="sm" variant="outline">Upload</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
