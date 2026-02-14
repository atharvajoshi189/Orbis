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

            {/* Light mode background */}
            <div className="fixed inset-0 z-[-1] bg-slate-50 dark:opacity-0 opacity-100 transition-opacity" />

            <div className="fixed top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[100px] dark:opacity-100 opacity-30" />
            <div className="fixed bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[100px] dark:opacity-100 opacity-30" />

            {children}
            <Footer />
            <GlobalChatWidget />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
