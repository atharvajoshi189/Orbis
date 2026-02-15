"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "./AuthLayout";
import { useAppStore } from "@/lib/store";
import { supabase } from "@/utils/supabase/client";

export default function StudentLoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { login } = useAppStore();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Restore isLoading

    const handleGuestLogin = () => {
        setIsLoading(true);
        // Simulate a small delay for better UX
        setTimeout(() => {
            login({
                id: 'guest',
                name: 'Guest User',
                email: 'guest@orbis.edu',
                avatar: undefined
            });
            router.push("/dashboard?welcome=true");
        }, 800);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            // 1. Sign in
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Login failed");

            // 2. Fetch Profile
            const { data: profile, error: profileError } = await supabase
                .from('students')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            // If profile doesn't exist (legacy user?), fall back to auth metadata or minimal user
            const userProfile = profile || {
                name: authData.user.user_metadata?.first_name || formData.email.split('@')[0],
                email: formData.email,
            };

            // 3. Update Store
            login({
                name: userProfile.first_name || userProfile.name,
                email: userProfile.email,
                avatar: undefined // Add avatar if needed later
            });

            router.push("/dashboard?welcome=true");

        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message || "Invalid email or password.");
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Log in to access your student portal"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-500 text-sm text-center font-medium">
                        {error}
                    </div>
                )}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-gray-400 ml-1 uppercase tracking-wider">Email or Phone</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="student@university.edu"
                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-all font-medium"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-gray-400 ml-1 uppercase tracking-wider">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-all font-medium"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-gray-600 bg-white dark:bg-white/5 checked:bg-blue-600 dark:checked:bg-blue-500 transition-colors" />
                        <span className="text-slate-500 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-gray-300 transition-colors font-medium">Remember me</span>
                    </label>
                    <Link href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors font-bold">
                        Forgot password?
                    </Link>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-600 dark:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center space-x-2 group"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>Log In</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </motion.button>

                <button
                    type="button"
                    onClick={handleGuestLogin}
                    className="w-full border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white font-bold py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
                    disabled={isLoading}
                >
                    Continue as Guest
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest leading-none">
                        <span className="bg-white dark:bg-[#151a25] px-3 text-slate-400 dark:text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                        <span className="text-slate-900 dark:text-white text-sm font-bold">Google</span>
                    </button>
                    <button type="button" className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                        <span className="text-slate-900 dark:text-white text-sm font-bold">Apple</span>
                    </button>
                </div>

                <p className="text-center text-sm text-slate-500 dark:text-gray-400 pt-4 font-medium">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-bold transition-colors">
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
