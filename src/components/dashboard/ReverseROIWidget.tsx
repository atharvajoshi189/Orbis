"use client";
import Translate from "@/components/Translate";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, DollarSign, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface ReverseROIWidgetProps {
    loanAmount?: number;
    interestRate?: number;
}

export function ReverseROIWidget({ loanAmount = 45000, interestRate = 8.5 }: ReverseROIWidgetProps) {
    // Mocking future salary based on typical Master's grad
    const estimatedSalary = 85000;
    const monthlySalary = estimatedSalary / 12;
    // Assuming 30% goes to taxes/expenses, 30% to savings/loan
    const disposibleIncome = monthlySalary * 0.35;

    const [monthsToPayOff, setMonthsToPayOff] = useState(0);
    const [debtFreeDate, setDebtFreeDate] = useState<string>("");

    useEffect(() => {
        // Simple amortization logic: Time = Loan / Monthly Payment (ignoring compound interest for simple UI)
        // Real formula: N = -log(1 - (r*PV)/PMT) / log(1+r)

        const monthlyRate = interestRate / 100 / 12;
        // Payment is disposible income
        const payment = disposibleIncome;

        // If payment is less than interest, infinite loop. 
        if (payment <= loanAmount * monthlyRate) {
            setMonthsToPayOff(999);
            setDebtFreeDate("Never (Increase Income)");
            return;
        }

        const n = -Math.log(1 - (monthlyRate * loanAmount) / payment) / Math.log(1 + monthlyRate);
        const months = Math.ceil(n);

        setMonthsToPayOff(months);

        const date = new Date();
        date.setMonth(date.getMonth() + months);
        setDebtFreeDate(date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    }, [loanAmount, interestRate, disposibleIncome]);

    return (
        <Card className="bg-slate-900 border-slate-800 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-600/20 transition-all duration-700" />

            <CardHeader className="pb-2 border-b border-white/5">
                <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-purple-400">
                    <TrendingUp className="w-4 h-4" /> <Translate text="Reverse ROI Calculator" />
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-6 space-y-4 relative z-10">
                <div className="flex items-baseline justify-between">
                    <div>
                        <div className="text-3xl font-black text-white"><Translate text={debtFreeDate} /></div>
                        <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mt-1">
                            <Translate text="Projected Debt-Free Date" />
                        </div>
                    </div>
                    <div className="bg-purple-500/10 p-2 rounded-lg">
                        <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span><Translate text="Investment recovered in:" /></span>
                        <span className="text-white font-bold">{Math.floor(monthsToPayOff / 12)} <Translate text="Years" />, {monthsToPayOff % 12} <Translate text="Months" /></span>
                    </div>
                    <Progress value={Math.min(100, (12 / monthsToPayOff) * 100 * 3)} className="h-1 bg-slate-800" indicatorColor="bg-purple-500" />
                    <p className="text-[10px] text-slate-500 italic">
                        *<Translate text="Based on" /> ${estimatedSalary.toLocaleString()} <Translate text="projected salary" /> & {interestRate}% <Translate text="loan interest" />.
                    </p>
                </div>

                <button className="w-full mt-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                    <Translate text="Adjust Financial Model" /> <ArrowRight className="w-3 h-3" />
                </button>
            </CardContent>
        </Card>
    );
}
