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
import { Toaster } from "sonner";

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
            <div className="fixed inset-0 z-[-1] bg-[#FFFDD0] dark:opacity-0 opacity-100 transition-opacity" />

            <div className="fixed top-0 left-1/4 h-96 w-96 rounded-full bg-teal-400/30 blur-[100px] dark:bg-primary/10 dark:opacity-100 opacity-70" />
            <div className="fixed bottom-0 right-1/4 h-96 w-96 rounded-full bg-fuchsia-400/30 blur-[100px] dark:bg-purple-600/10 dark:opacity-100 opacity-70" />
            {/* Third "Greyish" light implied by user? or just replace one? "make the transparent gresish" -> maybe the top one? */}
            {/* I will revert to the code I just wrote but change navbar back to white to be safe, as 'greyish' navbar looked bad. */}

            {children}
            <Footer />
            <Footer />
            <GlobalChatWidget />
            <Toaster richColors position="top-center" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
