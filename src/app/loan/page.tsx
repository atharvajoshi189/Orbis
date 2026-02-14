"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Calculator, DollarSign, PiggyBank } from "lucide-react";

export default function LoanPage() {
    const [amount, setAmount] = useState(50000);
    const [rate, setRate] = useState(10);
    const [years, setYears] = useState(10);

    const calculateEMI = () => {
        const r = rate / 12 / 100;
        const n = years * 12;
        const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return emi.toFixed(2);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Financial Intelligence & Loan Simulator</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-primary" />
                            EMI Calculator
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Loan Amount ($)</label>
                            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="bg-black/30" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Interest Rate (%)</label>
                            <Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="bg-black/30" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tenure (Years)</label>
                            <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="bg-black/30" />
                        </div>

                        <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-muted-foreground">Monthly EMI:</span>
                                <span className="font-bold text-primary text-2xl">${calculateEMI()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Payment:</span>
                                <span className="font-medium text-white">${(Number(calculateEMI()) * years * 12).toFixed(2)}</span>
                            </div>
                        </div>
                        <Button className="w-full mt-4" variant="neon">Apply Simulation</Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PiggyBank className="h-5 w-5 text-purple-500" />
                                ROI Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <span className="text-sm text-green-400">Projected Salary (Year 1)</span>
                                <span className="font-bold text-white">$85,000</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <span className="text-sm text-red-400">Total Education Cost</span>
                                <span className="font-bold text-white">$65,000</span>
                            </div>
                            <div className="pt-4">
                                <p className="text-sm text-muted-foreground mb-2">Break-even Timeline</p>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary to-purple-500 w-[40%]" />
                                </div>
                                <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                                    <span>Start</span>
                                    <span className="text-white font-bold">1.2 Years</span>
                                    <span>5 Years</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-yellow-500" />
                                Bank Pro Offers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Bank</TableHead>
                                        <TableHead>Rate</TableHead>
                                        <TableHead>Processing</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[
                                        { bank: "HDFC Credila", rate: "10.5%", proc: "0.5%" },
                                        { bank: "SBI EdLive", rate: "9.8%", proc: "Nil" },
                                        { bank: "Prodigy", rate: "11.2%", proc: "1%" },
                                    ].map((offer, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{offer.bank}</TableCell>
                                            <TableCell>{offer.rate}</TableCell>
                                            <TableCell>{offer.proc}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
