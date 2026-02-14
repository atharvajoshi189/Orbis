"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { DollarSign, TrendingUp, PieChart } from "lucide-react";

const debtData = [
    { year: '2026', debt: 45000, salary: 0 },
    { year: '2027', debt: 30000, salary: 65000 },
    { year: '2028', debt: 15000, salary: 85000 },
    { year: '2029', debt: 0, salary: 95000 },
    { year: '2030', debt: 0, salary: 110000 },
];

const demandData = [
    { field: 'CS', demand: 95 },
    { field: 'ME', demand: 70 },
    { field: 'EE', demand: 85 },
    { field: 'Civil', demand: 60 },
    { field: 'Bio', demand: 75 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-lg">
                <p className="font-bold text-gray-900 mb-1">{label}</p>
                {payload.map((entry: any) => (
                    <p key={entry.name} className="text-xs font-medium" style={{ color: entry.color }}>
                        {entry.name}: ${entry.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function ROITracker() {
    return (
        <section className="py-20 bg-white" id="roi">
            <div className="container-custom mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12">
                    <div>
                        <span className="text-primary font-bold tracking-wide uppercase text-sm">Financial Planning</span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">Success & ROI Calculator</h2>
                    </div>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <div className="px-4 py-2 bg-green-50 rounded-lg text-green-700 font-bold text-sm flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Avg. Payback: 3.5 Years
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart 1: Debt vs Salary */}
                    <div className="lg:col-span-2 orbis-card p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-gray-500" />
                                Projected Financial Trajectory
                            </h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={debtData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb' }} />
                                    <Legend verticalAlign="top" height={36} />
                                    <Line type="monotone" dataKey="debt" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, fill: '#EF4444' }} activeDot={{ r: 6 }} name="Edu Loan" />
                                    <Line type="monotone" dataKey="salary" stroke="#34A853" strokeWidth={3} dot={{ r: 4, fill: '#34A853' }} activeDot={{ r: 6 }} name="Projected Salary" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Market Demand */}
                    <div className="orbis-card p-6 md:p-8">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-gray-500" />
                                Market Demand
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Employment probability by sector (2026)</p>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={demandData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis dataKey="field" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                    <Bar dataKey="demand" fill="#1A73E8" radius={[4, 4, 0, 0]} barSize={40} name="Demand Score" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
