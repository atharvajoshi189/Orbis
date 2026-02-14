import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Search } from "lucide-react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { Input } from "@/components/ui/input";

export default function GovtPage() {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <div className="pl-64">
                <Topbar />
                <main className="min-h-[calc(100vh-4rem)] pt-16 p-6">
                    <div className="container-custom py-6 space-y-6">
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Government Pathways</h1>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="relative flex-1 max-w-lg">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Search exam notifications..." className="pl-9 bg-black/40" />
                            </div>
                        </div>

                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-yellow-500" />
                                    Upcoming Exams
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {[
                                        { name: "UPSC Civil Services", date: "May 26, 2026", status: "Open" },
                                        { name: "SSC CGL 2026", date: "July 14, 2026", status: "Coming Soon" },
                                        { name: "RBI Grade B", date: "Aug 02, 2026", status: "Closed" },
                                    ].map((exam, i) => (
                                        <li key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                            <span className="font-medium">{exam.name}</span>
                                            <div className="text-right">
                                                <div className="text-sm text-white">{exam.date}</div>
                                                <div className={`text-xs ${exam.status === 'Open' ? 'text-green-500' : 'text-muted-foreground'}`}>{exam.status}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
