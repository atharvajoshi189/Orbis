import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Star } from "lucide-react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";

export default function RecommendationsPage() {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <div className="pl-64">
                <Topbar />
                <main className="min-h-[calc(100vh-4rem)] pt-16 p-6">
                    <div className="container-custom py-6 space-y-6">
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-6">AI Recommendations</h1>
                        <div className="grid gap-6 md:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="glass-card hover:bg-white/10 transition-colors cursor-pointer">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Star className="h-4 w-4 text-primary" />
                                            Top Pick #{i}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <h3 className="text-lg font-bold">Master of Computer Science</h3>
                                        <p className="text-sm text-muted-foreground mb-4">Tech University of Munich</p>
                                        <div className="flex gap-2 text-xs">
                                            <span className="bg-primary/20 text-primary px-2 py-1 rounded">High ROI</span>
                                            <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded">Safe Bet</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
