"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Globe, BookOpen, Briefcase, Stamp } from "lucide-react";

export default function GlobalIntelPage() {
    const { selectedCountry } = useAppStore();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Global Intelligence: {selectedCountry.name}</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card border-l-4 border-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visa Success Rate</CardTitle>
                        <Stamp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{selectedCountry.visaRate}%</div>
                        <Progress value={selectedCountry.visaRate} className="mt-2 h-2" />
                    </CardContent>
                </Card>

                <Card className="glass-card border-l-4 border-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Job Market Demand</CardTitle>
                        <Briefcase className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{selectedCountry.jobDemand}</div>
                        <p className="text-xs text-muted-foreground mt-1">Tech & Healthcare leading</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-l-4 border-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">PR Difficulty</CardTitle>
                        <Globe className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{selectedCountry.prDifficulty}</div>
                        <p className="text-xs text-muted-foreground mt-1">Based on current policies</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Visa Policy Updates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{selectedCountry.flag}</span>
                                <h3 className="font-bold flex-1">New Student Route Changes</h3>
                                <span className="text-xs text-muted-foreground">2 days ago</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Recent updates to the {selectedCountry.name} student visa policy may affect post-study work rights.
                                Check official documentation for details on maintenance requirements.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
