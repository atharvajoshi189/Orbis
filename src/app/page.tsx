"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronRight, Globe, BarChart3, GraduationCap, Plane, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function OrbisLanding() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-blue-100 flex flex-col">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 flex flex-col items-center text-center px-6 overflow-hidden flex-1">
        <div className="absolute top-0 -z-10 w-full h-full bg-[radial-gradient(circle_at_top_right,_#f0f7ff_0%,_transparent_40%)]" />

        <span className="px-4 py-1.5 bg-blue-50 text-[#1A73E8] rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100">
          AI-Powered Global Guidance
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
          Empowering Your <br className="hidden md:block" />
          <span className="text-[#1A73E8]">Global Engineering Journey</span>
        </h1>
        <p className="max-w-2xl text-lg text-slate-500 mb-10 leading-relaxed">
          Data-driven insights to maximize your career ROI. Compare universities, track visa success rates, and unlock scholarships with Orbis Intelligence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/insights" className="bg-[#1A73E8] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:scale-105 transition active:scale-95 flex items-center justify-center gap-2">
            See Your Insights <ChevronRight size={20} />
          </Link>
          <Link href="/dashboard" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition flex items-center justify-center">
            Explore Dashboard
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
          <FeatureCard
            icon={BarChart3}
            title="ROI Analytics"
            desc="Compare debt vs. income projections for 500+ universities."
            link="/roi"
          />
          <FeatureCard
            icon={GraduationCap}
            title="Scholarships"
            desc="Find government and merit-based aid tailored for you."
            link="/scholarships"
          />
          <FeatureCard
            icon={Globe}
            title="Admission Chances"
            desc="AI-predicted acceptance rates based on your profile."
            link="/dashboard"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, link }: { icon: any, title: string, desc: string, link: string }) {
  return (
    <Link href={link} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#1A73E8] mb-4 group-hover:bg-[#1A73E8] group-hover:text-white transition-colors">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm">{desc}</p>
    </Link>
  )
}
