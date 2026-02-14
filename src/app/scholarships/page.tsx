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
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar />

            <div className="container-custom mx-auto py-12">

                {/* Header & Search */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-6">Find Your Funding</h1>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, country, or amount..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 ring-blue-500 outline-none shadow-sm"
                                value={search} onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            {['All', 'Government', 'University', 'Private', 'Merit'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition border ${filter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
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
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">{s.type}</span>
                                <span className="text-slate-400 font-bold text-xs">{s.country}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{s.title}</h3>

                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                                <span className="flex items-center gap-1"><DollarSign size={14} /> {s.amount}</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> {s.deadline}</span>
                            </div>

                            <button className="w-full py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-900 hover:text-white transition">Check Eligibility</button>
                        </div>
                    ))}
                </div>

                {/* Visa Roadmap */}
                <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <Plane className="text-blue-400" /> Visa & Travel Roadmap
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {['Accept Offer', 'Pay Deposit', 'Book Visa Slot', 'Flight Ticket'].map((step, i) => (
                                <div key={step} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                                    <span className="block text-4xl font-black text-white/20 mb-2">0{i + 1}</span>
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
