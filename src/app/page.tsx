"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, TrendingUp, ShieldCheck, Cpu, Building2, GraduationCap, Zap, BarChart4, Users, CreditCard, AlertTriangle, Sun, Moon } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Progress } from "@/components/ui/progress";
import { useRef, useState, useEffect } from "react";
import SolarSystem3D from "@/components/SolarSystem3D";
import AuroraBackground3D from "@/components/AuroraBackground3D";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import LiveTicker from "@/components/LiveTicker";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const starsY1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const starsY2 = useTransform(scrollY, [0, 1000], [0, 500]);
  const { theme, toggleTheme } = useAppStore();

  // Sync theme with document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle scroll for navbar appearance (if needed)

  return (
    <div className="flex min-h-screen flex-col font-sans selection:bg-primary/30 relative text-slate-900 dark:text-white transition-colors duration-300">
      {/* Parallax Starfield Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {theme === 'dark' && (
          <>
            <motion.div
              style={{ y: starsY1 }}
              className="absolute inset-0 bg-[url('/stars-sm.svg')] opacity-30"
            />
            <motion.div
              style={{ y: starsY2 }}
              className="absolute inset-0 bg-[url('/stars-lg.svg')] opacity-50"
            />
            <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse" />
            <div className="absolute top-40 right-40 w-1.5 h-1.5 bg-blue-200 rounded-full opacity-30 animate-pulse delay-700" />
            <div className="absolute bottom-20 left-1/2 w-1 h-1 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000" />
          </>
        )}
      </div>

      <Navbar />

      <AuroraBackground3D />

      <main className="flex-1 pt-16 relative z-10">
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="container-custom relative z-10 px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col justify-center space-y-8"
              >
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-xl w-fit">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                  <TextDecode text="System Online v2.4" />
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter text-slate-900 dark:text-white sm:text-6xl xl:text-7xl/none">
                    Choose Your <span className="text-primary drop-shadow-[0_0_10px_rgba(0,113,227,0.3)] dark:drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">Career Strategy</span>, <br />
                    Not Just a University.
                  </h1>
                  <p className="max-w-[600px] text-lg text-slate-600 dark:text-muted-foreground md:text-xl">
                    AI-powered Career & Financial Intelligence. Analyze risks, calculate ROI, and simulate your future before you commit.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/signup">
                      <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all hover:scale-105 h-12 px-8 text-base">
                        Start Mission <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Button variant="glass" size="lg" className="h-12 px-8 text-base">
                      Explore Global Trends
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Trusted by 15,000+ Students</span>
                    <span className="h-3 w-[1px] bg-white/10" />
                    <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> 27 Countries Tracked</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative mx-auto w-full h-[600px] flex items-center justify-center -mt-40 md:-mt-32"
              >
                <SolarSystem3D />
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- LIVE TICKER --- */}
        <LiveTicker />


        {/* --- GLOBAL MARKET SIGNALS (Enhanced) --- */}
        <section id="market-signals" className="py-20 relative overflow-hidden bg-slate-50 dark:bg-black/20">
          <div className="container-custom px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-white sm:text-4xl">Global Market Intelligence</h2>
                <p className="text-muted-foreground mt-2">Real-time data streams from key education destinations.</p>
              </div>
              <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary">
                View Full Heatmap <Globe className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <MarketCard
                country="Germany"
                flag="🇩🇪"
                trends={[
                  { label: "Tech Demand", value: "+18%", trend: "up", color: "text-green-500" },
                  { label: "Visa Approval", value: "74%", trend: "neutral", color: "text-yellow-500" },
                  { label: "Avg Salary", value: "€62k", trend: "up", color: "text-blue-500" },
                  { label: "Tuition Cost", value: "€0", trend: "stable", color: "text-green-500" },
                ]}
              />
              <MarketCard
                country="Canada"
                flag="🇨🇦"
                trends={[
                  { label: "PR Difficulty", value: "High", trend: "down", color: "text-red-500" },
                  { label: "Job Market", value: "Recovering", trend: "up", color: "text-green-500" },
                  { label: "Visa Approval", value: "65%", trend: "down", color: "text-orange-500" },
                  { label: "Avg Salary", value: "C$75k", trend: "up", color: "text-blue-500" },
                ]}
              />
              <MarketCard
                country="USA"
                flag="🇺🇸"
                trends={[
                  { label: "H-1B Cap", value: "Reached", trend: "down", color: "text-red-500" },
                  { label: "STEM OPT", value: "3 Years", trend: "stable", color: "text-green-500" },
                  { label: "Avg Salary", value: "$95k", trend: "up", color: "text-green-500" },
                  { label: "Tech Jobs", value: "High", trend: "up", color: "text-blue-500" },
                ]}
              />
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

function MarketCard({ country, flag, trends }: { country: string, flag: string, trends: any[] }) {
  return (
    <MarketCardTiltWrapper>
      <div className="h-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 hover:shadow-md dark:hover:bg-white/10 transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{flag}</span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{country}</h3>
          </div>
          <Badge variant="outline" className="text-xs uppercase tracking-widest border-primary/30 text-primary">Live</Badge>
        </div>
        <div className="space-y-4">
          {trends.map((t, i) => (
            <div key={i} className="flex items-center justify-between pb-2 border-b border-white/5 last:border-0 last:pb-0">
              <span className="text-sm text-muted-foreground">{t.label}</span>
              <div className="text-right">
                <span className={`block font-bold ${t.color}`}>{t.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MarketCardTiltWrapper>
  )
}

function StatBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-white">{label}</span>
        <span className="text-muted-foreground">{value}/100</span>
      </div>
      <Progress value={value} className="h-1.5" indicatorColor={color} />
    </div>
  )
}

function HolographicBar({ label, value, color = "bg-primary", height = "h-3" }: { label?: string, value: number, color?: string, height?: string }) {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div className={`relative ${height} w-full rounded-full bg-black/50 border border-white/10 overflow-hidden backdrop-blur-sm group`}>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
        {/* Liquid Fill */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`relative h-full ${color} shadow-[0_0_15px_currentColor]`}
        >
          {/* Bubbles/Segment effect */}
          <div className="absolute top-0 right-0 bottom-0 w-full bg-linear-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] animate-shimmer opacity-50" />
        </motion.div>
      </div>
    </div>
  );
}


// --- NEW WOW COMPONENTS ---

function FloatingMicroData({ label, value, top, left, right, bottom, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="absolute z-20 flex items-center gap-2 px-2 py-1 rounded bg-black/80 border border-primary/30 text-[9px] font-mono text-primary shadow-[0_0_10px_rgba(0,243,255,0.2)] pointer-events-none"
      style={{ top, left, right, bottom }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      <span className="opacity-70">{label}:</span>
      <span className="font-bold text-white">{value}</span>
    </motion.div>
  );
}

function TextDecode({ text, className }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return text[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText}</span>;
}

// Simplified Tilt for Market Cards (Mouse Move based)
function MarketCardTiltWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 2; // -1 to 1
    const yPct = (mouseY / height - 0.5) * 2; // -1 to 1
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const rotateX = useTransform(y, [-1, 1], [15, -15]); // Inverted for natural tilt
  const rotateY = useTransform(x, [-1, 1], [-15, 15]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="perspective-1000"
    >
      {children}
    </motion.div>
  )
}

function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(14, 165, 233, 0.15), transparent 40%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

