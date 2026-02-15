"use client";

import Navbar from "@/components/Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, Briefcase, MapPin } from "lucide-react";
import { useState } from "react";

const roiData = [
    { name: 'Cost of Living', Stanford: 2500, IIT: 500 },
    { name: 'Tuition Fees', Stanford: 60000, IIT: 4000 },
    { name: 'Avg. Salary', Stanford: 120000, IIT: 25000 },
];

export default function ROIPage() {
    const [uni1, setUni1] = useState("Stanford");
    const [uni2, setUni2] = useState("IIT Bombay");

    return (
        <div className="min-h-screen font-sans transition-colors duration-300">
            <Navbar />

            <div className="container-custom mx-auto py-12 px-4">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">ROI & Career Analytics</h1>
                    <p className="text-slate-700 dark:text-slate-400 text-lg max-w-2xl mx-auto">Compare universities head-to-head on financial metrics and job market demand.</p>
                </div>

                {/* Comparison Config */}
                <div className="bg-white/60 backdrop-blur-xl dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm max-w-3xl mx-auto mb-12 flex flex-col md:flex-row gap-4 items-center justify-center">
                    <select
                        className="bg-white/40 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-3 font-bold text-slate-700 dark:text-white focus:ring-2 ring-blue-500 outline-none"
                        value={uni1} onChange={(e) => setUni1(e.target.value)}
                    >
                        <option className="dark:bg-slate-900">Stanford</option>
                        <option className="dark:bg-slate-900">MIT</option>
                        <option className="dark:bg-slate-900">Oxford</option>
                    </select>
                    <span className="font-bold text-slate-600 dark:text-slate-400">VS</span>
                    <select
                        className="bg-white/40 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-3 font-bold text-slate-700 dark:text-white focus:ring-2 ring-blue-500 outline-none"
                        value={uni2} onChange={(e) => setUni2(e.target.value)}
                    >
                        <option className="dark:bg-slate-900">IIT Bombay</option>
                        <option className="dark:bg-slate-900">BITS Pilani</option>
                        <option className="dark:bg-slate-900">DTU</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Charts */}
                    <div className="bg-white/60 backdrop-blur-xl dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <DollarSign className="text-green-600 dark:text-green-400" /> Financial Comparison (Annual $)
                        </h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={roiData} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#64748b" opacity={0.1} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{
                                            backgroundColor: 'var(--background)',
                                            borderRadius: '16px',
                                            border: '1px solid var(--border)',
                                            color: 'var(--foreground)',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                            padding: '12px'
                                        }}
                                        wrapperStyle={{
                                            backgroundColor: 'rgb(15 23 42 / 0.9)', // dark:bg-slate-900/90
                                            color: 'rgb(255 255 255)', // dark:text-white
                                        }}
                                        itemStyle={{ fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="Stanford" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} name={uni1} />
                                    <Bar dataKey="IIT" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={20} name={uni2} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-400">
                                <div className="w-3 h-3 bg-blue-500 rounded-full" /> {uni1}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-400">
                                <div className="w-3 h-3 bg-green-500 rounded-full" /> {uni2}
                            </div>
                        </div>
                    </div>

                    {/* Job Market Heatmap (Simulated) */}
                    <div className="bg-white/60 backdrop-blur-xl dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Briefcase className="text-blue-600 dark:text-blue-400" /> Job Market Demand (USA)
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <RegionCard name="California (Silicon Valley)" roles="15,000+" trend="up" intensity="bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400" />
                            <RegionCard name="New York (Finance/Tech)" roles="8,500+" trend="stable" intensity="bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400" />
                            <RegionCard name="Texas (Austin Hub)" roles="6,200+" trend="up" intensity="bg-green-50 dark:bg-green-600/10 text-green-700 dark:text-green-300" />
                            <RegionCard name="Washington (Seattle)" roles="5,000+" trend="down" intensity="bg-yellow-50 dark:bg-yellow-600/10 text-yellow-700 dark:text-yellow-300" />
                        </div>

                        <div className="mt-8 p-4 bg-white/40 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                                <MapPin size={16} /> Top Recruiters
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['Google', 'Microsoft', 'Tesla', 'Apple', 'NVIDIA'].map(c => (
                                    <span key={c} className="px-3 py-1 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function RegionCard({ name, roles, trend, intensity }: any) {
    return (
        <div className={`p-4 rounded-2xl border border-transparent ${intensity} flex flex-col justify-between h-32`}>
            <span className="font-bold text-sm">{name}</span>
            <div>
                <span className="block text-2xl font-black">{roles}</span>
                <span className="text-xs uppercase tracking-wider opacity-70">Open Roles</span>
            </div>
        </div>
    )
}
