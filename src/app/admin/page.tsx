"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from "@/utils/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    TrendingUp,
    Users,
    FileText,
    Zap,
    Search,
    Filter,
    Download,
    MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data incase DB is empty for demo
const MOCK_STUDENTS = [
    { id: 1, name: "Aarav Patel", email: "aarav@example.com", stream: "Computer Science", gpa: 9.2, financial_strength: "Solid", score: 94, status: "hot" },
    { id: 2, name: "Zara Khan", email: "zara@example.com", stream: "Psychology", gpa: 7.8, financial_strength: "Moderate", score: 65, status: "warm" },
    { id: 3, name: "Ishaan Gupta", email: "ishaan@example.com", stream: "Finance", gpa: 8.5, financial_strength: "High", score: 88, status: "hot" },
    { id: 4, name: "Meera Singh", email: "meera@example.com", stream: "Architecture", gpa: 6.9, financial_strength: "Low", score: 42, status: "cold" },
    { id: 5, name: "Rohan Das", email: "rohan@example.com", stream: "Data Science", gpa: 9.0, financial_strength: "Solid", score: 91, status: "hot" },
];

export default function AdminDashboard() {
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            // Fetch real data
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Merge with mock if empty for demo purposes (Delete this in production)
            if (!data || data.length === 0) {
                setStudents(MOCK_STUDENTS);
            } else {
                // Determine score if null (Simulate AI scoring for demo)
                const enhancedData = data.map(s => ({
                    ...s,
                    score: s.convertibility_score || (s.gpa ? Math.min(Math.round(parseFloat(s.gpa) * 10), 99) : 0),
                    status: s.lead_status || 'cold'
                }));
                setStudents(enhancedData);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            setStudents(MOCK_STUDENTS); // Fallback to mock
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-500 bg-green-500/10 border-green-500/20";
        if (score >= 70) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
        return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    };

    const filteredStudents = students.filter(s =>
        (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (s.stream?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] text-slate-900 dark:text-white font-sans">
            <Navbar />

            <main className="container-custom mx-auto pt-32 pb-12 px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-4">
                            <Zap size={14} /> B2B Counselor Protocol
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter font-outfit mb-2">
                            Pipeline <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Intelligence</span>
                        </h1>
                        <p className="text-slate-500 font-medium">AI-Driven Lead Scoring & Student Management</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-3xl font-black text-slate-900 dark:text-white">{students.filter(s => s.score >= 90).length}</div>
                            <div className="text-xs font-bold text-green-500 uppercase tracking-widest">Hot Leads</div>
                        </div>
                        <div className="w-px h-12 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
                        <div className="text-right hidden md:block">
                            <div className="text-3xl font-black text-slate-900 dark:text-white">{students.length}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Active</div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar Stats / Actions */}
                    <div className="space-y-6">
                        <Card className="rounded-3xl border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm overflow-hidden">
                            <CardHeader>
                                <CardTitle className="uppercase tracking-widest text-sm font-black text-slate-500">Bulk Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl">
                                    <FileText size={18} /> Process New Docs
                                </Button>
                                <Button variant="outline" className="w-full justify-start gap-2 border-slate-200 dark:border-white/10 h-12 rounded-xl font-bold">
                                    <Download size={18} /> Export Hot Leads
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="rounded-3xl border-slate-200 dark:border-white/10 bg-gradient-to-br from-purple-900/10 to-blue-900/10 overflow-hidden">
                            <CardHeader>
                                <CardTitle className="uppercase tracking-widest text-sm font-black text-purple-500">AI Insights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                                    <span className="font-bold text-slate-900 dark:text-white">Trend Alert:</span> 15% increase in Data Science inquiries. Recommend Germany for high ROI profiles.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Table */}
                    <div className="lg:col-span-3">
                        <Card className="rounded-[2.5rem] border-slate-200 dark:border-white/10 shadow-xl overflow-hidden bg-white dark:bg-[#0A101F]">
                            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or stream..."
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="rounded-xl"><Filter size={20} /></Button>
                                    <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal size={20} /></Button>
                                </div>
                            </div>

                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-white/5">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="font-black uppercase text-xs tracking-widest text-slate-400 pl-8 py-6">Student</TableHead>
                                        <TableHead className="font-black uppercase text-xs tracking-widest text-slate-400 py-6">Stream</TableHead>
                                        <TableHead className="font-black uppercase text-xs tracking-widest text-slate-400 py-6">GPA</TableHead>
                                        <TableHead className="font-black uppercase text-xs tracking-widest text-slate-400 py-6">Convertibility</TableHead>
                                        <TableHead className="font-black uppercase text-xs tracking-widest text-slate-400 pr-8 py-6 text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-50">
                                                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
                                                    <p className="font-bold text-sm uppercase tracking-widest">Crunching Data...</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredStudents.map((student, i) => (
                                        <motion.tr
                                            key={student.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group hover:bg-slate-50 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/5 last:border-0 transition-colors cursor-pointer"
                                        >
                                            <TableCell className="pl-8 py-6 font-medium text-slate-900 dark:text-white">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{student.name}</div>
                                                        <div className="text-xs text-slate-500">{student.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 text-slate-600 dark:text-slate-400 font-medium">
                                                {student.stream || "General"}
                                            </TableCell>
                                            <TableCell className="py-6 font-black text-slate-800 dark:text-slate-200">
                                                {student.gpa || "N/A"}
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 w-24 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${student.score >= 90 ? 'bg-green-500' : student.score >= 70 ? 'bg-yellow-500' : 'bg-slate-400'}`}
                                                            style={{ width: `${student.score}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-black text-sm">{student.score}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-8 py-6 text-right">
                                                <Badge className={`uppercase tracking-widest font-bold px-3 py-1 rounded-lg border-0 shadow-none ${getScoreColor(student.score)}`}>
                                                    {student.status === 'hot' || student.score >= 90 ? 'High Potential' : student.status === 'warm' ? 'Nurturing' : 'Cold'}
                                                </Badge>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </div>

            </main>
        </div>
    );
}
