"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { studentService, Student, appointmentService } from "@/services/mockDataService";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Search, Filter, AlertCircle, FileText, UserCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [auditLog, setAuditLog] = useState<{ id: string, action: string, time: string }[]>([]);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        const data = await studentService.getAllStudents();
        setStudents(data);
        setLoading(false);
    };

    const handleValidate = async (studentId: string, name: string) => {
        // Simulate real-time validation logic
        const newLog = {
            id: Date.now().toString(),
            action: `Validated Roadmap for ${name}`,
            time: new Date().toLocaleTimeString()
        };
        setAuditLog(prev => [newLog, ...prev]);

        // In a real app, this would trigger a Supabase Realtime event
        // toast.success(`Plan validated for ${name}`);
    };

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
        if (filter === "urgent") return matchesSearch && s.gpa < 3.0; // Mock logic for urgent
        if (filter === "high_roi") return matchesSearch && s.gpa > 3.8;
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black font-sans transition-colors duration-300">
            <Navbar />

            <div className="container-custom mx-auto py-10 px-4">

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
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Main Table */}
                    <div className="lg:col-span-3 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                                <tr>
                                    <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-sm">Student Name</th>
                                    <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-sm">GPA / Budget</th>
                                    <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-sm">Career Goal</th>
                                    <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-sm">AI Recommendation</th>
                                    <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading students...</td></tr>
                                ) : filteredStudents.map((student) => (
                                    <tr key={student.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{student.target_country}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-slate-700 dark:text-slate-300 font-mono">{student.gpa.toFixed(1)} GPA</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">${(student.budget / 1000)}k Budget</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg border border-blue-100 dark:border-blue-900/50">
                                                {student.career_goals[0]}
                                            </span>
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <div className="flex items-start gap-2">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                                                    Suggesting {student.target_country} for high ROI based on {student.gpa > 3.5 ? 'strong academics' : 'budget constraints'}.
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-500 hover:bg-green-600 text-white gap-1 h-8 px-3"
                                                    onClick={() => handleValidate(student.id, student.name)}
                                                >
                                                    <Check size={14} /> Validate
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                                    <FileText size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                                <AlertCircle size={18} /> Daily Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{students.length}</div>
                                    <div className="text-xs text-blue-600 dark:text-blue-500 uppercase">Total Students</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{auditLog.length}</div>
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
