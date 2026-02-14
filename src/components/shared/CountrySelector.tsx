"use client";

import { useAppStore, countries } from "@/lib/store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function CountrySelector() {
    const { selectedCountry, setCountry } = useAppStore();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-dashed border-primary/50 text-primary hover:bg-primary/10">
                    <Globe className="mr-2 h-4 w-4" />
                    {selectedCountry.flag} {selectedCountry.name}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/80 backdrop-blur-xl border-white/10 text-white">
                {countries.map((country) => (
                    <DropdownMenuItem
                        key={country.code}
                        onClick={() => setCountry(country)}
                        className="flex items-center justify-between hover:bg-white/10 cursor-pointer"
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span>
                            {country.name}
                        </span>
                        {selectedCountry.code === country.code && (
                            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#00f3ff]" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
