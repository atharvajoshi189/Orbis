"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Globe, Building2, User } from "lucide-react";

export default function InsightsEngine() {
    const [step, setStep] = useState(1);

    return (
        <section className="py-20 bg-gradient-to-b from-[#F0F7FF] to-white">
            <div className="container-custom mx-auto">
                <div className="max-w-3xl mx-auto glass-card-premium overflow-hidden p-[40px]">

                    {/* Progress Bar */}
                    <div className="h-1.5 bg-gray-100 w-full mb-8 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#1A73E8] transition-all duration-500 rounded-full"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>

                    <div className="">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Tell us about yourself</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                            <input type="text" className="w-full input-premium text-gray-800 placeholder:text-gray-400" placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Current Status</label>
                                            <select className="w-full input-premium text-gray-800 bg-white">
                                                <option>Select Year</option>
                                                <option>3rd Year Undergrad</option>
                                                <option>Final Year Undergrad</option>
                                                <option>Working Professional</option>
                                                <option>Looking for Masters</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button onClick={() => setStep(2)} className="px-8 py-3 bg-[#1A73E8] text-white rounded-full font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all flex items-center gap-2">
                                            Continue <ChevronRight className="w-4 h-4" />
                                        </button>
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
                                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Academic Background</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">CGPA / Percentage</label>
                                            <input type="number" className="w-full input-premium text-gray-800 placeholder:text-gray-400" placeholder="e.g. 9.0" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Stream</label>
                                            <select className="w-full input-premium text-gray-800 bg-white">
                                                <option>Select Stream</option>
                                                <option>Computer Science</option>
                                                <option>Electronics</option>
                                                <option>Mechanical</option>
                                                <option>Civil</option>
                                                <option>Business / Management</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-between pt-4">
                                        <button onClick={() => setStep(1)} className="px-6 py-3 text-gray-500 font-medium hover:text-gray-900 transition-colors">
                                            Back
                                        </button>
                                        <button onClick={() => setStep(3)} className="px-8 py-3 bg-[#1A73E8] text-white rounded-full font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all flex items-center gap-2">
                                            See Results <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                                            <User className="w-8 h-8 text-[#1A73E8]" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Your Personalized Insights</h2>
                                        <p className="text-gray-500 mt-2">Based on your profile, we found highly compatible opportunities.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Abroad Opportunities */}
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider text-center text-gray-400">Global</h3>
                                            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-soft hover:shadow-card-hover transition-all cursor-pointer group">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-lg">S</div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 group-hover:text-[#1A73E8] transition-colors">Stanford University</h4>
                                                        <p className="text-xs text-gray-500">USA • M.S. CS</p>
                                                    </div>
                                                    <span className="ml-auto text-xs font-bold text-[#34A853] bg-green-50 px-2.5 py-1 rounded-full">98% Match</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#34A853] w-[98%] rounded-full" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Local Opportunities */}
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider text-center text-gray-400">Domestic</h3>
                                            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-soft hover:shadow-card-hover transition-all cursor-pointer group">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">B</div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 group-hover:text-[#1A73E8] transition-colors">Bangalore Tech Hub</h4>
                                                        <p className="text-xs text-gray-500">India • Senior Dev</p>
                                                    </div>
                                                    <span className="ml-auto text-xs font-bold text-[#1A73E8] bg-blue-50 px-2.5 py-1 rounded-full">High Demand</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#1A73E8] w-[85%] rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center pt-8 border-t border-gray-100">
                                        <button onClick={() => setStep(1)} className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">Start New Analysis</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
