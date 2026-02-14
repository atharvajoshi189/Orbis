
"use client";

import React, { useState } from 'react';
import {
    PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import {
    GraduationCap, Globe, BadgeIndianRupee,
    CheckCircle2, ChevronRight, AlertCircle, Sparkles, User, Target, Bookmark
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useAppStore } from '@/lib/store';

const EligibilityDashboard = () => {
    const { user, login } = useAppStore();

    // --- Mock Login Handler ---
    const handleMockLogin = () => {
        login({
            name: "Arjun Mehta",
            email: "arjun@example.com",
            field: "Engineering",
            cgpa: 9.2,
            annualFamilyIncome: 600000,
            targetCountries: ["USA", "Germany", "UK"],
            category: "General",
            age: 21
        });
    };

    // --- Demo Profile for Guests ---
    const demoProfile = {
        name: "Guest User (Demo)",
        field: "Engineering",
        cgpa: 8.5,
        annualFamilyIncome: 800000,
        targetCountries: ["USA", "Germany"],
        category: "General",
        age: 22
    };

    // --- Use Global User Profile OR Demo ---
    const activeProfile = user ? {
        name: user.name,
        field: user.field || "General",
        cgpa: user.cgpa || 0,
        annualFamilyIncome: user.annualFamilyIncome || 0,
        targetCountries: user.targetCountries || [],
        age: user.age || 18,
        category: user.category || "General"
    } : demoProfile;

    const userProfile = activeProfile;

    // --- Data: Funding Distribution (Kept for visualizing coverage) ---
    const fundingData = [
        { name: 'Tuition', value: 65, color: '#8b5cf6' }, // Violet
        { name: 'Living', value: 25, color: '#06b6d4' }, // Cyan
        { name: 'Insurance', value: 10, color: '#ec4899' }, // Pink
    ];

    // --- Import Data from JSON ---
    const schemes = require('@/data/scholarships.json');

    // --- Auto-Matching Logic ---
    const matchedSchemes = schemes.filter((scheme: any) => {
        // 1. Field Match (Loose matching)
        const fieldMatch = scheme.fields.includes("All Fields") || scheme.fields.some((f: string) => f.includes(userProfile.field) || userProfile.field.includes(f));

        // 2. Income Match (If scheme has limit)
        // Note: JSON uses 'max_income', 'null' means no limit
        const incomeMatch = scheme.criteria.max_income === null || userProfile.annualFamilyIncome <= scheme.criteria.max_income;

        // 3. Marks Match
        // Converting CGPA to approx % (9.2 * 10 = 92%)
        const marksMatch = !scheme.criteria.min_marks || (userProfile.cgpa * 10) >= scheme.criteria.min_marks;

        // 4. Age Match
        const ageMatch = !scheme.criteria.age_limit || userProfile.age <= scheme.criteria.age_limit;

        return fieldMatch && incomeMatch && marksMatch && ageMatch;
    });

    // --- Pagination State ---
    const [visibleMatches, setVisibleMatches] = useState(4);
    const [visibleOthers, setVisibleOthers] = useState(6);

    const handleShowMoreMatches = () => setVisibleMatches(prev => prev + 4);
    const handleShowLessMatches = () => setVisibleMatches(4);

    const handleShowMoreOthers = () => setVisibleOthers(prev => prev + 6);
    const handleShowLessOthers = () => setVisibleOthers(6);

    const otherSchemes = schemes.filter((s: any) => !matchedSchemes.includes(s));

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans selection:bg-cyan-500/30">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Global Eligibility Engine
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Real-time AI matching based on your profile for {userProfile.targetCountries.join(", ")}.
                    </p>
                </div>

                {/* Profile Context Card */}
                {user ? (
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4 min-w-[300px]">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xl font-bold">
                            {userProfile.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                {userProfile.name} <span className="text-xs bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-900">VERIFIED</span>
                            </h3>
                            <div className="text-xs text-slate-400 mt-1 flex gap-3">
                                <span className="flex items-center gap-1"><GraduationCap size={12} /> {userProfile.cgpa} CGPA</span>
                                <span className="flex items-center gap-1"><BadgeIndianRupee size={12} /> {(userProfile.annualFamilyIncome / 100000)}L Income</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleMockLogin}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
                    >
                        <User size={18} />
                        Login to Sync Profile
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: Stats & Filters (Span 4) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Funding Coverage Visual */}
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-slate-200 mb-2">Typical Coverage</h3>
                        <p className="text-xs text-slate-500 mb-4">Breakdown of what top tier government schemes cover.</p>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={fundingData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {fundingData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Eligibility Stats */}
                    <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="text-green-400" size={24} />
                            <h3 className="text-xl font-bold text-white">Profile Strength</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300">Academic Score</span>
                                    <span className="text-green-400 font-mono">92/100</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }} animate={{ width: "92%" }}
                                        className="h-full bg-green-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300">Financial Aid Eligibility</span>
                                    <span className="text-cyan-400 font-mono">HIGH</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }} animate={{ width: "85%" }}
                                        className="h-full bg-cyan-500"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    Your family income category (&lt;8LPA) qualifies you for maximum central govt. support.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Scheme Cards (Span 8) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Target className="text-cyan-400" /> Matched Opportunities
                        </h2>
                        <span className="bg-cyan-900/30 text-cyan-400 text-xs px-3 py-1 rounded-full border border-cyan-900/50">
                            {matchedSchemes.length} Best Fits
                        </span>
                    </div>

                    <div className="space-y-4">
                        {matchedSchemes.slice(0, visibleMatches).map((scheme: any, idx: number) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={scheme.id}
                                className="group relative bg-white/5 hover:bg-white/[0.07] backdrop-blur-sm border border-white/10 hover:border-cyan-500/30 rounded-xl p-6 transition-all duration-300"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Bookmark className="text-slate-400 hover:text-cyan-400 cursor-pointer" size={20} />
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left: Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/50">
                                                {scheme.criteria.max_income ? `Income < ${(scheme.criteria.max_income / 100000)}L` : 'Merit Based'}
                                            </span>
                                            <span className="text-xs text-slate-500">• {scheme.type}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                            {scheme.name}
                                        </h3>
                                        <p className="text-sm text-slate-400 mb-4">{scheme.provider}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded flex items-center gap-1">
                                                <CheckCircle2 size={10} className="text-cyan-500" /> {scheme.benefit}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex flex-col items-end justify-between min-w-[120px] border-l border-white/5 pl-6 md:pl-6 pt-4 md:pt-0">
                                        <div className="text-right mb-4">
                                            <span className="block text-[10px] text-slate-500 uppercase tracking-widest">DEADLINE</span>
                                            <span className="text-sm font-mono text-white">{scheme.deadline}</span>
                                        </div>
                                        <button className="flex items-center gap-2 text-sm font-bold text-cyan-400 bg-cyan-950/30 hover:bg-cyan-900/50 px-4 py-2 rounded-lg border border-cyan-900/50 w-full justify-center transition-colors">
                                            Apply Now <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination for Matches */}
                    {matchedSchemes.length > 4 && (
                        <div className="flex justify-center mt-4">
                            {visibleMatches < matchedSchemes.length ? (
                                <button
                                    onClick={handleShowMoreMatches}
                                    className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                                >
                                    View {Math.min(4, matchedSchemes.length - visibleMatches)} More Matches
                                </button>
                            ) : (
                                <button
                                    onClick={handleShowLessMatches}
                                    className="text-sm text-slate-500 hover:text-white underline underline-offset-4"
                                >
                                    Show Less
                                </button>
                            )}
                        </div>
                    )}

                    {/* Other Opportunities Section */}
                    {otherSchemes.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <h3 className="text-lg font-semibold text-slate-400 mb-4">Other Opportunities (Eligibility Check Required)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {otherSchemes.slice(0, visibleOthers).map((scheme: any) => (
                                    <div key={scheme.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-4 opacity-60 hover:opacity-100 transition-opacity">
                                        <h4 className="font-bold text-slate-300">{scheme.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1">Min Marks: {scheme.criteria.min_marks}%</p>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination for Others */}
                            {otherSchemes.length > 6 && (
                                <div className="flex justify-center mt-6">
                                    {visibleOthers < otherSchemes.length ? (
                                        <button
                                            onClick={handleShowMoreOthers}
                                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300 hover:bg-white/10 transition-colors"
                                        >
                                            Load More Opportunities ({otherSchemes.length - visibleOthers} remaining)
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleShowLessOthers}
                                            className="text-xs text-slate-500 hover:text-slate-300"
                                        >
                                            Collapse List
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default EligibilityDashboard;
