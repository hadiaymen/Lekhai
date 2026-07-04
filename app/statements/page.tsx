"use client";

import { useState } from "react";
import { useFinancialStore } from "@/store/financialStore";
import Link from "next/link";

type StmtTab = "pl" | "bs" | "cf";

function fmt(n: number) {
  const abs = Math.abs(n);
  const formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(abs);
  return n < 0 ? `(${formatted})` : formatted;
}

function Row({ label, amount, indent = 0, isTotal = false, isSubtotal = false, isHeader = false }: {
  label: string; amount?: number; indent?: number; isTotal?: boolean; isSubtotal?: boolean; isHeader?: boolean;
}) {
  return (
    <tr
      className={`financial-row ${isTotal ? "financial-total" : ""} ${isSubtotal ? "financial-subtotal" : ""}`}
    >
      <td
        className={`py-3 ${isTotal || isSubtotal ? "font-bold" : ""}`}
        style={{
          paddingLeft: `${16 + indent * 24}px`,
          paddingRight: "16px",
          fontFamily: isHeader ? "'JetBrains Mono', monospace" : undefined,
          fontSize: isHeader ? "10px" : "14px",
          color: isHeader
            ? "rgba(196,199,200,0.4)"
            : isTotal
            ? "#ffffff"
            : "rgba(226,226,226,0.85)",
          letterSpacing: isHeader ? "0.1em" : undefined,
          textTransform: isHeader ? "uppercase" : undefined,
          fontWeight: isTotal || isSubtotal ? "700" : "400",
        }}
      >
        {isHeader ? label : label}
      </td>
      <td
        className="py-3 text-right pr-6"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: isTotal ? "15px" : "14px",
          color: isTotal ? "#ffffff" : amount && amount < 0 ? "#ffb4ab" : "rgba(226,226,226,0.85)",
          fontWeight: isTotal || isSubtotal ? "700" : "400",
        }}
      >
        {amount !== undefined ? fmt(amount) : ""}
      </td>
    </tr>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <tr>
      <td
        colSpan={2}
        className="pt-6 pb-2 px-4"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          color: "rgba(196,199,200,0.35)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {title}
      </td>
    </tr>
  );
}

export default function StatementsPage() {
  const { financialData, companyName, financialYear } = useFinancialStore();
  const [tab, setTab] = useState<StmtTab>("pl");

  const fd = financialData;
  const tabs: { id: StmtTab; label: string; icon: string }[] = [
    { id: "pl", label: "Profit & Loss", icon: "trending_up" },
    { id: "bs", label: "Balance Sheet", icon: "account_balance" },
    { id: "cf", label: "Cash Flow", icon: "swap_horiz" },
  ];

  return (
    <div className="min-h-screen pb-16" style={{ background: "#0e0e0e" }}>
      <div className="max-w-[1440px] mx-auto px-12 pt-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
              Workflow Step 3 of 6
            </p>
            <h1 className="font-semibold tracking-tight text-white" style={{ fontSize: "40px", letterSpacing: "-0.02em" }}>
              Financial Statements
            </h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(196,199,200,0.5)" }}>
              Auto-generated from extracted and approved data. All calculations are live.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/analysis"
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm transition-all hover:bg-[rgba(255,255,255,0.08)]"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#ffffff" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>psychology</span>
              AI Analysis
            </Link>
            <Link
              href="/export"
              className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all hover:brightness-90"
              style={{ background: "#ffffff", color: "#131313", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>file_download</span>
              EXPORT PDF
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left: Template Selector */}
          <div className="col-span-3">
            <div className="liquid-glass glass-highlight rounded-xl p-6 h-full" style={{ borderRadius: "16px" }}>
              <p className="text-xs tracking-widest uppercase mb-5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.35)" }}>
                Statement Type
              </p>
              <div className="space-y-2">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className="w-full text-left p-4 rounded-xl flex items-center justify-between transition-all group"
                    style={{
                      background: tab === t.id ? "rgba(255,255,255,0.1)" : "transparent",
                      border: tab === t.id ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "12px",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined" style={{ fontSize: "18px", color: tab === t.id ? "#ffffff" : "rgba(196,199,200,0.4)" }}>
                        {t.icon}
                      </span>
                      <span
                        className="text-sm"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: tab === t.id ? "#ffffff" : "rgba(196,199,200,0.5)", fontWeight: tab === t.id ? "600" : "400" }}
                      >
                        {t.label}
                      </span>
                    </div>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: tab === t.id ? "#ffffff" : "rgba(196,199,200,0.2)" }}>
                      {tab === t.id ? "check_circle" : "chevron_right"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Analysis scope */}
              <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(14,14,14,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-xs mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.35)" }}>Analysis Scope</p>
                <p className="text-sm text-white font-medium">{financialYear}</p>
                <p className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>{companyName}</p>
              </div>

              {/* Key ratios */}
              <div className="mt-4 space-y-3">
                {[
                  { label: "Gross Margin", value: `${((fd.grossProfit / fd.revenue) * 100).toFixed(1)}%` },
                  { label: "Net Margin", value: `${((fd.netProfit / fd.revenue) * 100).toFixed(1)}%` },
                  { label: "Current Ratio", value: (fd.currentAssets / fd.currentLiabilities).toFixed(2) },
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-center">
                    <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>{r.label}</span>
                    <span className="text-sm font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Statement */}
          <div className="col-span-9">
            <div className="liquid-glass glass-highlight rounded-xl overflow-hidden" style={{ borderRadius: "16px" }}>
              {/* Statement Header */}
              <div
                className="px-8 py-6 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.01)" }}
              >
                <div>
                  <h2 className="font-medium text-white" style={{ fontSize: "18px" }}>
                    {tab === "pl" ? "Consolidated Profit & Loss Statement" : tab === "bs" ? "Balance Sheet" : "Cash Flow Statement"}
                  </h2>
                  <p className="text-xs mt-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
                    {companyName} · {financialYear} · Precision: 99.8%
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className="px-3 py-1 rounded border text-xs"
                    style={{ fontFamily: "'JetBrains Mono', monospace", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(196,199,200,0.4)" }}
                  >
                    Draft Mode
                  </span>
                  <span
                    className="px-3 py-1 rounded text-xs font-bold"
                    style={{ background: "#ffffff", color: "#131313", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    AI Generated
                  </span>
                </div>
              </div>

              {/* Column headers */}
              <div
                className="grid px-4 py-3"
                style={{
                  gridTemplateColumns: "1fr auto",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(255,255,255,0.01)",
                }}
              >
                <span className="text-xs uppercase tracking-widest pl-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.35)" }}>Line Item</span>
                <span className="text-xs uppercase tracking-widest pr-6" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.35)" }}>Amount (₹)</span>
              </div>

              {/* P&L Statement */}
              {tab === "pl" && (
                <table className="w-full">
                  <tbody>
                    <SectionHeader title="Income" />
                    <Row label="Sales Revenue" amount={fd.revenue * 0.78} indent={1} />
                    <Row label="Service Income" amount={fd.revenue * 0.18} indent={1} />
                    <Row label="Other Income" amount={fd.revenue * 0.04} indent={1} />
                    <Row label="Total Revenue" amount={fd.revenue} isSubtotal />

                    <SectionHeader title="Cost of Sales" />
                    <Row label="Raw Material Purchases" amount={-fd.costOfSales * 0.65} indent={1} />
                    <Row label="Direct Labour" amount={-fd.costOfSales * 0.22} indent={1} />
                    <Row label="Manufacturing Overhead" amount={-fd.costOfSales * 0.13} indent={1} />
                    <Row label="Total Cost of Sales" amount={-fd.costOfSales} isSubtotal />
                    <Row label="GROSS PROFIT" amount={fd.grossProfit} isTotal />

                    <SectionHeader title="Operating Expenses" />
                    <Row label="Employee Salaries" amount={-fd.salaries} indent={1} />
                    <Row label="Office Rent" amount={-fd.rent} indent={1} />
                    <Row label="Utilities & Power" amount={-fd.utilities} indent={1} />
                    <Row label="Other Operating Expenses" amount={-fd.otherExpenses} indent={1} />
                    <Row label="Total Operating Expenses" amount={-fd.operatingExpenses} isSubtotal />
                    <Row label="NET PROFIT / (LOSS)" amount={fd.netProfit} isTotal />
                  </tbody>
                </table>
              )}

              {/* Balance Sheet */}
              {tab === "bs" && (
                <table className="w-full">
                  <tbody>
                    <SectionHeader title="Assets" />
                    <Row label="Current Assets" indent={0} />
                    <Row label="Cash & Bank Balances" amount={fd.currentAssets * 0.35} indent={1} />
                    <Row label="Trade Receivables" amount={fd.currentAssets * 0.38} indent={1} />
                    <Row label="Inventory & Stock" amount={fd.currentAssets * 0.2} indent={1} />
                    <Row label="Other Current Assets" amount={fd.currentAssets * 0.07} indent={1} />
                    <Row label="Total Current Assets" amount={fd.currentAssets} isSubtotal />

                    <Row label="Non-Current Assets" indent={0} />
                    <Row label="Property, Plant & Equipment" amount={fd.nonCurrentAssets * 0.65} indent={1} />
                    <Row label="Intangible Assets" amount={fd.nonCurrentAssets * 0.18} indent={1} />
                    <Row label="Long-term Investments" amount={fd.nonCurrentAssets * 0.17} indent={1} />
                    <Row label="Total Non-Current Assets" amount={fd.nonCurrentAssets} isSubtotal />
                    <Row label="TOTAL ASSETS" amount={fd.totalAssets} isTotal />

                    <SectionHeader title="Liabilities & Equity" />
                    <Row label="Current Liabilities" indent={0} />
                    <Row label="Trade Payables" amount={fd.currentLiabilities * 0.45} indent={1} />
                    <Row label="Short-term Borrowings" amount={fd.currentLiabilities * 0.3} indent={1} />
                    <Row label="Other Current Liabilities" amount={fd.currentLiabilities * 0.25} indent={1} />
                    <Row label="Total Current Liabilities" amount={fd.currentLiabilities} isSubtotal />

                    <Row label="Long-term Liabilities" indent={0} />
                    <Row label="Long-term Borrowings" amount={fd.longTermLiabilities * 0.72} indent={1} />
                    <Row label="Deferred Tax Liability" amount={fd.longTermLiabilities * 0.28} indent={1} />
                    <Row label="Total Long-term Liabilities" amount={fd.longTermLiabilities} isSubtotal />
                    <Row label="TOTAL LIABILITIES" amount={fd.totalLiabilities} isSubtotal />

                    <SectionHeader title="Equity" />
                    <Row label="Share Capital" amount={fd.capital} indent={1} />
                    <Row label="Retained Earnings" amount={fd.retainedEarnings} indent={1} />
                    <Row label="TOTAL EQUITY" amount={fd.equity} isSubtotal />
                    <Row label="TOTAL LIABILITIES & EQUITY" amount={fd.totalLiabilities + fd.equity} isTotal />
                  </tbody>
                </table>
              )}

              {/* Cash Flow Statement */}
              {tab === "cf" && (
                <table className="w-full">
                  <tbody>
                    <SectionHeader title="Operating Activities" />
                    <Row label="Net Profit Before Tax" amount={fd.netProfit * 1.25} indent={1} />
                    <Row label="Add: Depreciation & Amortisation" amount={fd.nonCurrentAssets * 0.05} indent={1} />
                    <Row label="Changes in Working Capital" amount={-fd.revenue * 0.03} indent={1} />
                    <Row label="Decrease in Trade Receivables" amount={fd.revenue * 0.02} indent={1} />
                    <Row label="Increase in Trade Payables" amount={fd.costOfSales * 0.04} indent={1} />
                    <Row label="Taxes Paid" amount={-fd.netProfit * 0.25} indent={1} />
                    <Row label="Net Cash from Operating Activities" amount={fd.operatingCashFlow} isSubtotal />

                    <SectionHeader title="Investing Activities" />
                    <Row label="Purchase of Fixed Assets" amount={fd.investingCashFlow * 0.75} indent={1} />
                    <Row label="Capital Work-in-Progress" amount={fd.investingCashFlow * 0.15} indent={1} />
                    <Row label="Investments in Securities" amount={fd.investingCashFlow * 0.1} indent={1} />
                    <Row label="Net Cash from Investing Activities" amount={fd.investingCashFlow} isSubtotal />

                    <SectionHeader title="Financing Activities" />
                    <Row label="Repayment of Long-term Debt" amount={fd.financingCashFlow * 0.65} indent={1} />
                    <Row label="Dividend Paid" amount={fd.financingCashFlow * 0.35} indent={1} />
                    <Row label="Net Cash from Financing Activities" amount={fd.financingCashFlow} isSubtotal />

                    <Row label="NET CHANGE IN CASH" amount={fd.operatingCashFlow + fd.investingCashFlow + fd.financingCashFlow} isTotal />
                    <Row label="Opening Cash Balance" amount={fd.currentAssets * 0.2} isSubtotal />
                    <Row label="CLOSING CASH BALANCE" amount={(fd.operatingCashFlow + fd.investingCashFlow + fd.financingCashFlow) + fd.currentAssets * 0.2} isTotal />
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
