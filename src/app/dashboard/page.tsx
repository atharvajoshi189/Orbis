"use client";

<<<<<<< HEAD
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
=======
import Navbar from "@/components/Navbar";
import { TrendingUp, Award, Plane, MessageSquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { year: '2026', debt: 45, income: 0 },
    { year: '2027', debt: 30, income: 65 },
    { year: '2028', debt: 15, income: 85 },
    { year: '2029', debt: 0, income: 95 },
    { year: '2030', debt: 0, income: 120 },
>>>>>>> 7973475a356c68f58843dc2a0a9c65b21f60b41e
];

export default function DashboardPage() {
    return (
<<<<<<< HEAD
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
=======
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="container-custom mx-auto py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">

                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            icon={TrendingUp} color="bg-green-100 text-green-700"
                            label="Admission Probability" value="High (85%)"
                        />
                        <StatCard
                            icon={Award} color="bg-blue-100 text-blue-700"
                            label="Est. Starting Salary" value="$95,000/yr"
                        />
                        <StatCard
                            icon={Plane} color="bg-purple-100 text-purple-700"
                            label="Visa Success Rate" value="98%"
                        />
                    </div>

                    {/* Split View: Global vs Local */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Global Opportunity */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-900 border-l-4 border-blue-500 pl-3">Global Match</h3>
                                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Top Choice</span>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-700 font-bold text-2xl">S</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">Stanford Univ.</h4>
                                    <p className="text-slate-500 text-sm">M.S. in Computer Science</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-6">
                                <Tag text="High ROI" />
                                <Tag text="Research Focused" />
                            </div>
                            <button className="w-full py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition">View Details</button>
                        </div>

                        {/* Local Opportunity */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-900 border-l-4 border-green-500 pl-3">Local Gem</h3>
                                <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Stable</span>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-700 font-bold text-2xl">I</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">IIT Bombay</h4>
                                    <p className="text-slate-500 text-sm">M.Tech in AI/ML</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-6">
                                <Tag text="Low Cost" />
                                <Tag text="Industry Ties" />
                            </div>
                            <button className="w-full py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition">View Details</button>
                        </div>
                    </div>

                    {/* Financial Chart */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6">5-Year ROI Projection (Debt vs Income)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `$${val}k`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        cursor={{ stroke: '#cbd5e1' }}
                                    />
                                    <Line type="monotone" dataKey="debt" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} name="Debt" />
                                    <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} name="Income" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Sidebar */}
                <div className="col-span-1">
                    <div className="sticky top-24 space-y-6">

                        {/* Profile Card */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4" />
                            <h3 className="font-bold text-slate-900">Atharva</h3>
                            <p className="text-sm text-slate-500 mb-4">Final Year Undergrad</p>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                <div className="w-[85%] h-full bg-blue-500 rounded-full" />
                            </div>
                            <p className="text-xs text-slate-400">Profile 85% Complete</p>
                        </div>

                        {/* AI Chat Widget */}
                        <div className="bg-[#1A73E8] p-6 rounded-3xl shadow-lg shadow-blue-500/20 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><MessageSquare size={20} /> Orbis AI</h3>
                            <p className="text-blue-100 text-sm mb-4">Have questions about your visa or admission chances?</p>
                            <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition">Chat Now</button>
                        </div>

                    </div>
                </div>

>>>>>>> 7973475a356c68f58843dc2a0a9c65b21f60b41e
            </div>
        </div>
    );
}
<<<<<<< HEAD
=======

function StatCard({ icon: Icon, color, label, value }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon size={20} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">{label}</p>
            <h3 className="text-xl font-bold text-slate-900">{value}</h3>
        </div>
    )
}

function Tag({ text }: { text: string }) {
    return (
        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">
            {text}
        </span>
    )
}
>>>>>>> 7973475a356c68f58843dc2a0a9c65b21f60b41e
