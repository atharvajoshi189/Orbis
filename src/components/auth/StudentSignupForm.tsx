"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Phone, Lock, Calendar, BookOpen,
    ArrowRight, ArrowLeft, GraduationCap, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "./AuthLayout";
import { useAppStore } from "@/lib/store";
import { supabase } from "@/utils/supabase/client";

export default function StudentSignupForm() {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const { login } = useAppStore();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        currentYear: "",
        pastRecords: "",
    });
    const [error, setError] = useState("");

    const validateStep = (currentStep: number) => {
        setError("");
        if (currentStep === 1) {
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
                setError("Please fill in all basic information fields.");
                return false;
            }
        }
        if (currentStep === 2) {
            if (!formData.currentYear) {
                setError("Please select your current year.");
                return false;
            }
        }
        if (currentStep === 3) {
            if (!formData.password || !formData.confirmPassword) {
                setError("Please create a password.");
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match.");
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };
    const handleBack = () => {
        setError("");
        setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent submission if not on final step (handles Enter key press)
        if (step < 3) {
            handleNext();
            return;
        }

        if (!validateStep(3)) return;

        console.log("Signup Data:", formData);
        setError("");

        try {
            // 1. Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        phone: formData.phone, // Optional: Store in metadata too
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("No user returned from signup");

            // Profile is created automatically via Database Trigger now.

            // Check if we have an active session (Auto-login)
            if (authData.session) {
                alert("Account created and logged in! Welcome to Orbis.");
                router.push("/");
            } else {
                // Email confirmation required
                alert("Account created! Please check your email to confirm your account, then you will be logged in.");
                router.push("/");
            }



        } catch (err: any) {
            console.error("Signup Error:", err);
            setError(err.message || "Failed to create account. Please try again.");
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 20 : -20,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 20 : -20,
            opacity: 0,
        }),
    };

    const getStepInfo = () => {
        switch (step) {
            case 1: return { title: "Basic Information", subtitle: "Let's start with your personal details" };
            case 2: return { title: "Education Details", subtitle: "Tell us about your academic journey" };
            case 3: return { title: "Security & Privacy", subtitle: "Secure your account and review terms" };
            default: return { title: "Create Account", subtitle: "Join the student community today" };
        }
    };

    const { title, subtitle } = getStepInfo();

    return (
        <AuthLayout
            title={title}
            subtitle={subtitle}
        >
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4 relative">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center relative z-10 w-full">
                            <button
                                type="button"
                                onClick={() => i < step && setStep(i)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 shadow-lg ${step >= i
                                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                    : "bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-gray-500 border border-slate-200 dark:border-white/10"
                                    } ${i < step ? "cursor-pointer hover:bg-blue-500 hover:scale-110 active:scale-95" : "cursor-default"}`}
                                title={i < step ? `Back to step ${i}` : ""}
                            >
                                {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                            </button>
                        </div>
                    ))}
                    {/* Progress Bar Background */}
                    <div className="absolute top-5 left-[calc(16.66%)] right-[calc(16.66%)] h-1 bg-slate-200 dark:bg-white/10 -z-0 rounded-full" />
                    {/* Active Progress Bar */}
                    <div
                        className="absolute top-5 left-[calc(16.66%)] h-1 bg-blue-600 transition-all duration-500 -z-0 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                        style={{ width: step === 1 ? '0%' : step === 2 ? '33.33%' : '66.66%' }}
                    />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest px-1">
                    {["Basic", "Education", "Security"].map((label, i) => {
                        const stepNum = i + 1;
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => stepNum < step && setStep(stepNum)}
                                className={`transition-colors duration-300 w-full text-center ${stepNum <= step ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-gray-500"} ${stepNum < step ? "hover:text-blue-500 dark:hover:text-blue-300 cursor-pointer" : "cursor-default"}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-500 text-sm text-center mb-4 font-bold">
                        {error}
                    </div>
                )}
                <AnimatePresence mode="wait" custom={step}>
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 ml-1 uppercase tracking-wider">First Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="text"
                                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-medium"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 ml-1 uppercase tracking-wider">Last Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="text"
                                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-medium"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 ml-1 uppercase tracking-wider">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="email"
                                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-medium"
                                        placeholder="student@university.edu"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 ml-1 uppercase tracking-wider">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="tel"
                                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-medium"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 ml-1 uppercase tracking-wider">Current Year / Grade</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                    <select
                                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-all text-sm appearance-none font-medium"
                                        value={formData.currentYear}
                                        onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                                    >
                                        <option value="" className="bg-white dark:bg-[#0a0f1e] text-slate-500">Select Year</option>
                                        <option value="freshman" className="bg-white dark:bg-[#0a0f1e]">Freshman (1st Year)</option>
                                        <option value="sophomore" className="bg-white dark:bg-[#0a0f1e]">Sophomore (2nd Year)</option>
                                        <option value="junior" className="bg-white dark:bg-[#0a0f1e]">Junior (3rd Year)</option>
                                        <option value="senior" className="bg-white dark:bg-[#0a0f1e]">Senior (4th Year)</option>
                                        <option value="grad" className="bg-white dark:bg-[#0a0f1e]">Graduate Student</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 ml-1 uppercase tracking-wider">Past Records / Achievements</label>
                                <div className="relative group">
                                    <BookOpen className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                    <textarea
                                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-all text-sm min-h-[100px] resize-none font-medium"
                                        placeholder="Briefly describe your academic background or paste a link to your portfolio..."
                                        value={formData.pastRecords}
                                        onChange={(e) => setFormData({ ...formData, pastRecords: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Create Password</h3>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Secure your account with a strong password</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 ml-1 uppercase tracking-wider">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="password"
                                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-medium"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 ml-1 uppercase tracking-wider">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="password"
                                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-medium"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start space-x-2 mt-4">
                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-gray-600 bg-white dark:bg-white/5 checked:bg-blue-600 dark:checked:bg-blue-500 transition-colors shadow-sm" />
                                <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wide leading-relaxed">
                                    I agree to the <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors underline decoration-blue-500/30">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors underline decoration-blue-500/30">Privacy Policy</Link>.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-3 pt-4">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex-1 py-3 items-center justify-center border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex gap-2 shadow-sm active:scale-95"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95"
                        >
                            Next <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-600 dark:to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            Create Account <GraduationCap className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <p className="text-center text-sm text-slate-500 dark:text-gray-400 pt-4 font-medium">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-bold transition-colors">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
