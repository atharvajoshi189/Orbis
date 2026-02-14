"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Search, Filter, AlertCircle, FileText, UserCheck, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Student {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    target_country: string | null;
    gpa: string | null;
    budget: number | null;
    career_goal: string | null;
    status: string | null;
    skills: string[] | null;
    created_at: string;
}

interface AuditLog {
    id: string;
    action: string;
    time: string;
}

export default function AdminPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [auditLog, setAuditLog] = useState<AuditLog[]>([]);

    useEffect(() => {
        loadStudents();

        // Realtime Subscription
        const channel = supabase
            .channel('public:students')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, (payload) => {
                console.log('Realtime update:', payload);
                if (payload.eventType === 'UPDATE') {
                    setStudents(prev => prev.map(s => s.id === payload.new.id ? { ...s, ...payload.new } as Student : s));
                    toast.info(`Profile updated: ${payload.new.full_name || 'Student'}`);
                } else if (payload.eventType === 'INSERT') {
                    setStudents(prev => [payload.new as Student, ...prev]);
                    toast.success(`New student registered: ${payload.new.full_name}`);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching students:", error);
            toast.error("Failed to load students");
        } else {
            setStudents(data || []);
        }
        setLoading(false);
    };

    const handleValidate = async (studentId: string, name: string) => {
        // Optimistic update
        const newLog = {
            id: Date.now().toString(),
            action: `Validated Roadmap for ${name}`,
            time: new Date().toLocaleTimeString()
        };
        setAuditLog(prev => [newLog, ...prev]);

        const { error } = await supabase
            .from('students')
            .update({ status: 'Validated' })
            .eq('id', studentId);

        if (error) {
            toast.error("Failed to update status");
        } else {
            toast.success(`Plan validated for ${name}`);
            // Local state update handled by Realtime subscription potentially, but safe to update manually too if needed
            // setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'Validated' } : s));
        }
    };

    const calculateReadiness = (student: Student) => {
        let score = 0;
        if (student.gpa && parseFloat(student.gpa) > 3.0) score += 30;
        if (student.target_country) score += 20;
        if (student.skills && student.skills.length > 3) score += 20;
        if (student.career_goal) score += 10;
        if (student.status === 'Validated') score += 20;
        return Math.min(100, score);
    };

    const filteredStudents = students.filter(s => {
        const nameMatch = s.full_name?.toLowerCase().includes(search.toLowerCase()) || false;
        const emailMatch = s.email?.toLowerCase().includes(search.toLowerCase()) || false;
        const matchesSearch = nameMatch || emailMatch;

        if (filter === "urgent") return matchesSearch && (!s.gpa || parseFloat(s.gpa) < 3.0);
        if (filter === "high_roi") return matchesSearch && (s.gpa && parseFloat(s.gpa) > 3.5);
        if (filter === "validated") return matchesSearch && s.status === 'Validated';
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black font-sans transition-colors duration-300">
            <Navbar />

            <div className="container-custom mx-auto py-24 px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <UserCheck className="text-primary" /> Counselor Admin Portal
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage student roadmaps and validate AI suggestions.</p>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 ring-primary outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Students</option>
                            <option value="urgent">Urgent Guidance</option>
                            <option value="high_roi">High Potential</option>
                            <option value="validated">Validated</option>
                        </select>
                        <Button variant="outline" size="icon" onClick={loadStudents} title="Reload Data">
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Main Table */}
                    <div className="lg:col-span-3 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                                    <tr>
                                        <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-sm">Student</th>
                                        <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-sm">Stats</th>
                                        <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-sm">Readiness</th>
                                        <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-sm">Recommendation</th>
                                        <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-sm text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading live data...</td></tr>
                                    ) : filteredStudents.length === 0 ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-slate-500">No students found via Supabase.</td></tr>
                                    ) : filteredStudents.map((student) => {
                                        const readiness = calculateReadiness(student);
                                        return (
                                            <tr key={student.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900 dark:text-white">{student.full_name || "Unknown"}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{student.email}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-slate-700 dark:text-slate-300 font-mono text-sm">{student.gpa || "N/A"} GPA</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        {student.budget ? `$${(student.budget / 1000).toFixed(0)}k` : "No Budget"}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${readiness > 75 ? 'bg-green-500' : readiness > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                                style={{ width: `${readiness}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-500">{readiness}%</span>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 mt-1">{student.status || 'Pending'}</div>
                                                </td>
                                                <td className="p-4 max-w-xs">
                                                    <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg border border-blue-100 dark:border-blue-900/50 inline-block mb-1">
                                                        {student.target_country || "Undecided"}
                                                    </span>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                                        Goal: {student.career_goal || "Not set"}
                                                    </p>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {student.status !== 'Validated' && (
                                                            <Button
                                                                size="sm"
                                                                className="bg-green-500 hover:bg-green-600 text-white gap-1 h-7 px-3 text-xs"
                                                                onClick={() => handleValidate(student.id, student.full_name)}
                                                            >
                                                                <Check size={12} /> Validate
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                                                            <FileText size={12} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sidebar: Audit Log */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Clock className="text-slate-400" size={18} /> Audit Log
                            </h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                {auditLog.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-4">No recent actions.</p>
                                ) : (
                                    auditLog.map((log) => (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex gap-3 items-start"
                                        >
                                            <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                                            <div>
                                                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{log.action}</p>
                                                <p className="text-xs text-slate-400">{log.time}</p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/20">
                            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                                <AlertCircle size={18} /> Live Database
                            </h3>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{students.length}</div>
                                    <div className="text-xs text-blue-600 dark:text-blue-500 uppercase">Total Students</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{students.filter(s => s.status === 'Validated').length}</div>
                                    <div className="text-xs text-green-700 dark:text-green-500 uppercase">Validated</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
