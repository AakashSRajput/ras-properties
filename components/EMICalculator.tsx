'use client';

import React, { useState } from 'react';
import { Calculator, IndianRupee, PieChart, Sparkles } from 'lucide-react';
import { formatINR, formatNumberIN } from '@/lib/utils';

interface EMICalculatorProps {
  initialPrice?: number;
}

export default function EMICalculator({ initialPrice = 7500000 }: EMICalculatorProps) {
  // Default loan is 80% of property value
  const [loanAmount, setLoanAmount] = useState<number>(Math.round(initialPrice * 0.8));
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  // Calculate Monthly EMI
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let monthlyEMI = 0;
  if (monthlyRate > 0 && totalMonths > 0) {
    monthlyEMI = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
  }

  const totalPayment = monthlyEMI * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);
  const principalPercentage = totalPayment > 0 ? Math.round((loanAmount / totalPayment) * 100) : 50;
  const interestPercentage = 100 - principalPercentage;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Home Loan EMI Calculator</h3>
            <p className="text-xs text-slate-500">Estimate your monthly mortgage payments</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
          SBI / HDFC Bank Rates
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders Area (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loan Amount Slider */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold mb-2">
              <span className="text-slate-700">Loan Amount</span>
              <span className="text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                {formatINR(loanAmount)}
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={50000000}
              step={100000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
              <span>₹5 Lakh</span>
              <span>₹2.5 Cr</span>
              <span>₹5 Cr</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold mb-2">
              <span className="text-slate-700">Interest Rate (% p.a.)</span>
              <span className="text-slate-900 font-bold bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                {interestRate} %
              </span>
            </div>
            <input
              type="range"
              min={6.5}
              max={14.0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
              <span>6.5%</span>
              <span>9.5%</span>
              <span>14%</span>
            </div>
          </div>

          {/* Loan Tenure Slider */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold mb-2">
              <span className="text-slate-700">Tenure (Years)</span>
              <span className="text-slate-900 font-bold bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                {tenureYears} Years
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
              <span>1 Year</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Output & Breakdown Card (5 cols) */}
        <div className="lg:col-span-5 bg-navy-950 text-white rounded-2xl p-6 shadow-xl border border-navy-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Monthly EMI</span>
            <div className="text-3xl sm:text-4xl font-black text-amber-400 font-display mt-1 mb-4">
              ₹{formatNumberIN(monthlyEMI)}
              <span className="text-xs text-slate-400 font-normal"> / month</span>
            </div>

            {/* Visual ratio bar */}
            <div className="space-y-1.5 mb-6">
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${principalPercentage}%` }}
                  className="bg-amber-500 h-full transition-all duration-300"
                />
                <div
                  style={{ width: `${interestPercentage}%` }}
                  className="bg-sky-500 h-full transition-all duration-300"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Principal ({principalPercentage}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" /> Interest ({interestPercentage}%)
                </span>
              </div>
            </div>

            {/* Detailed summary */}
            <div className="space-y-2.5 text-xs border-t border-slate-800 pt-4">
              <div className="flex justify-between text-slate-300">
                <span>Principal Amount:</span>
                <span className="font-semibold text-white">₹{formatNumberIN(loanAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Interest:</span>
                <span className="font-semibold text-amber-400">₹{formatNumberIN(totalInterest)}</span>
              </div>
              <div className="flex justify-between text-slate-300 border-t border-slate-800/80 pt-2 font-semibold">
                <span>Total Payable:</span>
                <span className="text-white font-bold">₹{formatNumberIN(totalPayment)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Bank processing fees and government taxes may apply.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
