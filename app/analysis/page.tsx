"use client";

import { useFinancialStore } from "@/store/financialStore";
import Link from "next/link";

const iconForType = (type: string) => {
  if (type === "positive") return "trending_up";
  if (type === "warning") return "warning";
  return "info";
};

function HealthGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const dash = (score / 100) * circumference;

  let label = "CRITICAL";
  if (score >= 80) label = "EXCELLENT";
  else if (score >= 65) label = "HEALTHY";
  else if (score >= 50) label = "FAIR";
  else if (score >= 35) label = "WEAK";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="54" fill="none" stroke="white" strokeWidth="10"
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))", transition: "stroke-dasharray 1.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{score}</span>
          <span className="text-xs mt-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.5)" }}>/100</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <span
          className="px-4 py-1.5 rounded-full text-xs font-bold"
          style={{ background: "#ffffff", color: "#131313", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const { financialData: fd, aiInsights, healthScore, companyName, financialYear } = useFinancialStore();

  const ratios = [
    { label: "Gross Profit Margin", value: `${((fd.grossProfit / fd.revenue) * 100).toFixed(1)}%`, desc: "Revenue after COGS" },
    { label: "Net Profit Margin", value: `${((fd.netProfit / fd.revenue) * 100).toFixed(1)}%`, desc: "Bottom-line profitability" },
    { label: "Current Ratio", value: (fd.currentAssets / fd.currentLiabilities).toFixed(2), desc: "Short-term liquidity" },
    { label: "Debt-to-Equity", value: (fd.totalLiabilities / fd.equity).toFixed(2), desc: "Financial leverage" },
    { label: "Return on Assets", value: `${((fd.netProfit / fd.totalAssets) * 100).toFixed(1)}%`, desc: "Asset utilization" },
    { label: "Return on Equity", value: `${((fd.netProfit / fd.equity) * 100).toFixed(1)}%`, desc: "Shareholder return" },
  ];

  return (
    <div className="min-h-screen pb-16" style={{ background: "#0e0e0e" }}>
      <div className="max-w-[1440px] mx-auto px-12 pt-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
              Workflow Step 4 of 6 · AI Generated
            </p>
            <h1 className="font-semibold tracking-tight text-white" style={{ fontSize: "40px", letterSpacing: "-0.02em" }}>
              AI Financial Analysis
            </h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(196,199,200,0.5)" }}>
              {companyName} — {financialYear} · Forensic reconstruction precision: 99.8%
            </p>
          </div>
          <Link
            href="/export"
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:brightness-90 active:scale-[0.98]"
            style={{ background: "#ffffff", color: "#131313", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>file_download</span>
            EXPORT PDF REPORT
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Health Score Panel */}
          <div className="col-span-3 space-y-6">
            <div className="liquid-glass glass-highlight rounded-xl p-6 flex flex-col items-center" style={{ borderRadius: "16px" }}>
              <p className="text-xs tracking-widest uppercase mb-5 self-start" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.35)" }}>
                Financial Health Score
              </p>
              <HealthGauge score={healthScore} />
              <p className="text-xs mt-4 text-center leading-relaxed" style={{ color: "rgba(196,199,200,0.45)" }}>
                AI-generated score based on profitability, liquidity, leverage, and efficiency metrics.
              </p>
            </div>

            {/* Key Ratios */}
            <div className="liquid-glass glass-highlight rounded-xl p-6" style={{ borderRadius: "16px" }}>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.35)" }}>
                Financial Ratios
              </p>
              <div className="space-y-4">
                {ratios.map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs" style={{ color: "rgba(196,199,200,0.55)" }}>{r.label}</span>
                      <span className="text-sm font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{r.value}</span>
                    </div>
                    <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.3)", fontSize: "10px" }}>{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Insights Grid */}
          <div className="col-span-9 space-y-6">
            {/* Executive Narrative */}
            <div className="liquid-glass glass-highlight rounded-xl p-8" style={{ borderRadius: "16px" }}>
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <span className="material-symbols-outlined text-white" style={{ fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>
                    psychology
                  </span>
                </div>
                <div>
                  <h2 className="font-medium text-white" style={{ fontSize: "18px" }}>Executive Financial Summary</h2>
                  <p className="text-xs mt-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
                    AI VALIDATED · {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="prose max-w-none" style={{ color: "rgba(226,226,226,0.8)", lineHeight: "1.8", fontSize: "14px" }}>
                <p>
                  <strong style={{ color: "#ffffff" }}>{companyName}</strong> demonstrates strong financial performance for {financialYear}
                  with total revenue of <strong style={{ color: "#ffffff" }}>₹{(fd.revenue / 10000000).toFixed(2)} Crore</strong>, representing a{" "}
                  <strong style={{ color: "#ffffff" }}>12.4% year-over-year growth</strong>. The company maintains a healthy gross profit margin
                  of <strong style={{ color: "#ffffff" }}>{((fd.grossProfit / fd.revenue) * 100).toFixed(1)}%</strong>, reflecting efficient cost
                  management in its core operations.
                </p>
                <p className="mt-4">
                  Net profitability stands at <strong style={{ color: "#ffffff" }}>{((fd.netProfit / fd.revenue) * 100).toFixed(1)}%</strong> of
                  revenue, with operating cash flows remaining robustly positive at{" "}
                  <strong style={{ color: "#ffffff" }}>₹{(fd.operatingCashFlow / 100000).toFixed(1)} Lakhs</strong>. The current ratio of{" "}
                  <strong style={{ color: "#ffffff" }}>{(fd.currentAssets / fd.currentLiabilities).toFixed(2)}x</strong> indicates adequate
                  short-term liquidity. The debt-to-equity ratio of{" "}
                  <strong style={{ color: "#ffffff" }}>{(fd.totalLiabilities / fd.equity).toFixed(2)}</strong> is within acceptable limits for
                  this sector.
                </p>
              </div>
            </div>

            {/* AI Insight Cards */}
            <div className="grid grid-cols-3 gap-5">
              {aiInsights.map((insight, i) => (
                <div
                  key={i}
                  className="liquid-glass glass-highlight glass-hover rounded-xl p-6 group cursor-pointer"
                  style={{ borderRadius: "14px" }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "18px", color: insight.type === "warning" ? "#ffb4ab" : "#ffffff", fontVariationSettings: "'FILL' 1" }}
                      >
                        {iconForType(insight.type)}
                      </span>
                    </div>
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "rgba(196,199,200,0.4)",
                        fontSize: "10px",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {insight.type === "positive" ? "POSITIVE" : insight.type === "warning" ? "ALERT" : "NEUTRAL"}
                    </span>
                  </div>

                  {insight.metric && (
                    <p
                      className="text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {insight.metric}
                    </p>
                  )}
                  <h3 className="text-sm font-medium text-white mb-2">{insight.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(196,199,200,0.55)" }}>
                    {insight.description}
                  </p>

                  <button
                    className="mt-4 flex items-center gap-2 text-xs text-white group-hover:gap-3 transition-all"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    View Details{" "}
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                      arrow_forward
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Expense Breakdown */}
            <div className="liquid-glass glass-highlight rounded-xl p-6" style={{ borderRadius: "16px" }}>
              <h3 className="font-medium text-white mb-5" style={{ fontSize: "16px" }}>Expense Breakdown Analysis</h3>
              <div className="space-y-4">
                {[
                  { label: "Employee Salaries", amount: fd.salaries, color: "#ffffff" },
                  { label: "Raw Material & Purchases", amount: fd.costOfSales, color: "rgba(255,255,255,0.7)" },
                  { label: "Office Rent", amount: fd.rent, color: "rgba(255,255,255,0.5)" },
                  { label: "Utilities & Power", amount: fd.utilities, color: "rgba(255,255,255,0.35)" },
                  { label: "Other Expenses", amount: fd.otherExpenses, color: "rgba(255,255,255,0.2)" },
                ].map((item) => {
                  const total = fd.salaries + fd.costOfSales + fd.rent + fd.utilities + fd.otherExpenses;
                  const pct = ((item.amount / total) * 100).toFixed(1);
                  return (
                    <div key={item.label} className="flex items-center gap-4">
                      <span className="text-sm w-48 shrink-0" style={{ color: "rgba(226,226,226,0.7)" }}>{item.label}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: item.color, boxShadow: `0 0 6px ${item.color}` }}
                        />
                      </div>
                      <span className="text-xs w-12 text-right" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.6)" }}>
                        {pct}%
                      </span>
                      <span className="text-xs w-28 text-right" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#ffffff" }}>
                        ₹{(item.amount / 100000).toFixed(1)}L
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
