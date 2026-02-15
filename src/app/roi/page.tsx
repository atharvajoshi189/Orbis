'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, DollarSign, Globe, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { toast } from 'sonner';

// Types
interface ROIAnalysis {
    original: {
        tuition: number;
        rent: number;
        food: number;
        total: number;
    };
    alternative: {
        country: string | null;
        tuition: number;
        rent: number;
        total: number;
        reason: string;
    };
    roi_percentage: string;
    break_even_months: number;
    starting_salary: number;
    risk_score: number;
    analysis_text: string;
}

export default function ROITerminalPage() {
    const [step, setStep] = useState<'country' | 'budget' | 'analyzing' | 'results'>('country');
    const [country, setCountry] = useState('');
    const [budget, setBudget] = useState('');
    const [analysis, setAnalysis] = useState<ROIAnalysis | null>(null);

    const handleCountrySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (country.trim()) setStep('budget');
    };

    const handleBudgetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!budget.trim()) return;

        setStep('analyzing');
        try {
            const response = await fetch('/api/roi/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetCountry: country,
                    userBudget: parseFloat(budget.replace(/[^0-9.]/g, '')),
                }),
            });

            if (!response.ok) throw new Error('Analysis failed');

            const data = await response.json();
            setAnalysis(data);
            setStep('results');
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate ROI analysis. Please try again.");
            setStep('budget');
        }
    };

    // Chart Data Helper
    const getChartData = () => {
        if (!analysis) return [];
        const monthlySalary = analysis.starting_salary / 12;
        const totalDebt = analysis.original.total;
        // Simple linear repayment projection
        const months = analysis.break_even_months + 12; // Show a year past break-even
        const data = [];
        for (let i = 0; i <= months; i += 6) {
            data.push({
                month: i,
                debt: Math.max(0, totalDebt - (monthlySalary * 0.4 * i)), // Assuming 40% goes to repayment
                earnings: monthlySalary * i
            });
        }
        return data;
    };

    return (
        <div className="min-h-screen bg-[#050B14] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-900/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            </div>

            <main className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4 tracking-tighter">
                        ROI TERMINAL
                    </h1>
                    <p className="text-cyan-400/60 text-lg uppercase tracking-[0.2em] text-xs">Financial Intelligence Unit</p>
                </header>

                <AnimatePresence mode="wait">
                    {step === 'country' && (
                        <motion.div
                            key="country"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-xl mx-auto mt-20"
                        >
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl shadow-cyan-900/20 ring-1 ring-white/10">
                                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-cyan-50">
                                    <Globe className="text-cyan-400" />
                                    Target Destination
                                </h2>
                                <form onSubmit={handleCountrySubmit} className="relative">
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        placeholder="e.g. USA, Germany, UK"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-xl focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-gray-600"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-3 bottom-3 bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-lg transition-colors flex items-center gap-2 font-medium"
                                    >
                                        Next <ArrowRight size={18} />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {step === 'budget' && (
                        <motion.div
                            key="budget"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-xl mx-auto mt-20"
                        >
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl shadow-cyan-900/20 ring-1 ring-white/10">
                                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-cyan-50">
                                    <DollarSign className="text-cyan-400" />
                                    Total Budget (USD)
                                </h2>
                                <form onSubmit={handleBudgetSubmit} className="relative">
                                    <input
                                        type="number"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        placeholder="e.g. 25000"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-xl focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-gray-600"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-3 bottom-3 bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-lg transition-colors flex items-center gap-2 font-medium"
                                    >
                                        Analyze <TrendingUp size={18} />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {step === 'analyzing' && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center mt-32"
                        >
                            <div className="relative w-32 h-32 mb-8">
                                <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-3 border-r-4 border-purple-600 rounded-full animate-spin-reverse"></div>
                                <div className="absolute inset-8 bg-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
                            </div>
                            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse tracking-tight">
                                PROCESSING DATA
                            </h3>
                            <p className="text-cyan-400/60 mt-4 tracking-widest text-sm uppercase">Grok Neural Network Active</p>
                        </motion.div>
                    )}

                    {step === 'results' && analysis && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {/* Overview Cards */}
                            <GlassCard title="Academic Cost" value={`$${analysis.original.tuition.toLocaleString()}`} subtitle="Yearly Tuition + Books" icon={<Globe className="text-cyan-400" />} />
                            <GlassCard title="Lifestyle" value={`$${analysis.original.total.toLocaleString()}`} subtitle="Total Yearly Expenses" icon={<DollarSign className="text-emerald-400" />} />
                            <GlassCard title="ROI Projection" value={analysis.roi_percentage} subtitle="Estimated Return" icon={<TrendingUp className="text-purple-400" />} />
                            <GlassCard
                                title="Risk Assessment"
                                value={`${analysis.risk_score}/100`}
                                subtitle={analysis.risk_score < 40 ? "Low Risk" : analysis.risk_score < 70 ? "Moderate Risk" : "High Risk"}
                                icon={<AlertTriangle className={analysis.risk_score > 60 ? "text-red-500" : "text-yellow-400"} />}
                                isRisk
                                riskScore={analysis.risk_score}
                            />

                            {/* Main Chart Section */}
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl ring-1 ring-white/5">
                                <h3 className="text-xl font-semibold mb-8 flex items-center gap-3 text-gray-200">
                                    <TrendingUp className="text-cyan-400" /> Break-Even Analysis
                                </h3>
                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={getChartData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis
                                                dataKey="month"
                                                stroke="#475569"
                                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                stroke="#475569"
                                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `$${value / 1000}k`}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                                                itemStyle={{ color: '#e2e8f0' }}
                                            />
                                            <Area type="monotone" dataKey="earnings" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" name="Cumulative Earnings" />
                                            <Area type="monotone" dataKey="debt" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDebt)" name="Remaining Debt" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Strategy / Alternative Panel */}
                            <div className="col-span-1 lg:col-span-1 flex flex-col gap-6">
                                <div className="bg-gradient-to-br from-blue-900/40 to-black/40 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 h-full">
                                    <h3 className="text-xl font-semibold mb-4 text-blue-200">Execution Strategy</h3>
                                    <div className="prose prose-invert text-sm text-gray-400 mb-6 leading-relaxed">
                                        <p>"{analysis.analysis_text}"</p>
                                    </div>

                                    {analysis.alternative.country && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <AlertTriangle size={48} />
                                            </div>
                                            <h4 className="text-yellow-400 font-bold mb-3 flex items-center gap-2 uppercase tracking-wide text-sm">
                                                <AlertTriangle size={16} /> Smart Pivot
                                            </h4>
                                            <p className="text-sm text-gray-300 mb-4 font-medium">
                                                Based on your budget, we highly recommend pivoting to <strong>{analysis.alternative.country}</strong>.
                                            </p>
                                            <ul className="text-xs text-gray-400 space-y-2">
                                                <li className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                                    <span>Tuition</span>
                                                    <span className="text-white font-mono">${analysis.alternative.tuition.toLocaleString()}</span>
                                                </li>
                                                <li className="flex justify-between items-center bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                                                    <span className="text-green-400">Projected Savings</span>
                                                    <span className="text-green-400 font-mono font-bold">${(analysis.original.total - analysis.alternative.total).toLocaleString()}</span>
                                                </li>
                                            </ul>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            <motion.button
                                onClick={() => setStep('country')}
                                className="col-span-full mx-auto mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-400 transition-colors"
                            >
                                Start New Simulation
                            </motion.button>

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function GlassCard({ title, value, subtitle, icon, isRisk, riskScore }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-cyan-500/30 transition-all ring-1 ring-white/5"
        >
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-500">
                {icon}
            </div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">{title}</h3>
            <div className="text-3xl font-bold text-white mb-2 tracking-tight">{value}</div>
            <div className="text-xs text-gray-500 font-medium">{subtitle}</div>

            {isRisk && (
                <div className="mt-5 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${riskScore}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${riskScore > 60 ? 'bg-red-500' : riskScore > 30 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                    />
                </div>
            )}
        </motion.div>
    );
}
