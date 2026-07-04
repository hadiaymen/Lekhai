"use client";

import { useRef, useState } from "react";
import { useFinancialStore } from "@/store/financialStore";

function fmt(n: number) {
  const abs = Math.abs(n);
  const formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(abs);
  return n < 0 ? `(${formatted})` : formatted;
}

export default function ExportPage() {
  const { financialData: fd, companyName, financialYear, aiInsights, healthScore } = useFinancialStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleGeneratePDF = async () => {
    setGenerating(true);
    setDone(false);

    try {
      const { exportPDF } = await import("@/store/api");
      await exportPDF();

      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  const sections = [
    { num: "01", title: "Cover Page", desc: "Company name, financial year, report date, Lekhai AI signature" },
    { num: "02", title: "Executive Summary", desc: "Revenue, Expenses, Net Profit, Assets, Liabilities KPI cards" },
    { num: "03", title: "Profit & Loss Statement", desc: "Revenue → COGS → Gross Profit → OpEx → Net Profit" },
    { num: "04", title: "Balance Sheet", desc: "Assets, Liabilities, and Equity with sub-categories" },
    { num: "05", title: "Cash Flow Statement", desc: "Operating, Investing, and Financing activities" },
    { num: "06", title: "AI Financial Analysis", desc: "Key findings, insights, and financial health narrative" },
    { num: "07", title: "Notes & Signature", desc: "Prepared by Lekhai AI · disclaimer and metadata" },
  ];

  return (
    <div className="min-h-screen pb-16" style={{ background: "#0e0e0e" }}>
      <div className="max-w-[1440px] mx-auto px-12 pt-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
            Workflow Step 5 of 6 · Final Step
          </p>
          <h1 className="font-semibold tracking-tight text-white" style={{ fontSize: "40px", letterSpacing: "-0.02em" }}>
            Export Reports
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(196,199,200,0.5)" }}>
            Generate professional accountant-grade PDF financial reports.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* PDF Structure Preview */}
          <div className="col-span-4 space-y-4">
            <div className="liquid-glass glass-highlight rounded-xl p-6" style={{ borderRadius: "16px" }}>
              <p className="text-xs tracking-widest uppercase mb-5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.35)" }}>
                PDF Report Structure
              </p>
              <div className="space-y-3">
                {sections.map((s) => (
                  <div
                    key={s.num}
                    className="flex items-start gap-4 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px" }}
                  >
                    <span
                      className="text-lg font-bold shrink-0"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.2)" }}
                    >
                      {s.num}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{s.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(196,199,200,0.4)" }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Preview + Generate */}
          <div className="col-span-8 space-y-6">
            {/* Report Summary Panel */}
            <div className="liquid-glass glass-highlight rounded-xl p-8" style={{ borderRadius: "16px" }}>
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="font-medium text-white" style={{ fontSize: "20px" }}>Financial Statement Report</h2>
                  <p className="text-sm mt-1" style={{ color: "rgba(196,199,200,0.5)" }}>
                    {companyName} · {financialYear}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
                    {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                  <p className="text-xs mt-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
                    Health Score: {healthScore}/100
                  </p>
                </div>
              </div>

              {/* Financial Summary in PDF-preview style */}
              <div
                className="rounded-xl p-6"
                style={{ background: "rgba(14,14,14,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div
                  className="mb-4 pb-4"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.35)" }}>
                    Executive KPI Summary
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "REVENUE", value: `₹${(fd.revenue / 10000000).toFixed(2)}Cr` },
                    { label: "NET PROFIT", value: `₹${(fd.netProfit / 10000000).toFixed(2)}Cr` },
                    { label: "TOTAL ASSETS", value: `₹${(fd.totalAssets / 10000000).toFixed(2)}Cr` },
                  ].map((k) => (
                    <div key={k.label} className="text-center">
                      <p className="text-xs mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.35)", letterSpacing: "0.08em" }}>
                        {k.label}
                      </p>
                      <p className="text-xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {k.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Mini P&L */}
                <table className="w-full">
                  <tbody>
                    {[
                      { label: "Total Revenue", value: fmt(fd.revenue), bold: false },
                      { label: "Cost of Sales", value: `(${fmt(fd.costOfSales)})`, bold: false },
                      { label: "Gross Profit", value: fmt(fd.grossProfit), bold: true },
                      { label: "Operating Expenses", value: `(${fmt(fd.operatingExpenses)})`, bold: false },
                      { label: "Net Profit", value: fmt(fd.netProfit), bold: true },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        style={{
                          borderTop: row.bold ? "1px solid rgba(255,255,255,0.1)" : undefined,
                          borderBottom: row.bold ? "1px solid rgba(255,255,255,0.06)" : undefined,
                        }}
                      >
                        <td className="py-2 text-sm" style={{ color: row.bold ? "#ffffff" : "rgba(196,199,200,0.6)", fontWeight: row.bold ? "700" : "400" }}>
                          {row.label}
                        </td>
                        <td className="py-2 text-right text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: row.bold ? "#ffffff" : "rgba(196,199,200,0.6)", fontWeight: row.bold ? "700" : "400" }}>
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Generate Button */}
            <div className="liquid-glass glass-highlight rounded-xl p-8" style={{ borderRadius: "16px" }}>
              <h3 className="font-medium text-white mb-2" style={{ fontSize: "16px" }}>Generate PDF Report</h3>
              <p className="text-sm mb-6" style={{ color: "rgba(196,199,200,0.5)" }}>
                Professional accountant-grade PDF with all financial statements, AI analysis, and executive summary.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={handleGeneratePDF}
                  disabled={generating}
                  className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:brightness-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "#ffffff",
                    color: "#131313",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "13px",
                    letterSpacing: "0.04em",
                    minWidth: "220px",
                  }}
                >
                  <span
                    className={`material-symbols-outlined ${generating ? "animate-spin" : ""}`}
                    style={{ fontSize: "20px", animationDuration: "2s" }}
                  >
                    {generating ? "autorenew" : done ? "check_circle" : "picture_as_pdf"}
                  </span>
                  {generating ? "GENERATING PDF…" : done ? "DOWNLOADED!" : "GENERATE & DOWNLOAD PDF"}
                </button>

                <div
                  className="flex-1 rounded-xl p-4 flex items-center gap-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span className="material-symbols-outlined text-white" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>
                    info
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(196,199,200,0.5)" }}>
                    PDF is generated client-side using jsPDF and includes all financial data, AI insights, and professional branding.
                  </p>
                </div>
              </div>

              {done && (
                <div
                  className="mt-4 p-4 rounded-xl flex items-center gap-3"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px" }}
                >
                  <span className="material-symbols-outlined text-white" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <div>
                    <p className="text-sm font-medium text-white">PDF Downloaded Successfully</p>
                    <p className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
                      {companyName}_{financialYear.replace(/\s+/g, "_")}_Financial_Report.pdf
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
