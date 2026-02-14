"use client";

import { GraduationCap, ArrowRight, Award, Landmark } from "lucide-react";
import Link from "next/link";

const scholarships = [
    {
        name: "Fulbright-Nehru Master's Fellowship",
        amount: "Full Funding",
        country: "USA",
        deadline: "May 2026",
        icon: Award,
        color: "bg-blue-50 text-blue-600"
    },
    {
        name: "Chevening Scholarship",
        amount: "Full Tuition + Stipend",
        country: "UK",
        deadline: "Nov 2026",
        icon: Landmark,
        color: "bg-red-50 text-red-600"
    },
    {
        name: "DAAD Scholarship",
        amount: "€861/month",
        country: "Germany",
        deadline: "Oct 2026",
        icon: GraduationCap,
        color: "bg-yellow-50 text-yellow-600"
    }
];

export default function Scholarships() {
    return (
        <section className="py-24 bg-white" id="scholarships">
            <div className="container-custom mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Financial Aid & Scholarships</h2>
                        <p className="text-gray-500 max-w-xl">
                            Explore curated opportunities tailored for Indian students.
                        </p>
                    </div>
                    <Link href="/scholarships" className="text-[#1A73E8] font-bold hover:text-blue-800 flex items-center gap-2 transition-colors">
                        View all opportunities <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {scholarships.map((sch) => {
                        const Icon = sch.icon;
                        return (
                            <div key={sch.name} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-soft hover:shadow-card-hover transition-all group flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 ${sch.color} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-wider">{sch.country}</span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-[#1A73E8] transition-colors">{sch.name}</h3>
                                <p className="text-sm text-gray-500 font-medium mb-8">Deadline: {sch.deadline}</p>

                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-sm font-bold text-green-600">{sch.amount}</span>
                                    <a href="#" className="text-sm font-bold text-[#1A73E8] hover:underline flex items-center gap-1">
                                        Check Eligibility
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
