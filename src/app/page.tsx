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

  return (
    <div className="flex min-h-screen flex-col font-sans selection:bg-primary/30 relative text-slate-900 dark:text-white transition-colors duration-300">
      {/* Parallax Starfield Background - Visual only, handled by Aurora anyway but kept for structure */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Only show stars in dark mode */}
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

      {/* Navbar for Landing Page */}
      {/* Navbar for Landing Page */}
      <Navbar />

      {/* --- 3D AURORA BACKGROUND --- */}
      <AuroraBackground3D />

      <main className="flex-1 pt-16 relative z-10">
        {/* --- SECTION 1: HERO (Enhanced) --- */}
        <section className="relative overflow-hidden py-20 lg:py-32">
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

                  {/* Trust Strip */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Trusted by 15,000+ Students</span>
                    <span className="h-3 w-[1px] bg-white/10" />
                    <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> 27 Countries Tracked</span>
                    <span className="h-3 w-[1px] bg-white/10" />
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-yellow-500" /> Updated Daily</span>
                  </div>
                </div>
              </motion.div>

              {/* Pseudo-3D Globe Placeholder */}
              {/* Solar System Orbit Visual (3D) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative mx-auto w-full h-[600px] flex items-center justify-center -mt-40 md:-mt-32"
              >
                <SolarSystem3D />
              </motion.div>
            </div>
          </div >
        </section >

        {/* --- SECTION 2: LIVE METRICS STRIP (Enhanced) --- */}
        < div className="border-y border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/30 backdrop-blur-md py-6 overflow-hidden transition-colors duration-300" >
          <div className="container-custom grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-x divide-slate-200 dark:divide-white/5">
            {[
              { label: "Profiles Analyzed", value: "15,420", icon: Users, color: "text-primary" },
              { label: "AI Prediction Accuracy", value: "94.8%", icon: Cpu, color: "text-purple-500" },
              { label: "Countries Tracked", value: "27", icon: Globe, color: "text-blue-400" },
              { label: "Avg Loan Break-even", value: "3.4 Years", icon: CreditCard, color: "text-green-500" },
              { label: "Visa Success Confidence", value: "89%", icon: ShieldCheck, color: "text-yellow-500" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-1 group">
                <div className={`p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors mb-1`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</h4>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div >

        {/* --- SECTION 3: COMMAND CENTER CAPABILITIES --- */}
        < section id="features" className="py-20 bg-slate-50 dark:bg-black/20 transition-colors duration-300" >
          <div className="container-custom px-4 text-center">
            <div className="mb-16">
              <h2 className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-white sm:text-5xl mb-4">Command Center Capabilities</h2>
              <p className="max-w-[700px] mx-auto text-muted-foreground text-lg">Powerful tools to simulate your future and maximize your career ROI.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "AI Career Intelligence", icon: Cpu, desc: "Personalized pathing based on your unique profile stats." },
                { title: "Govt Job Eligibility Engine", icon: Building2, desc: "Instant matching with government roles and entrance exams." },
                { title: "Loan & EMI Simulator", icon: CreditCard, desc: "Calculate break-even points and financial viability." },
                { title: "Risk Intelligence Report", icon: AlertTriangle, desc: "Run scenarios to see how global events affect your career." },
                { title: "Skill Gap Radar", icon: BarChart4, desc: "Compare your skills against industry requirements." },
                { title: "Human + AI Validation", icon: Users, desc: "Expert verification combined with algorithmic precision." },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative h-full"
                >
                  <SpotlightCard className="p-8 h-full">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section >

        {/* --- SECTION 4: GLOBAL MARKET SIGNALS --- */}
        < section id="market-signals" className="py-20 relative overflow-hidden" >
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-primary/5 pointer-events-none" />
          <div className="container-custom px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-white sm:text-4xl">Global Market Signals</h2>
                <p className="text-muted-foreground mt-2">Live intelligence from key education destinations.</p>
              </div>
              <Button variant="outline" className="gap-2">
                View Full Map <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Germany Card */}
              <MarketCard
                country="Germany"
                flag="🇩🇪"
                trends={[
                  { label: "Tech Demand", value: "+18%", trend: "up", color: "text-green-400" },
                  { label: "Visa Approval", value: "74%", trend: "neutral", color: "text-yellow-400" },
                  { label: "Avg Salary", value: "€62k", trend: "up", color: "text-blue-400" },
                ]}
              />
              {/* Canada Card */}
              <MarketCard
                country="Canada"
                flag="🇨🇦"
                trends={[
                  { label: "PR Difficulty", value: "Medium", trend: "down", color: "text-orange-400" },
                  { label: "Salary Trend", value: "Up", trend: "up", color: "text-green-400" },
                  { label: "Approval Rate", value: "72%", trend: "neutral", color: "text-yellow-400" },
                ]}
              />
              {/* UK Card */}
              <MarketCard
                country="United Kingdom"
                flag="🇬🇧"
                trends={[
                  { label: "Finance Demand", value: "+11%", trend: "up", color: "text-green-400" },
                  { label: "Visa Risk", value: "Medium", trend: "neutral", color: "text-orange-400" },
                  { label: "Post-Study Work", value: "2 Yrs", trend: "neutral", color: "text-blue-400" },
                ]}
              />
            </div>
          </div>
        </section >

        {/* --- SECTION 5: DASHBOARD PREVIEW --- */}
        < section id="dashboard-preview" className="py-20 bg-slate-100 dark:bg-black/40 border-y border-slate-200 dark:border-white/5 transition-colors duration-300" >
          <div className="container-custom px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-white sm:text-4xl">Your Strategic Command Center</h2>
                <p className="text-muted-foreground text-lg">
                  Track your progress with an RPG-style profile. Level up your stats, unlock badges, and visualize your career readiness in real-time.
                </p>
                <ul className="space-y-4">
                  {["Real-time XP Tracking", "Skill Gap Visualization", "Financial Health Monitoring", "Risk Assessment Meter"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Zap className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-slate-700 dark:text-white">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-white/90 font-bold">
                  Create Operative Profile
                </Button>
              </div>

              {/* Mock Dashboard Panel */}
              {/* Mock Dashboard Panel */}
              <div className="relative rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/60 p-6 backdrop-blur-xl shadow-2xl overflow-hidden group/panel">
                {/* Glow effect behind */}
                <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full opacity-50" />

                {/* Floating Micro-Data Chips */}
                <FloatingMicroData label="NET STATUS" value="ONLINE" top="10%" left="-10px" delay={0.2} />
                <FloatingMicroData label="DATA SYNC" value="100%" bottom="15%" right="-10px" delay={0.5} />
                <FloatingMicroData label="SEC_LEVEL" value="MAX" top="-10px" right="20%" delay={0.8} />

                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                  {/* Left: Avatar & Identity & Holographic XP */}
                  <div className="flex flex-col items-center text-center space-y-4 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10 pb-6 md:pb-0 md:pr-6">
                    <div className="relative h-24 w-24">
                      {/* Spinning Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-primary border-dashed animate-[spin_10s_linear_infinite] opacity-50" />
                      <Avatar className="h-full w-full border-2 border-black/50">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">JD</AvatarFallback>
                      </Avatar>
                      <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-bold text-xs pointer-events-none shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                        LVL 5
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">John Doe</h3>
                      <p className="text-xs text-primary font-mono tracking-widest uppercase">Strategist Class</p>
                    </div>

                    {/* Holographic XP Bar */}
                    <div className="w-full space-y-1">
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                        <span>XP PROGRESS</span>
                        <span>12,450 / 15k</span>
                      </div>
                      <HolographicBar value={83} color="bg-yellow-500" height="h-2" />
                    </div>
                  </div>

                  {/* Right: Radar Chart & Holographic Stats */}
                  <div className="flex-1 space-y-6">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Zap className="w-3 h-3 text-primary" /> Operative Matrix
                    </h4>

                    {/* Radar Chart */}
                    <div className="w-full -ml-4" style={{ height: 180 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                          { subject: 'CGPA', A: 92, fullMark: 100 },
                          { subject: 'Skills', A: 85, fullMark: 100 },
                          { subject: 'Finance', A: 70, fullMark: 100 },
                          { subject: 'Risk', A: 45, fullMark: 100 },
                          { subject: 'Visa', A: 89, fullMark: 100 },
                          { subject: 'Research', A: 78, fullMark: 100 },
                        ]}>
                          <PolarGrid stroke="#ffffff20" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                          <Radar
                            name="John"
                            dataKey="A"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            fill="#0ea5e9"
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Extra Holographic Bars */}
                    <div className="space-y-3">
                      <HolographicBar label="Neuro-Sync Efficiency" value={98} color="bg-purple-500" />
                      <HolographicBar label="System Integrity" value={100} color="bg-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section >
      </main >

      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black py-12 transition-colors duration-300">
        <div className="container-custom text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Globe className="h-3 w-3 text-primary" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">ORBIS</span>
          </div>
          <p className="max-w-md mx-auto mb-8">Empowering students with data-driven career strategies. Choose your future with confidence.</p>
          <p>&copy; 2026 Orbis Intelligence Systems. All rights reserved.</p>
        </div>
      </footer >
    </div >
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

