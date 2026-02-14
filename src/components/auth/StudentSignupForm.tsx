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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent submission if not on final step (handles Enter key press)
        if (step < 3) {
            handleNext();
            return;
        }

        if (!validateStep(3)) return;

        console.log("Signup Data:", formData);

        // Simulate registration (no auto-login)
        // In a real app, we would send data to backend here

        router.push("/login");
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
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center relative z-10 w-full">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= i
                                    ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                    : "bg-white/10 text-gray-500 border border-white/10"
                                    }`}
                            >
                                {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
                            </div>
                        </div>
                    ))}
                    {/* Progress Bar Background */}
                    <div className="absolute top-[138px] left-[calc(50%-140px)] w-[280px] h-0.5 bg-white/10 -z-0" />
                    {/* Active Progress Bar */}
                    {/* Note: Hardcoded positioning for typical 3-step, ideally dynamic but fine for now */}
                    <div
                        className="absolute top-[138px] left-[calc(50%-140px)] h-0.5 bg-blue-600 transition-all duration-300 -z-0"
                        style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 px-2 mt-1">
                    <span>Basic</span>
                    <span>Education</span>
                    <span>Security</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center mb-4">
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
                                    <label className="text-xs font-medium text-gray-400 ml-1">First Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1">Last Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="email"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm"
                                        placeholder="student@university.edu"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="tel"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm"
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
                                <label className="text-xs font-medium text-gray-400 ml-1">Current Year / Grade</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm appearance-none"
                                        value={formData.currentYear}
                                        onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                                    >
                                        <option value="" className="bg-gray-900 text-gray-500">Select Year</option>
                                        <option value="freshman" className="bg-gray-900">Freshman (1st Year)</option>
                                        <option value="sophomore" className="bg-gray-900">Sophomore (2nd Year)</option>
                                        <option value="junior" className="bg-gray-900">Junior (3rd Year)</option>
                                        <option value="senior" className="bg-gray-900">Senior (4th Year)</option>
                                        <option value="grad" className="bg-gray-900">Graduate Student</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1">Past Records / Achievements</label>
                                <div className="relative group">
                                    <BookOpen className="absolute left-3 top-3 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm min-h-[100px] resize-none"
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
                                <h3 className="text-lg font-semibold text-white">Create Password</h3>
                                <p className="text-xs text-gray-400">Secure your account with a strong password</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="password"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="password"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start space-x-2 mt-4">
                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-600 bg-white/5 checked:bg-blue-500 transition-colors" />
                                <p className="text-xs text-gray-400">
                                    I agree to the <Link href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</Link> and <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-3 pt-2">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex-1 py-3 items-center justify-center border border-white/10 rounded-xl text-white font-medium hover:bg-white/5 transition-colors flex gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex-1 bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                        >
                            Next <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            Create Account <GraduationCap className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <p className="text-center text-sm text-gray-400 pt-2">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
