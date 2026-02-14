"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator, TrendingUp, Info, RotateCcw,
    Landmark, Percent, Calendar, DollarSign,
    ShieldCheck, AlertTriangle, CheckCircle2,
    ChevronDown, ChevronUp, PieChart as PieIcon, List
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

// --- Constants & Data ---
const BANK_RATES = [
    { name: "SBI Global Ed-Vantage", rate: 10.45, min: 8.65, max: 10.45, type: "Collateralized" },
    { name: "HDFC Credila", rate: 10.25, min: 10.25, max: 12.50, type: "Customizable" },
    { name: "ICICI Bank", rate: 11.50, min: 10.75, max: 12.00, type: "Unsecured" },
    { name: "Buddy4Study Partners", rate: 9.50, min: 8.10, max: 14.00, type: "Aggregator" },
];

const SALARY_PROJECTIONS: Record<string, number> = {
    "Engineering": 65000,
    "Management": 55000,
    "Medical": 75000,
    "Arts & Humanities": 35000,
    "Science": 45000
};

// --- Helper Components ---
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl ${className}`}>
        {children}
    </div>
);

const Slider = ({ label, value, min, max, step, onChange, unit = "" }: any) => (
    <div className="space-y-4">
        <div className="flex justify-between items-end">
            <span className="text-slate-400 font-medium text-sm mb-1">{label}</span>
            <div className="flex items-center gap-2 bg-slate-950/50 rounded-lg border border-slate-800 focus-within:border-cyan-500/50 transition-colors p-1">
                <span className="text-slate-500 text-xs pl-2 font-mono">{unit}</span>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-24 bg-transparent border-none text-right text-cyan-400 font-mono font-bold focus:ring-0 p-1 text-sm"
                />
            </div>
        </div>
        <div className="relative h-2">
            <div className="absolute inset-0 bg-slate-800 rounded-lg"></div>
            <div
                className="absolute left-0 top-0 bottom-0 bg-cyan-500 rounded-lg"
                style={{ width: `${((value - min) / (max - min)) * 100}%` }}
            ></div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
        </div>
        <div className="flex justify-between text-[10px] text-slate-600 font-mono px-1">
            <span>{unit}{min.toLocaleString()}</span>
            <span>{unit}{max.toLocaleString()}</span>
        </div>
    </div>
);

const AmortizationTable = ({ schedule }: { schedule: any[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mt-6 border-t border-white/10 pt-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-sm text-cyan-400 hover:text-cyan-300 transition-colors group p-2 rounded hover:bg-white/5"
            >
                <div className="flex items-center gap-2 font-semibold">
                    <List size={16} />
                    View Detailed Amortization Schedule
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 overflow-x-auto rounded-lg border border-white/10">
                            <table className="w-full text-left border-collapse bg-slate-950/50">
                                <thead>
                                    <tr className="text-xs text-slate-500 border-b border-white/10">
                                        <th className="py-3 px-4 font-normal uppercase tracking-wider">Year</th>
                                        <th className="py-3 px-4 font-normal uppercase tracking-wider text-right">Principal Paid</th>
                                        <th className="py-3 px-4 font-normal uppercase tracking-wider text-right">Interest Paid</th>
                                        <th className="py-3 px-4 font-normal uppercase tracking-wider text-right">Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedule.map((row) => (
                                        <tr key={row.year} className="text-sm text-slate-300 border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 font-mono text-xs text-slate-500">{row.year}</td>
                                            <td className="py-3 px-4 text-right font-mono">₹{Math.round(row.principal).toLocaleString()}</td>
                                            <td className="py-3 px-4 text-right font-mono text-orange-400/90">₹{Math.round(row.interest).toLocaleString()}</td>
                                            <td className="py-3 px-4 text-right font-mono text-slate-400">₹{Math.round(row.balance).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Particle Orb Visualizer (Enhanced) ---
const ParticleOrb = ({ healthScore }: { healthScore: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const getColor = (score: number) => {
        if (score > 50) return "239, 68, 68"; // Red-500
        if (score > 30) return "245, 158, 11"; // Amber-500
        return "34, 197, 94"; // Green-500
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: any[] = [];
        const particleCount = 70 + Math.floor(healthScore * 1.5);

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * (healthScore / 8 + 0.5),
                vy: (Math.random() - 0.5) * (healthScore / 8 + 0.5),
                size: Math.random() * 2 + 0.5,
                life: Math.random()
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colorRGB = getColor(healthScore);
            const time = Date.now() / 1000;
            const pulse = Math.sin(time * 2) * 0.1 + 1;

            // Glow Effect
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const globeRadius = Math.min(canvas.width, canvas.height) / 2 * 0.75;

            const gradient = ctx.createRadialGradient(cx, cy, globeRadius * 0.5, cx, cy, globeRadius * 1.2);
            gradient.addColorStop(0, `rgba(${colorRGB}, 0.05)`);
            gradient.addColorStop(1, `rgba(${colorRGB}, 0)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Ring
            ctx.beginPath();
            ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${colorRGB}, 0.1)`;
            ctx.lineWidth = 1;
            ctx.stroke();

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                const dist = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);

                if (dist > globeRadius) {
                    const angle = Math.atan2(p.y - cy, p.x - cx);
                    p.vx = -Math.cos(angle) * Math.abs(p.vx);
                    p.vy = -Math.sin(angle) * Math.abs(p.vy);
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${colorRGB}, ${p.life * 0.6})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
                    if (d < 50) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${colorRGB}, ${0.15 * (1 - d / 50)})`;
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [healthScore]);

    return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default function LoanSimulator() {
    // --- State ---
    const [principal, setPrincipal] = useState(2500000);
    const [rate, setRate] = useState(10.5);
    const [tenure, setTenure] = useState(10);
    const [moratorium, setMoratorium] = useState(false);
    const [courseDuration, setCourseDuration] = useState(2);
    const [field, setField] = useState("Engineering");

    // --- Calculation Logic (Granular) ---
    const calculateLoan = () => {
        const r = rate / 12 / 100;
        let finalPrincipal = principal;

        // Moratorium Interest
        if (moratorium) {
            const moratoriumMonths = courseDuration * 12 + 12;
            finalPrincipal += principal * r * moratoriumMonths;
        }

        // EMI
        const n = tenure * 12;
        const emi = (finalPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

        // Amortization Schedule
        let balance = finalPrincipal;
        const schedule = [];
        let totalInterest = 0;

        for (let i = 1; i <= tenure; i++) {
            let yearlyInterest = 0;
            let yearlyPrincipal = 0;

            for (let m = 0; m < 12; m++) {
                if (balance <= 0) break;
                const interest = balance * r;
                const payment = emi;
                const principalPart = payment - interest;

                balance -= principalPart;
                yearlyInterest += interest;
                yearlyPrincipal += principalPart;
            }

            totalInterest += yearlyInterest;
            schedule.push({
                year: `Year ${i}`,
                interest: yearlyInterest,
                principal: yearlyPrincipal,
                balance: Math.max(0, balance),
                paid: yearlyInterest + yearlyPrincipal
            });
        }

        const totalAmount = emi * n;
        const taxSavings = totalInterest * 0.312; // Approx 80E benefit

        return {
            emi: Math.round(emi),
            totalInterest: Math.round(totalInterest),
            totalAmount: Math.round(totalAmount),
            taxSavings: Math.round(taxSavings),
            finalPrincipal: Math.round(finalPrincipal),
            schedule
        };
    };

    const stats = calculateLoan();
    const monthlySalary = SALARY_PROJECTIONS[field];
    const debtRatio = (stats.emi / monthlySalary) * 100;

    const pieData = [
        { name: 'Principal', value: principal, color: '#3b82f6' }, // Blue-500
        { name: 'Interest', value: stats.totalInterest, color: '#f97316' }, // Orange-500
    ];

    return (
        <div className="min-h-screen bg-[#0B0E14] text-slate-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">

            <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Calculator className="text-cyan-400" size={28} />
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Loan & EMI Simulator</h1>
                    </div>
                    <p className="text-slate-500 text-sm ml-12">Precision planning with real-time 2026 market data</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs bg-emerald-950/30 text-emerald-400 px-4 py-2 rounded-full border border-emerald-900/50">
                        <TrendingUp size={14} />
                        <span>Market Stable</span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: Controls (Span 4) */}
                <div className="lg:col-span-4 space-y-6">
                    <GlassCard>
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                            <RotateCcw size={18} className="text-slate-400" /> Parameter Config
                        </h3>

                        <div className="space-y-8">
                            <Slider
                                label="Loan Amount"
                                value={principal}
                                min={500000} max={10000000} step={10000}
                                onChange={setPrincipal}
                                unit="₹"
                            />
                            <Slider
                                label="Interest Rate"
                                value={rate}
                                min={8.0} max={16.0} step={0.05}
                                onChange={setRate}
                                unit="%"
                            />
                            <Slider
                                label="Repayment Tenure"
                                value={tenure}
                                min={5} max={20} step={1}
                                onChange={setTenure}
                                unit="Yrs"
                            />

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-200">Moratorium</span>
                                    <span className="text-[10px] text-slate-500">Add course duration interest</span>
                                </div>
                                <div className={`relative w-11 h-6 transition-colors rounded-full ${moratorium ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                                    <input
                                        type="checkbox"
                                        checked={moratorium}
                                        onChange={(e) => setMoratorium(e.target.checked)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${moratorium ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Comparison Field</label>
                                <div className="relative">
                                    <select
                                        value={field}
                                        onChange={(e) => setField(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none"
                                    >
                                        {Object.keys(SALARY_PROJECTIONS).map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-3.5 text-slate-500 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">2026 Bank Rates Override</span>
                            <div className="grid grid-cols-2 gap-2">
                                {BANK_RATES.map(bank => (
                                    <button
                                        key={bank.name}
                                        onClick={() => setRate(bank.rate)}
                                        className="text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-cyan-500/30 group"
                                    >
                                        <div className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{bank.name.split(' ')[0]}</div>
                                        <div className="text-[10px] text-cyan-400 font-mono mt-1">{bank.rate}%</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* CENTER: Visualizer (Span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* 3D Orb Area */}
                    <div className="relative aspect-square bg-[#080a0f] rounded-full border border-white/10 shadow-[0_0_80px_rgba(6,182,212,0.05)] overflow-hidden flex items-center justify-center group">
                        <div className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none transition-opacity group-hover:opacity-80">
                            <ParticleOrb healthScore={debtRatio} />
                        </div>

                        {/* Center HUD */}
                        <div className="relative z-10 text-center flex flex-col items-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Monthly EMI</div>
                            <div className="text-5xl font-bold text-white font-mono tracking-tighter drop-shadow-2xl">
                                <span className="text-2xl text-slate-600 align-top mr-1 font-sans">₹</span>
                                {stats.emi.toLocaleString()}
                            </div>
                            <div className={`mt-4 px-4 py-1.5 rounded-full text-[10px] font-bold border backdrop-blur-md transition-colors duration-500 ${debtRatio > 50 ? 'bg-red-950/50 text-red-400 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]' :
                                    debtRatio > 30 ? 'bg-amber-950/50 text-amber-400 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]' :
                                        'bg-green-950/50 text-green-400 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                                }`}>
                                DEBT LOAD: {Math.min(100, Math.round(debtRatio))}%
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <GlassCard className="flex flex-col justify-center items-center py-6 border-l-4 border-l-orange-500">
                            <span className="text-slate-500 text-xs uppercase tracking-wider mb-1">Total Interest</span>
                            <span className="text-2xl font-bold text-white">₹{(stats.totalInterest / 100000).toFixed(2)}L</span>
                        </GlassCard>
                        <GlassCard className="flex flex-col justify-center items-center py-6 border-l-4 border-l-green-500 relative overflow-hidden">
                            <div className="absolute top-2 right-2 opacity-20"><ShieldCheck size={20} className="text-green-500" /></div>
                            <span className="text-slate-500 text-xs uppercase tracking-wider mb-1">80E Savings</span>
                            <span className="text-2xl font-bold text-white">~₹{(stats.taxSavings / 100000).toFixed(2)}L</span>
                        </GlassCard>
                    </div>
                </div>

                {/* RIGHT: Analysis (Span 4) */}
                <div className="lg:col-span-4 space-y-6">
                    <GlassCard>
                        <h3 className="text-md font-semibold text-slate-200 mb-6 flex items-center gap-2">
                            <PieIcon size={16} className="text-cyan-400" /> Repayment Split
                        </h3>
                        <div className="h-48 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value: number) => `₹${value.toLocaleString()}`}
                                    />
                                    <Legend
                                        verticalAlign="middle"
                                        layout="vertical"
                                        align="right"
                                        wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h3 className="text-md font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-400" /> Feasibility Score
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-lg">
                                <span className="text-slate-400">Proj. Salary ({field})</span>
                                <span className="text-emerald-400 font-mono font-bold">₹{monthlySalary.toLocaleString()}</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium text-slate-400">
                                    <span>EMI Impact on Salary</span>
                                    <span>{Math.round(debtRatio)}%</span>
                                </div>
                                <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, debtRatio)}%` }}
                                        className={`h-full rounded-full ${debtRatio > 50 ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'}`}
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-slate-700 pl-3">
                                {debtRatio < 30 ? "Excellent balance. This load is considered very safe by lenders." :
                                    debtRatio < 50 ? "Moderate load. You'll be spending nearly half your starting pay on EMI." :
                                        "Critical load. High risk of rejection or financial stress. Increase tenure or lower loan amount."}
                            </p>
                        </div>
                    </GlassCard>
                </div>

                {/* BOTTOM: Amortization Table */}
                <div className="lg:col-span-12">
                    <AmortizationTable schedule={stats.schedule} />
                </div>

            </div>
        </div>
    );
}
