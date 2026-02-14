"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, TrendingUp, ShieldCheck, Cpu, Building2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar for Landing Page */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container-custom flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-tr from-primary to-purple-600 shadow-[0_0_15px_rgba(0,243,255,0.5)]">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white">ORBIS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Mission
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Intelligence
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="neon" className="font-bold">
                Launch Console
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="container-custom relative z-10 px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col justify-center space-y-8"
              >
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-xl">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                  System Online v2.4
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-6xl xl:text-7xl/none">
                    Choose Your <span className="text-primary drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">Career Strategy</span>, <br />
                    Not Just a University.
                  </h1>
                  <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                    AI-powered Career & Financial Intelligence Platform. Analyze risks, calculate ROI, and simulate your future before you commit.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all hover:scale-105">
                      Start Mission <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="glass" size="lg">
                    Explore Global Trends
                  </Button>
                </div>
              </motion.div>

              {/* Pseudo-3D Globe Placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative mx-auto aspect-square w-full max-w-[500px]"
              >
                <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary/20 to-purple-500/20 blur-[60px] animate-pulse" />
                <div className="relative h-full w-full rounded-full border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 animate-[spin_20s_linear_infinite]" />
                  <Globe className="h-64 w-64 text-primary/50 animate-pulse" />

                  {/* Floating Info Cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute top-1/4 right-10 p-3 rounded-lg bg-black/60 border border-primary/30 backdrop-blur-md"
                  >
                    <p className="text-xs text-muted-foreground">Admission Probability</p>
                    <p className="text-lg font-bold text-green-400">82%</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="absolute bottom-1/4 left-10 p-3 rounded-lg bg-black/60 border border-purple-500/30 backdrop-blur-md"
                  >
                    <p className="text-xs text-muted-foreground">Avg ROI</p>
                    <p className="text-lg font-bold text-purple-400">3.4x</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Live Data Ticker */}
        <div className="border-y border-white/10 bg-black/30 backdrop-blur-md py-4 overflow-hidden">
          <div className="container-custom flex justify-between items-center text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Profiles Analyzed: <strong className="text-white">15,420</strong></span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <span>AI Prediction Accuracy: <strong className="text-white">94.8%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-500" />
              <span>Countries Tracked: <strong className="text-white">27</strong></span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-20 lg:py-32 relative">
          <div className="absolute top-1/2 left-0 w-full h-[500px] bg-primary/5 -skew-y-3 z-0" />
          <div className="container-custom relative z-10 px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl mb-4">Command Center Capabilities</h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground mb-16 text-lg">Powerful tools to simulate your future and maximize your career ROI.</p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "AI Recommendation Engine", icon: Cpu, desc: "Personalized career pathing based on your unique profile stats." },
                { title: "Govt Job Eligibility", icon: Building2, desc: "Instant matching with government roles and entrance exams." },
                { title: "Loan & ROI Intelligence", icon: TrendingUp, desc: "Calculate break-even points and financial viability." },
                { title: "Risk Simulator", icon: ShieldCheck, desc: "Run scenarios to see how global events affect your career." },
                { title: "Global Trends", icon: Globe, desc: "Real-time data on visa policies and job market demands." },
                { title: "Skill Validation", icon: GraduationCap, desc: "Compare your skills against industry requirements." },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:shadow-2xl hover:border-primary/50"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black py-8">
        <div className="container-custom text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Orbis Intelligence Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
