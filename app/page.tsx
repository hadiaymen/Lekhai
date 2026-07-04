"use client";

import { useEffect, useRef, useState } from "react";
import { useFinancialStore } from "@/store/financialStore";
import Link from "next/link";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const fmtShort = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${(n / 1000).toFixed(0)}K`;
};

function AnimatedNumber({ value, prefix = "₹" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1400;
    const step = end / (duration / 16);

    const tick = () => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        return;
      }
      setDisplay(Math.floor(start));
      ref.current = setTimeout(tick, 16);
    };
    ref.current = setTimeout(tick, 300);
    return () => { if (ref.current) clearTimeout(ref.current); };
  }, [value]);

  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {prefix}{display.toLocaleString("en-IN")}
    </span>
  );
}

const kpis = [
  { key: "revenue", label: "TOTAL REVENUE", icon: "trending_up", trend: "+12.4%", positive: true },
  { key: "operatingExpenses", label: "TOTAL EXPENSES", icon: "account_balance_wallet", trend: "-2.1%", positive: false },
  { key: "netProfit", label: "NET PROFIT", icon: "insights", trend: "+8.3%", positive: true },
  { key: "totalAssets", label: "TOTAL ASSETS", icon: "domain", trend: "+5.6%", positive: true },
  { key: "totalLiabilities", label: "TOTAL LIABILITIES", icon: "money_off", trend: "-1.8%", positive: true },
];

const months = ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR"];

export default function Dashboard() {
  const { financialData, aiInsights, uploadedFiles, companyName, financialYear, healthScore } = useFinancialStore();

  return (
    <div className="min-h-screen pb-16" style={{ background: "#0e0e0e" }}>
      <div className="max-w-[1440px] mx-auto px-12 pt-8">

        {/* Page Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
              Financial Forensics · {financialYear}
            </p>
            <h1 className="font-semibold tracking-tight text-white" style={{ fontSize: "40px", letterSpacing: "-0.02em" }}>
              Analyzer Terminal
            </h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(196,199,200,0.5)" }}>
              {companyName} — Forensic overview of {financialYear}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/export"
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm transition-all hover:bg-[rgba(255,255,255,0.08)]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.15)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: "#ffffff",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
              Export Report
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all hover:brightness-90 active:scale-[0.98]"
              style={{
                background: "#ffffff",
                color: "#131313",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>upload_file</span>
              Upload Documents
            </Link>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-5 gap-6 mb-6">
          {kpis.map((kpi) => {
            const value = financialData[kpi.key as keyof typeof financialData] as number;
            const pct = (value / financialData.totalAssets) * 100;
            return (
              <div
                key={kpi.key}
                className="liquid-glass glass-hover glass-highlight p-6 rounded-xl group"
                style={{ borderRadius: "16px" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="w-10 h-10 liquid-glass-sm rounded-lg flex items-center justify-center"
                    style={{ borderRadius: "10px" }}
                  >
                    <span className="material-symbols-outlined text-white" style={{ fontSize: "20px" }}>
                      {kpi.icon}
                    </span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-bold"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      background: kpi.positive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                      color: kpi.positive ? "#ffffff" : "rgba(196,199,200,0.5)",
                    }}
                  >
                    {kpi.trend}
                  </span>
                </div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
                  {kpi.label}
                </p>
                <div className="text-xl font-semibold text-white leading-tight mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <AnimatedNumber value={value} />
                </div>
                <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div
                    className="h-full rounded-full progress-glow transition-all duration-1000"
                    style={{ width: `${Math.min(pct, 100)}%`, background: "#ffffff" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* Monthly Performance Chart */}
          <div className="col-span-8 liquid-glass glass-highlight rounded-xl p-8" style={{ borderRadius: "16px" }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-medium text-white" style={{ fontSize: "18px" }}>Monthly Performance</h3>
                <p className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
                  Revenue vs Expenses – {financialYear}
                </p>
              </div>
              <div className="flex gap-4">
                {[["Revenue", "bg-white"], ["Expenses", "bg-[rgba(255,255,255,0.25)]"]].map(([label, cls]) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${cls}`} />
                    <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.6)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative" style={{ height: "200px" }}>
              <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                {/* Grid lines */}
                {[40, 80, 120, 160].map((y) => (
                  <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                ))}
                {/* Expense area */}
                <path
                  d="M0,180 Q88,165 178,170 T356,155 T534,145 T712,155 T800,162 V200 H0 Z"
                  fill="rgba(255,255,255,0.04)"
                />
                <path
                  d="M0,180 Q88,165 178,170 T356,155 T534,145 T712,155 T800,162"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                {/* Revenue line */}
                <path
                  className="chart-glow"
                  d="M0,155 Q88,125 178,85 T356,100 T534,50 T712,65 T800,55"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                />
              </svg>
              {/* Month labels */}
              <div
                className="absolute bottom-0 left-0 w-full flex justify-between"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(196,199,200,0.35)" }}
              >
                {months.map((m) => <span key={m}>{m}</span>)}
              </div>
            </div>
          </div>

          {/* Side panels */}
          <div className="col-span-4 space-y-6">
            {/* Health Score */}
            <div className="liquid-glass glass-highlight rounded-xl p-6" style={{ borderRadius: "16px" }}>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
                AI HEALTH SCORE
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle
                      cx="40" cy="40" r="32" fill="none" stroke="white" strokeWidth="8"
                      strokeDasharray={`${(healthScore / 100) * 201} 201`}
                      style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))", transition: "stroke-dasharray 1s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {healthScore}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">HEALTHY</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(196,199,200,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
                    Score: {healthScore}/100
                  </p>
                </div>
              </div>
            </div>

            {/* Cash Flow Trend */}
            <div className="liquid-glass glass-highlight rounded-xl p-6" style={{ borderRadius: "16px" }}>
              <p className="text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
                NET CASH FLOW
              </p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {fmtShort(financialData.operatingCashFlow)}
                </span>
                <span className="text-xs text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>+4.2%</span>
              </div>
              <div className="w-full" style={{ height: "50px", opacity: 0.65 }}>
                <svg className="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    points="0,42 20,38 40,44 60,28 80,35 100,18 120,22 140,10 160,14 180,6 200,9"
                    stroke="white"
                    strokeWidth="2"
                    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights + Documents Row */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* AI Insights */}
          <div className="col-span-4 liquid-glass glass-highlight rounded-xl p-6" style={{ borderRadius: "16px" }}>
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-white" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>psychology</span>
              <h3 className="font-medium text-white" style={{ fontSize: "16px" }}>AI Insights</h3>
            </div>
            <div className="space-y-4">
              {aiInsights.slice(0, 3).map((insight, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl glass-hover group cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium text-white">{insight.title}</p>
                    {insight.metric && (
                      <span
                        className="text-xs px-2 py-0.5 rounded ml-2 shrink-0"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          background: insight.type === "warning" ? "rgba(255,180,171,0.1)" : "rgba(255,255,255,0.08)",
                          color: insight.type === "warning" ? "#ffb4ab" : "#ffffff",
                        }}
                      >
                        {insight.metric}
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(196,199,200,0.55)" }}>
                    {insight.description}
                  </p>
                </div>
              ))}
              <Link
                href="/analysis"
                className="flex items-center gap-2 text-xs text-white hover:gap-3 transition-all"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                View All Insights <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Recent Documents Table */}
          <div className="col-span-8 liquid-glass glass-highlight rounded-xl overflow-hidden" style={{ borderRadius: "16px" }}>
            <div
              className="px-8 py-5 flex justify-between items-center"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}
            >
              <h3 className="font-medium text-white" style={{ fontSize: "16px" }}>Analyzed Documents</h3>
              <div className="flex gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs"
                  style={{ fontFamily: "'JetBrains Mono', monospace", background: "rgba(255,255,255,0.05)", color: "rgba(196,199,200,0.6)" }}
                >
                  All ({uploadedFiles.length})
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs"
                  style={{ fontFamily: "'JetBrains Mono', monospace", background: "rgba(255,255,255,0.08)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  Pending ({uploadedFiles.filter(f => f.status !== "completed" && f.status !== "error").length})
                </span>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Document Name", "Type", "Date", "Status", "Confidence"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(196,199,200,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.length > 0 ? uploadedFiles.map((doc, i) => {
                  const docTypeMeta = {
                    bank_statement: { label: "Bank Statement", icon: "account_balance" },
                    purchase_invoice: { label: "Purchase Invoice", icon: "receipt_long" },
                    payroll_report: { label: "Payroll Report", icon: "people" },
                    tally_export: { label: "Tally Export", icon: "table_chart" },
                    unknown: { label: "Unknown Document", icon: "description" },
                  }[doc.type] || { label: "Document", icon: "description" };
                  
                  const statusLabel = doc.status === "completed" ? "Completed" : doc.status === "error" ? "Error" : "Analyzing";
                  const confidence = doc.status === "completed" ? 98 : 0;
                  
                  return (
                  <tr key={doc.id} className="glass-row transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "18px", color: statusLabel === "Analyzing" ? "#ffffff" : "rgba(196,199,200,0.35)" }}
                        >
                          {docTypeMeta.icon}
                        </span>
                        <span className="text-sm text-white">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(196,199,200,0.5)" }}>
                      {docTypeMeta.label}
                    </td>
                    <td className="px-6 py-4" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(196,199,200,0.5)" }}>
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          background: statusLabel === "Completed" ? "rgba(255,255,255,0.08)" : statusLabel === "Error" ? "rgba(255,180,171,0.1)" : "rgba(255,255,255,0.15)",
                          color: statusLabel === "Error" ? "#ffb4ab" : "#ffffff",
                          border: statusLabel === "Analyzing" ? "1px solid rgba(255,255,255,0.2)" : "none",
                        }}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {confidence > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${confidence}%`, background: "#ffffff", boxShadow: "0 0 6px rgba(255,255,255,0.4)" }}
                            />
                          </div>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#ffffff" }}>
                            {confidence}%
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(196,199,200,0.3)" }}>--%</span>
                      )}
                    </td>
                  </tr>
                )}) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center" style={{ color: "rgba(196,199,200,0.5)", fontSize: "13px" }}>
                      No documents analyzed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "GROSS PROFIT MARGIN", value: `${((financialData.grossProfit / financialData.revenue) * 100).toFixed(1)}%`, sub: "Revenue after COGS" },
            { label: "OPERATING MARGIN", value: `${((financialData.netProfit / financialData.revenue) * 100).toFixed(1)}%`, sub: "Net profit / Revenue" },
            { label: "DEBT-TO-EQUITY", value: (financialData.totalLiabilities / financialData.equity).toFixed(2), sub: "Liabilities / Equity" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="liquid-glass glass-highlight glass-hover p-6 rounded-xl flex justify-between items-center"
              style={{ borderRadius: "14px" }}
            >
              <div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
                  {stat.label}
                </p>
                <p className="text-xs" style={{ color: "rgba(196,199,200,0.35)" }}>{stat.sub}</p>
              </div>
              <span className="text-2xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
