import { Construction } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GuidancePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
                <Construction className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Guidance Module Under Construction</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                We are building a comprehensive career guidance system for you. Check back soon for AI-driven mentorship and roadmaps.
            </p>
            <div className="flex gap-4">
                <Link href="/">
                    <Button variant="outline">Return Home</Button>
                </Link>
                <Link href="/dashboard">
                    <Button>Go to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
}
