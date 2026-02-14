"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/utils/supabase/client";

export default function InsightsPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        status: "Grade 12",
        cgpa: "",
        targetCountry: "",
        careerGoal: "High-Paying Job",
        email: "",
        password: ""
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSignUp = async () => {
        setLoading(true);

        // 1. Sign Up User
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        });

        if (authError) {
            alert("Signup Error: " + authError.message);
            setLoading(false);
            return;
        }

        if (authData.user) {
            // 2. Insert Profile Data
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: authData.user.id,
                        full_name: formData.fullName,
                        current_status: formData.status,
                        cgpa: formData.cgpa,
                        target_country: formData.targetCountry,
                        career_goal: formData.careerGoal,
                        email: formData.email
                    }
                ]);

            if (profileError) {
                console.error("Profile Creation Error:", profileError);
                // Continue anyway as auth succeeded
            }

            // 3. Redirect
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1000);
        }
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            handleSignUp();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl">
                    {/* Progress Bar */}
                    <div className="flex justify-between mb-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex flex-col items-center gap-2">
                                <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                            ${step >= s ? 'bg-[#1A73E8] text-white shadow-lg shadow-blue-500/30' : 'bg-white text-slate-300 border border-slate-200'}
                        `}>
                                    {step > s ? <Check size={18} /> : s}
                                </div>
                                <span className={`text-xs font-medium uppercase tracking-wider ${step >= s ? 'text-[#1A73E8]' : 'text-slate-300'}`}>
                                    {s === 1 ? 'Profile' : s === 2 ? 'Goals' : 'Account'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Card */}
                    <motion.div
                        layout
                        className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100"
                    >
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-bold text-slate-900">Let's build your profile</h2>
                                        <p className="text-slate-400">We need a few details to calculate your admission probability.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
                                            <input
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                type="text"
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#1A73E8] outline-none transition"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Current Status</label>
                                                <select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#1A73E8] outline-none transition appearance-none"
                                                >
                                                    <option>Grade 12</option>
                                                    <option>Undergrad</option>
                                                    <option>Working</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">CGPA / %</label>
                                                <input
                                                    name="cgpa"
                                                    value={formData.cgpa}
                                                    onChange={handleChange}
                                                    type="number"
                                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#1A73E8] outline-none transition"
                                                    placeholder="9.0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-bold text-slate-900">Your Ambitions</h2>
                                        <p className="text-slate-400">Tell us where you want to go and what you want to achieve.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Target Country</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['USA', 'UK', 'Germany', 'Canada', 'Australia', 'Other'].map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => setFormData({ ...formData, targetCountry: c })}
                                                        className={`p-3 rounded-xl border transition font-medium
                                                    ${formData.targetCountry === c
                                                                ? 'bg-blue-50 border-[#1A73E8] text-[#1A73E8] ring-2 ring-[#1A73E8]'
                                                                : 'border-slate-200 text-slate-600 hover:border-[#1A73E8] hover:bg-blue-50'
                                                            }
                                                `}
                                                    >
                                                        {c}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Career Goal</label>
                                            <select
                                                name="careerGoal"
                                                value={formData.careerGoal}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#1A73E8] outline-none transition appearance-none"
                                            >
                                                <option>High-Paying Job</option>
                                                <option>Research & PhD</option>
                                                <option>Entrepreneurship</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-bold text-slate-900">Secure Your Account</h2>
                                        <p className="text-slate-400">Create a secure login to save your insights and track progress.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                type="email"
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#1A73E8] outline-none transition"
                                                placeholder="atharva@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Create Password</label>
                                            <input
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                type="password"
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#1A73E8] outline-none transition"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    {loading && (
                                        <div className="flex justify-center items-center py-4 text-[#1A73E8] font-bold">
                                            <div className="w-5 h-5 border-2 border-blue-200 border-t-[#1A73E8] rounded-full animate-spin mr-2" />
                                            Creating Account...
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!loading && (
                            <button
                                onClick={handleNext}
                                className="w-full mt-8 bg-[#1A73E8] text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                {step === 3 ? 'Generate Dashboard' : 'Next Step'} <ChevronRight size={20} />
                            </button>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
