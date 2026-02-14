"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Users, TrendingUp } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative w-full h-[60vh] min-h-[500px] flex items-center bg-gradient-to-b from-white to-[#F0F7FF] overflow-hidden">

            <div className="container-custom mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">

                {/* Left Content */}
                <div className="space-y-8 text-center lg:text-left z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl lg:text-7xl font-bold font-sans text-gray-900 leading-tight mb-6 tracking-tight">
                            Your Gateway to <br />
                            <span className="text-[#1A73E8]">Global Success</span>
                        </h1>
                        <p className="text-xl text-gray-600 font-normal leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Data-driven insights to guide your career journey, from university selection to landing your dream job.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-row justify-center lg:justify-start pt-4"
                    >
                        <button className="px-10 py-4 bg-[#1A73E8] text-white font-bold text-lg rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group">
                            See Your Insights
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                {/* Right Visual - Abstract Illustration Placeholder or simple clean UI element */}
                <div className="relative hidden lg:block h-full flex items-center justify-center pointer-events-none select-none">
                    {/* Simple graphic placeholder using CSS circles/blur to fit the clean aesthetic without assets */}
                    <div className="absolute right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10 translate-x-1/4" />
                    <div className="absolute right-20 top-20 w-[300px] h-[300px] bg-indigo-50/60 rounded-full blur-2xl -z-10" />

                    {/* Floating UI Elements matching the premium theme */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="relative bg-white p-6 rounded-2xl shadow-card-hover border border-gray-50/50 max-w-sm ml-auto mr-12 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-50 rounded-lg text-[#1A73E8]">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Top 1% Matches</h3>
                                <p className="text-sm text-gray-500">Based on your profile</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <span className="font-medium text-gray-700">Stanford University</span>
                                <span className="text-xs font-bold text-[#34A853] bg-green-100 px-2 py-1 rounded-full">98% Match</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <span className="font-medium text-gray-700">Bangalore Tech Hub</span>
                                <span className="text-xs font-bold text-[#1A73E8] bg-blue-50 px-2 py-1 rounded-full">High Growth</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
