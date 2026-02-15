import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Using Outfit for that futuristic look
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Orbis | Career Strategy Intelligence",
  description: "AI-powered Career & Financial Intelligence Platform",
};

import { GlobalChatWidget } from "@/components/GlobalChatWidget";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, outfit.variable, "bg-background font-sans antialiased overflow-x-hidden transition-colors duration-300")}>
        <ThemeProvider>
          <div className="relative min-h-screen">
            {/* Background ambient glow - visible in dark mode */}
            <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1e] to-black dark:opacity-100 opacity-0 transition-opacity" />

            {/* Light mode background - Warm Aurora Base */}
            <div className="fixed inset-0 z-[-1] bg-[#fdfdf5] dark:opacity-0 opacity-100 transition-opacity" />

            {/* Aurora Blobs - Soft Green & Purple/Pink Theme */}
            <div className="fixed top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-emerald-300/30 blur-[100px] dark:bg-emerald-900/20 opacity-100 mix-blend-multiply z-[-1] animate-pulse-slow" />
            <div className="fixed top-[0%] right-[-10%] h-[700px] w-[700px] rounded-full bg-purple-300/30 blur-[100px] dark:bg-violet-900/20 opacity-100 mix-blend-multiply z-[-1] animate-pulse-slow delay-1000" />
            <div className="fixed bottom-[-10%] left-[10%] h-[700px] w-[700px] rounded-full bg-pink-300/30 blur-[100px] dark:bg-fuchsia-900/20 opacity-100 mix-blend-multiply z-[-1] animate-pulse-slow delay-2000" />
            <div className="fixed bottom-[10%] right-[0%] h-[600px] w-[600px] rounded-full bg-cyan-200/30 blur-[100px] dark:bg-teal-900/20 opacity-100 mix-blend-multiply z-[-1]" />

            {children}
            <Footer />
            <GlobalChatWidget />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
