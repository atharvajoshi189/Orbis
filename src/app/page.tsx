"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, TrendingUp, ShieldCheck, Cpu, Building2, GraduationCap, Zap, BarChart4, Users, CreditCard, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans selection:bg-primary/30">
      {/* Navbar for Landing Page */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="container-custom flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-tr from-primary to-purple-600 shadow-[0_0_15px_rgba(0,243,255,0.5)]">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white">ORBIS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Capabilities
            </Link>
            <Link href="#market-signals" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Global Intel
            </Link>
            <Link href="#dashboard-preview" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Command Center
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
                  System Online v2.4
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-6xl xl:text-7xl/none">
                    Choose Your <span className="text-primary drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">Career Strategy</span>, <br />
                    Not Just a University.
                  </h1>
                  <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
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
              {/* Solar System Orbit Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative mx-auto aspect-square w-full max-w-[500px] flex items-center justify-center py-10 md:py-0"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary/10 to-purple-500/10 blur-[100px]" />

                {/* Orbits Container */}
                <div className="relative w-full h-full flex items-center justify-center">

                  {/* Central Star / Core */}
                  <div className="relative z-20 h-24 w-24 rounded-full bg-black border-2 border-primary/50 shadow-[0_0_30px_rgba(0,243,255,0.4)] flex items-center justify-center overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                    <Globe className="h-10 w-10 text-white z-10 relative group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30" />
                  </div>

                  {/* Orbit Ring 1 (Inner) */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute z-10 h-[180px] w-[180px] rounded-full border border-white/10"
                  >
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                  </motion.div>

                  {/* Orbit Ring 2 (Middle) */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute z-10 h-[280px] w-[280px] rounded-full border border-white/10"
                  >
                    <div className="absolute top-1/2 -right-2 -translate-y-1/2 h-4 w-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] border border-black" />
                    {/* Satellite for Planet 2 */}
                    <div className="absolute bottom-10 left-10 h-1.5 w-1.5 rounded-full bg-white/50" />
                  </motion.div>

                  {/* Orbit Ring 3 (Outer) */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                    className="absolute z-10 h-[380px] w-[380px] rounded-full border border-white/5 border-dashed"
                  >
                    <div className="absolute bottom-14 right-14 h-5 w-5 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] border-2 border-black" />
                  </motion.div>
                </div>

                {/* Floating Info Cards (Preserved & Positioned) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute top-[10%] right-0 lg:-right-4 p-3 rounded-lg bg-black/60 border border-primary/30 backdrop-blur-md shadow-lg z-30"
                >
                  <p className="text-xs text-muted-foreground">Admission Probability</p>
                  <p className="text-lg font-bold text-green-400">82%</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="absolute bottom-[20%] -left-4 p-3 rounded-lg bg-black/60 border border-purple-500/30 backdrop-blur-md shadow-lg z-30"
                >
                  <p className="text-xs text-muted-foreground">Avg ROI</p>
                  <p className="text-lg font-bold text-purple-400">3.4x</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.0, duration: 0.5 }}
                  className="absolute top-0 left-10 p-2 px-3 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-md z-30"
                >
                  <p className="text-xs font-bold text-blue-400 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Visa Confidence: 89%
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div >
        </section >

        {/* --- SECTION 2: LIVE METRICS STRIP (Enhanced) --- */}
        < div className="border-y border-white/10 bg-black/30 backdrop-blur-md py-6 overflow-hidden" >
          <div className="container-custom grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-x divide-white/5">
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
                <h4 className="text-xl font-bold text-white">{stat.value}</h4>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div >

        {/* --- SECTION 3: COMMAND CENTER CAPABILITIES --- */}
        < section id="features" className="py-20 bg-black/20" >
          <div className="container-custom px-4 text-center">
            <div className="mb-16">
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl mb-4">Command Center Capabilities</h2>
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
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-8 text-left transition-all hover:bg-white/10 hover:shadow-[0_0_30px_rgba(0,243,255,0.1)] hover:border-primary/50"
                >
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
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
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">Global Market Signals</h2>
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
        < section id="dashboard-preview" className="py-20 bg-black/40 border-y border-white/5" >
          <div className="container-custom px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">Your Strategic Command Center</h2>
                <p className="text-muted-foreground text-lg">
                  Track your progress with an RPG-style profile. Level up your stats, unlock badges, and visualize your career readiness in real-time.
                </p>
                <ul className="space-y-4">
                  {["Real-time XP Tracking", "Skill Gap Visualization", "Financial Health Monitoring", "Risk Assessment Meter"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Zap className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-white">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold">
                  Create Operative Profile
                </Button>
              </div>

              {/* Mock Dashboard Panel */}
              <div className="relative rounded-xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl shadow-2xl">
                {/* Glow effect behind */}
                <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full opacity-50" />

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Avatar & Identity */}
                  <div className="flex flex-col items-center text-center space-y-4 md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                    <div className="relative h-24 w-24">
                      <div className="absolute inset-0 rounded-full border-2 border-primary border-dashed animate-[spin_10s_linear_infinite]" />
                      <Avatar className="h-full w-full border-2 border-black">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-primary/20 text-xl font-bold">JD</AvatarFallback>
                      </Avatar>
                      <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-bold text-xs pointer-events-none">
                        LVL 5
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">John Doe</h3>
                      <p className="text-xs text-primary font-medium tracking-widest uppercase">Strategist Class</p>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <div className="bg-yellow-500 h-full w-[75%]" />
                    </div>
                    <p className="text-[10px] text-muted-foreground w-full flex justify-between">
                      <span>XP: 12,450</span>
                      <span>Next: 15k</span>
                    </p>
                  </div>

                  {/* Right: Stats */}
                  <div className="flex-1 space-y-5">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Operative Stats</h4>
                    <StatBar label="CGPA Power" value={92} color="bg-primary" />
                    <StatBar label="Skill Match" value={85} color="bg-purple-500" />
                    <StatBar label="Financial Strength" value={70} color="bg-green-500" />
                    <StatBar label="Risk Meter" value={45} color="bg-red-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section >
      </main >

      <footer className="border-t border-white/10 bg-black py-12">
        <div className="container-custom text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Globe className="h-3 w-3 text-primary" />
            </div>
            <span className="text-lg font-bold text-white">ORBIS</span>
          </div>
          <p className="max-w-md mx-auto mb-8">Empowering students with data-driven career strategies. Choose your future with confidence.</p>
          <p>&copy; 2026 Orbis Intelligence Systems. All rights reserved.</p>
        </div>
      </footer>
    </div >
  );
}

function MarketCard({ country, flag, trends }: { country: string, flag: string, trends: any[] }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{flag}</span>
          <h3 className="font-bold text-lg text-white">{country}</h3>
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
    </motion.div>
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
