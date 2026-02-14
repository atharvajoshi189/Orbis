import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";

export default function SettingsPage() {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <div className="pl-64">
                <Topbar />
                <main className="min-h-[calc(100vh-4rem)] pt-16 p-6">
                    <div className="container-custom py-6 space-y-6">
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-6">System Settings</h1>
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-gray-500" />
                                    Preferences
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                    <p className="text-muted-foreground">Notification Settings</p>
                                </div>
                                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                    <p className="text-muted-foreground">Privacy & Security</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
