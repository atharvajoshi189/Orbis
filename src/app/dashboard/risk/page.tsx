import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, AlertTriangle } from "lucide-react";

export default function RiskPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Risk Simulation</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card border-red-500/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-400">
                            <ShieldAlert className="h-5 w-5" />
                            Global Volatility Index
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-red-500">High</div>
                        <p className="text-muted-foreground mt-2">
                            Current geopolitical events are impacting currency exchange rates and visa processing times.
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            Currency Fluctuation Risk
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-40 flex items-center justify-center border border-dashed border-white/20 rounded-lg bg-black/20">
                            <span className="text-muted-foreground">Chart Placeholder - Currency Trends</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
