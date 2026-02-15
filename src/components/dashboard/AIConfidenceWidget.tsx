"use client";
import Translate from "@/components/Translate";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldAlert, CheckCircle, AlertTriangle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "sonner";

interface AIConfidenceWidgetProps {
    confidence: number;
    reviewNeeded: boolean;
}

export function AIConfidenceWidget({ confidence, reviewNeeded }: AIConfidenceWidgetProps) {
    const [reviewRequested, setReviewRequested] = useState(false);

    const isLowConfidence = confidence < 70 || reviewNeeded;

    const handleRequestReview = () => {
        setReviewRequested(true);
        toast.success("Profile sent to Human Counselor for detailed review.", {
            description: "You will receive a notification once the review is complete.",
        });
        // In a real app, this would trigger a Supabase DB update
    };

    return (
        <Card className={`relative overflow-hidden transition-all duration-500 border-2 ${isLowConfidence ? 'bg-amber-950/20 border-amber-500/50' : 'bg-emerald-950/20 border-emerald-500/50'}`}>

            {/* Ambient Background Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20 ${isLowConfidence ? 'bg-amber-500' : 'bg-emerald-500'}`} />

            <CardHeader className="pb-2">
                <CardTitle className={`flex items-center gap-2 text-sm font-black uppercase tracking-wider ${isLowConfidence ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isLowConfidence ? <ShieldAlert className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    <Translate text="AI Confidence Meter" />
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
                <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <div className={`text-4xl font-black ${isLowConfidence ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {confidence}%
                        </div>
                        <div className="text-xs font-bold uppercase text-slate-500 tracking-widest">
                            <Translate text="Analysis Certainty" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Progress value={confidence} className={`h-2 ${isLowConfidence ? "bg-amber-950/50" : "bg-emerald-950/50"}`} indicatorColor={isLowConfidence ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"} />
                    <p className="text-xs text-slate-400">
                        {isLowConfidence
                            ? <Translate text="AI detected gaps or inconsistencies in your profile." />
                            : <Translate text="Profile data is robust. AI predictions are highly reliable." />
                        }
                    </p>
                </div>

                {/* Action Area */}
                {isLowConfidence && (
                    <div className="pt-2 border-t border-amber-500/20 mt-2">
                        <div className="flex items-center gap-2 mb-3 text-amber-200/80 text-xs bg-amber-500/10 p-2 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                            <span><Translate text="Human oversight recommended for optimal strategy." /></span>
                        </div>
                        <Button
                            onClick={handleRequestReview}
                            disabled={reviewRequested}
                            className={`w-full uppercase font-bold tracking-wider text-xs ${reviewRequested ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-amber-500 text-black hover:bg-amber-400'}`}
                            variant={reviewRequested ? "outline" : "default"}
                        >
                            {reviewRequested ? (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" /> <Translate text="Request Sent" />
                                </>
                            ) : (
                                <>
                                    <UserCheck className="w-4 h-4 mr-2" /> <Translate text="Request Human Review" />
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
