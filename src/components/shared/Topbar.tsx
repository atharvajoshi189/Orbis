"use client";

import { Bell, Search, Globe2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountrySelector } from "@/components/shared/CountrySelector";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Assuming we will have this, but for now I'll just use a button or make a simple dropdown if needed. 
// I'll skip DropdownMenu for now and just put a button since I haven't implemented DropdownMenu yet. 

export function Topbar() {
    return (
        <header className="fixed top-0 right-0 z-30 ml-64 flex h-16 w-[calc(100%-16rem)] items-center justify-between border-b border-white/10 bg-black/40 px-6 backdrop-blur-xl">
            <div className="flex w-full max-w-xl items-center gap-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search Intelligence Database..."
                        className="h-9 w-full border-white/10 bg-white/5 pl-9 text-sm text-foreground focus:border-primary/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <CountrySelector />
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Globe2 className="h-5 w-5" />
                    <span className="sr-only">Language</span>
                </Button>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#00f3ff]" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">System Status</p>
                    <p className="text-sm font-bold text-primary flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        ONLINE
                    </p>
                </div>
            </div>
        </header>
    );
}
