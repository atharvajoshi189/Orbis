"use client";

import Navbar from "@/components/Navbar";
import { Search, Filter, Calendar, DollarSign, Plane } from "lucide-react";
import { useState } from "react";

const scholarships = [
    { title: "Fulbright-Nehru", amount: "Full Ride", deadline: "May 15, 2026", type: "Government", country: "USA" },
    { title: "Chevening", amount: "£28,000", deadline: "Nov 2, 2026", type: "Government", country: "UK" },
    { title: "DAAD WISE", amount: "€3,000", deadline: "Oct 1, 2026", type: "Merit", country: "Germany" },
    { title: "Stanford Knight-Hennessy", amount: "Full Ride", deadline: "Sep 15, 2026", type: "University", country: "USA" },
    { title: "Tata Scholarship", amount: "Need Based", deadline: "Jan 10, 2027", type: "Private", country: "Global" },
    { title: "Inlaks Shivdasani", amount: "$100,000", deadline: "Mar 30, 2026", type: "Private", country: "Global" },
];

export default function ScholarshipsPage() {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    const filtered = scholarships.filter(s => {
        const matchesType = filter === "All" || s.type === filter;
        const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.country.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <div className="min-h-screen font-sans text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <div className="container-custom mx-auto py-12 px-4">

                {/* Header & Search */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Find Your Funding</h1>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, country, or amount..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:ring-2 ring-blue-500 outline-none shadow-sm transition-colors"
                                value={search} onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            {['All', 'Government', 'University', 'Private', 'Merit'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition border ${filter === f ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scholarships Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {filtered.map((s, i) => (
                        <div key={i} className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">{s.type}</span>
                                <span className="text-slate-400 dark:text-slate-500 font-bold text-xs">{s.country}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-slate-900 dark:text-white">{s.title}</h3>

                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                                <span className="flex items-center gap-1"><DollarSign size={14} /> {s.amount}</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> {s.deadline}</span>
                            </div>

                            <button className="w-full py-3 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">Check Eligibility</button>
                        </div>
                    ))}
                </div>

                {/* Visa Roadmap */}
                <div className="bg-slate-900 dark:bg-slate-900/50 rounded-[3rem] p-12 text-white relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <Plane className="text-blue-400" /> Visa & Travel Roadmap
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {['Accept Offer', 'Pay Deposit', 'Book Visa Slot', 'Flight Ticket'].map((step, i) => (
                                <div key={step} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl group hover:border-blue-500/50 transition-colors">
                                    <span className="block text-4xl font-black text-white/20 mb-2 transition-colors group-hover:text-blue-500/30">0{i + 1}</span>
                                    <h3 className="font-bold text-lg">{step}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
