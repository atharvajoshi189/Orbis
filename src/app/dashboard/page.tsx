"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Target, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-white">Command Center</h1>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-sm font-medium text-green-500">Live Data Stream</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card border-l-4 border-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Admission Probability</CardTitle>
                        <Target className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">82%</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                            +2.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-l-4 border-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Projected Salary (Avg)</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$85,000</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                            +12% vs market avg
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-l-4 border-yellow-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ROI Timeline</CardTitle>
                        <TrendingUp className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3.4 Years</div>
                        <p className="text-xs text-muted-foreground">To break even</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-l-4 border-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Risk Factor</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">Moderate</div>
                        <p className="text-xs text-muted-foreground">Visa policy changes</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 glass-card">
                    <CardHeader>
                        <CardTitle>Career Growth Projection</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                                <Line type="monotone" dataKey="value" stroke="#00f3ff" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3 glass-card">
                    <CardHeader>
                        <CardTitle>Recent Intelligence</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { title: "New STEM Visa Rules in UK", time: "2h ago", type: "Policy" },
                                { title: "Tech Hiring Surge in Germany", time: "5h ago", type: "Market" },
                                { title: "Scholarship Deadline: MIT", time: "1d ago", type: "Deadline" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center border-b border-white/10 pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none text-white">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.time} • {item.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
