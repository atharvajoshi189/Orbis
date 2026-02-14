"use client";

import React from 'react';
import { GraduationCap, Plane, IndianRupee, BarChart3, ChevronRight, Globe } from 'lucide-react';

export default function OrbisLanding() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-blue-100">

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">O</div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">Orbis</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-500">
            <a href="#hero" className="hover:text-blue-600 transition">Home</a>
            <a href="#scholarships" className="hover:text-blue-600 transition">Scholarships</a>
            <a href="#travel" className="hover:text-blue-600 transition">Travel</a>
            <a href="#roi" className="hover:text-blue-600 transition">ROI Tracker</a>
          </nav>
          <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition shadow-sm">
            Get Started
          </button>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative pt-20 pb-32 flex flex-col items-center text-center px-6 overflow-hidden">
        <div className="absolute top-0 -z-10 w-full h-full bg-[radial-gradient(circle_at_top_right,_#f0f7ff_0%,_transparent_40%)]" />

        <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          Powered by Orbis Intelligence
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
          Your Future, <span className="text-blue-600">Perfectly Planned.</span>
        </h1>
        <p className="max-w-2xl text-lg text-slate-500 mb-10 leading-relaxed">
          Data-driven insights for engineering students. Compare local opportunities with global ambitions to find your highest ROI career path.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:scale-105 transition active:scale-95 flex items-center gap-2">
            See Your Insights <ChevronRight size={20} />
          </button>
          <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition">
            Explore Universities
          </button>
        </div>
      </section>

      {/* --- INSIGHTS FORM SECTION --- */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 md:p-16 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-2xl shadow-lg flex items-center justify-center text-white">
            <GraduationCap size={24} />
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Personalize Your Journey</h2>
            <p className="text-slate-400 font-medium">Provide a few details to see your local & global opportunities.</p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <input type="text" placeholder="e.g. Atharva" className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Current Year</label>
              <select className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none">
                <option>Select Status</option>
                <option>10th Standard</option>
                <option>3rd Year Undergrad</option>
                <option>Graduate</option>
              </select>
            </div>
            <button className="md:col-span-2 bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-600 transition shadow-lg mt-4">
              GENERATE MY PATHWAY
            </button>
          </form>
        </div>
      </section>

      {/* --- SCHOLARSHIPS --- */}
      <section id="scholarships" className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4 text-center md:text-left">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Scholarships & Aid</h2>
              <p className="text-slate-500 text-lg">Curated financial support for Indian Engineering students.</p>
            </div>
            <button className="text-blue-600 font-bold flex items-center gap-1 hover:underline">
              View All <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {['Fulbright-Nehru', 'Chevening', 'DAAD'].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <Globe size={24} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Global Opportunity</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item} Masters Fellowship</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">Full tuition funding and living stipend for top-tier candidates.</p>
                <button className="w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition">Check Eligibility</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRAVEL SECTION --- */}
      <section id="travel" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -z-0" />
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-bold mb-6 flex items-center gap-3 justify-center md:justify-start">
                  <Plane size={32} className="text-blue-400" /> Travel & Logistics
                </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Visa guidance, flight bookings, and arrival support—Orbis ensures you never walk alone in a new country.
                </p>
                <button className="bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30">Get the Roadmap</button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                {['Visa Help', 'Forex', 'Housing', 'SIM Card'].map((tool) => (
                  <div key={tool} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center font-bold">
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 font-medium">© 2026 Orbis Intelligence. Built for the Next Generation.</p>
      </footer>

    </div>
  );
}
