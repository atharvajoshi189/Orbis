"use client";

import { Plane, FileCheck, Home, CalendarCheck } from "lucide-react";

const steps = [
    {
        title: "Visa Application",
        desc: "Guidance on F1/Tier 4 slots",
        icon: FileCheck,
        status: "completed"
    },
    {
        title: "Flights & Travel",
        desc: "Student discounts & baggage",
        icon: Plane,
        status: "current"
    },
    {
        title: "Accommodation",
        desc: "Dorms vs Off-campus",
        icon: Home,
        status: "upcoming"
    },
    {
        title: "Arrival Orientation",
        desc: "Bank accounts & Sim cards",
        icon: CalendarCheck,
        status: "upcoming"
    }
];

export default function TravelRoadmap() {
    return (
        <section className="py-20 bg-gray-50 border-y border-gray-100">
            <div className="container-custom mx-auto">
                <div className="mb-16">
                    <span className="text-primary font-bold tracking-wide uppercase text-sm">Your Journey</span>
                    <h2 className="text-3xl font-bold text-gray-900 mt-2">Travel & Transition Roadmap</h2>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-[45px] left-0 w-full h-0.5 bg-gray-200 -z-10" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            const isCompleted = step.status === "completed";
                            const isCurrent = step.status === "current";

                            return (
                                <div key={i} className="relative bg-white md:bg-transparent p-6 md:p-0 rounded-xl shadow-sm md:shadow-none border border-gray-100 md:border-none flex items-center md:block gap-4">
                                    <div className={`
                                w-24 h-24 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 z-10 bg-white shrink-0
                                ${isCompleted ? 'border-secondary text-secondary' : isCurrent ? 'border-primary text-primary' : 'border-gray-200 text-gray-300'}
                            `}>
                                        <Icon className="w-10 h-10" />
                                    </div>

                                    <div className="md:mt-6">
                                        <h3 className={`font-bold text-lg ${isCurrent ? 'text-primary' : 'text-gray-900'}`}>{step.title}</h3>
                                        <p className="text-sm text-gray-500">{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Checklist Preview */}
                    <div className="mt-12 bg-white p-6 rounded-xl border border-gray-200 max-w-2xl mx-auto shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-400" />
                            Pending Action Items
                        </h4>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                <input type="checkbox" className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" checked readOnly />
                                <span className="text-gray-400 line-through">Book Biometrics Appointment</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                <input type="checkbox" className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
                                <span className="text-gray-700 font-medium">Upload Flight Itinerary</span>
                                <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Due Today</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                <input type="checkbox" className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
                                <span className="text-gray-700">Purchase Travel Insurance</span>
                            </label>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
