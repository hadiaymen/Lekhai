"use client";

import { useState } from "react";
import { useFinancialStore } from "@/store/financialStore";
import Link from "next/link";

type TabType = "transactions" | "invoices" | "payroll";

const CATEGORIES = ["Sales", "Service Income", "Other Income", "Purchases", "Salaries", "Rent", "Utilities", "Bank Charges", "IT Expenses", "Freight", "Other Expenses"];

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

export default function ExtractedDataPage() {
  const { transactions, invoices, payroll, updateTransaction, updateInvoice, updatePayroll, recalculate } = useFinancialStore();
  const [tab, setTab] = useState<TabType>("transactions");
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const approvedTx = transactions.filter(t => t.approved).length;
  const approvedInv = invoices.filter(i => i.approved).length;
  const approvedPay = payroll.filter(p => p.approved).length;

  const tabs: { id: TabType; label: string; icon: string; count: number; approved: number }[] = [
    { id: "transactions", label: "Bank Transactions", icon: "receipt", count: transactions.length, approved: approvedTx },
    { id: "invoices", label: "Purchase Invoices", icon: "receipt_long", count: invoices.length, approved: approvedInv },
    { id: "payroll", label: "Payroll Data", icon: "people", count: payroll.length, approved: approvedPay },
  ];

  return (
    <div className="min-h-screen pb-16" style={{ background: "#0e0e0e" }}>
      <div className="max-w-[1440px] mx-auto px-12 pt-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
              Workflow Step 2 of 6
            </p>
            <h1 className="font-semibold tracking-tight text-white" style={{ fontSize: "40px", letterSpacing: "-0.02em" }}>
              Extracted Data Review
            </h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(196,199,200,0.5)" }}>
              Review, correct, and approve AI-extracted financial data before statement generation.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => recalculate()}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm transition-all hover:bg-[rgba(255,255,255,0.08)]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.15)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: "#ffffff",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>refresh</span>
              Recalculate
            </button>
            <Link
              href="/statements"
              className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all hover:brightness-90"
              style={{ background: "#ffffff", color: "#131313", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
              GENERATE STATEMENTS
            </Link>
          </div>
        </div>

        {/* Approval Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {tabs.map((t) => (
            <div
              key={t.id}
              className="liquid-glass-sm rounded-xl p-4 flex items-center gap-4 cursor-pointer glass-hover"
              style={{ borderRadius: "12px" }}
              onClick={() => setTab(t.id)}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: "18px" }}>{t.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-white font-medium">{t.label}</p>
                <p className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
                  {t.approved}/{t.count} approved
                </p>
              </div>
              <div className="text-right">
                <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(t.approved / t.count) * 100}%`, background: "#ffffff" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.04em",
                background: tab === t.id ? "#ffffff" : "rgba(255,255,255,0.04)",
                color: tab === t.id ? "#131313" : "rgba(196,199,200,0.5)",
                border: tab === t.id ? "none" : "1px solid rgba(255,255,255,0.08)",
                fontWeight: tab === t.id ? "700" : "500",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>{t.icon}</span>
              {t.label}
              <span
                className="px-1.5 py-0.5 rounded text-xs"
                style={{
                  background: tab === t.id ? "rgba(19,19,19,0.2)" : "rgba(255,255,255,0.08)",
                  fontSize: "10px",
                }}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="liquid-glass glass-highlight rounded-xl overflow-hidden" style={{ borderRadius: "16px" }}>
          {/* AI Classification Badge */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-white" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>psychology</span>
              <span className="text-sm font-medium text-white">AI Classification Engine</span>
              <span
                className="px-2 py-0.5 rounded text-xs"
                style={{ fontFamily: "'JetBrains Mono', monospace", background: "rgba(255,255,255,0.08)", color: "#ffffff" }}
              >
                OCR: Active
              </span>
              <span
                className="px-2 py-0.5 rounded text-xs"
                style={{ fontFamily: "'JetBrains Mono', monospace", background: "rgba(255,255,255,0.08)", color: "#ffffff" }}
              >
                Confidence: 98.4%
              </span>
            </div>
            <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
              Click cells to edit · Changes update calculations instantly
            </p>
          </div>

          {/* Transactions Table */}
          {tab === "transactions" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["Date", "Narration / Description", "Debit (₹)", "Credit (₹)", "Balance (₹)", "AI Category", "Status"].map(h => (
                      <th key={h} className="px-5 py-3 text-left" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(196,199,200,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="glass-row transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-5 py-3.5">
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "rgba(196,199,200,0.7)" }}>{t.date}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {editingCell === `${t.id}-narration` ? (
                          <input
                            autoFocus
                            defaultValue={t.narration}
                            onBlur={(e) => { updateTransaction(t.id, { narration: e.target.value }); setEditingCell(null); }}
                            className="bg-transparent border-b border-white text-sm text-white outline-none w-full"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          />
                        ) : (
                          <span
                            className="text-sm text-white cursor-pointer hover:underline"
                            onClick={() => setEditingCell(`${t.id}-narration`)}
                          >
                            {t.narration}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: t.debit > 0 ? "#ffb4ab" : "rgba(196,199,200,0.3)" }}>
                          {t.debit > 0 ? fmt(t.debit) : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: t.credit > 0 ? "rgba(255,255,255,0.9)" : "rgba(196,199,200,0.3)" }}>
                          {t.credit > 0 ? fmt(t.credit) : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "rgba(196,199,200,0.6)" }}>
                          {fmt(t.balance)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={t.category}
                          onChange={(e) => { updateTransaction(t.id, { category: e.target.value }); recalculate(); }}
                          className="text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#ffffff",
                          }}
                        >
                          {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#1f1f1f" }}>{c}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => { updateTransaction(t.id, { approved: !t.approved }); }}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            background: t.approved ? "rgba(255,255,255,0.1)" : "rgba(255,180,171,0.1)",
                            color: t.approved ? "#ffffff" : "#ffb4ab",
                            border: t.approved ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,180,171,0.2)",
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>
                            {t.approved ? "check_circle" : "pending"}
                          </span>
                          {t.approved ? "Approved" : "Pending"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "2px solid rgba(255,255,255,0.12)" }}>
                    <td colSpan={2} className="px-5 py-4 text-sm font-bold text-white">TOTALS</td>
                    <td className="px-5 py-4 text-right font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#ffb4ab" }}>
                      {fmt(transactions.reduce((s, t) => s + t.debit, 0))}
                    </td>
                    <td className="px-5 py-4 text-right font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#ffffff" }}>
                      {fmt(transactions.reduce((s, t) => s + t.credit, 0))}
                    </td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Invoices Table */}
          {tab === "invoices" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["Vendor Name", "Invoice #", "Date", "GST Number", "Tax (₹)", "Total (₹)", "Category", "Status"].map(h => (
                      <th key={h} className="px-5 py-3 text-left" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(196,199,200,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="glass-row" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-5 py-3.5 text-sm font-medium text-white">{inv.vendorName}</td>
                      <td className="px-5 py-3.5"><span className="ocr-highlight px-2 py-0.5 rounded text-xs text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{inv.invoiceNumber}</span></td>
                      <td className="px-5 py-3.5"><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "rgba(196,199,200,0.6)" }}>{inv.invoiceDate}</span></td>
                      <td className="px-5 py-3.5"><span className="ocr-highlight px-2 py-0.5 rounded text-xs text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{inv.gstNumber}</span></td>
                      <td className="px-5 py-3.5 text-right"><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#ffb4ab" }}>{fmt(inv.taxAmount)}</span></td>
                      <td className="px-5 py-3.5 text-right"><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#ffffff", fontWeight: "bold" }}>{fmt(inv.totalAmount)}</span></td>
                      <td className="px-5 py-3.5">
                        <select
                          value={inv.category}
                          onChange={(e) => updateInvoice(inv.id, { category: e.target.value })}
                          className="text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                          style={{ fontFamily: "'JetBrains Mono', monospace", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff" }}
                        >
                          {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#1f1f1f" }}>{c}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => updateInvoice(inv.id, { approved: !inv.approved })}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            background: inv.approved ? "rgba(255,255,255,0.1)" : "rgba(255,180,171,0.1)",
                            color: inv.approved ? "#ffffff" : "#ffb4ab",
                            border: inv.approved ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,180,171,0.2)",
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>{inv.approved ? "check_circle" : "pending"}</span>
                          {inv.approved ? "Approved" : "Pending"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payroll Table */}
          {tab === "payroll" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["Employee Name", "Gross Salary (₹)", "Deductions (₹)", "Net Salary (₹)", "Status"].map(h => (
                      <th key={h} className="px-5 py-3 text-left" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(196,199,200,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payroll.map((p) => (
                    <tr key={p.id} className="glass-row" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-5 py-3.5 text-sm font-medium text-white">{p.employeeName}</td>
                      <td className="px-5 py-3.5 text-right"><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#ffffff" }}>{fmt(p.grossSalary)}</span></td>
                      <td className="px-5 py-3.5 text-right"><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#ffb4ab" }}>{fmt(p.deductions)}</span></td>
                      <td className="px-5 py-3.5 text-right"><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#ffffff", fontWeight: "bold" }}>{fmt(p.netSalary)}</span></td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => updatePayroll(p.id, { approved: !p.approved })}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            background: p.approved ? "rgba(255,255,255,0.1)" : "rgba(255,180,171,0.1)",
                            color: p.approved ? "#ffffff" : "#ffb4ab",
                            border: p.approved ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,180,171,0.2)",
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>{p.approved ? "check_circle" : "pending"}</span>
                          {p.approved ? "Approved" : "Pending"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "2px solid rgba(255,255,255,0.12)" }}>
                    <td className="px-5 py-4 text-sm font-bold text-white">TOTAL</td>
                    <td className="px-5 py-4 text-right font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#ffffff" }}>
                      {fmt(payroll.reduce((s, p) => s + p.grossSalary, 0))}
                    </td>
                    <td className="px-5 py-4 text-right font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#ffb4ab" }}>
                      {fmt(payroll.reduce((s, p) => s + p.deductions, 0))}
                    </td>
                    <td className="px-5 py-4 text-right font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#ffffff" }}>
                      {fmt(payroll.reduce((s, p) => s + p.netSalary, 0))}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="flex justify-end mt-6">
          <Link
            href="/statements"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:brightness-90 active:scale-[0.98]"
            style={{ background: "#ffffff", color: "#131313", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", letterSpacing: "0.04em" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>analytics</span>
            GENERATE FINANCIAL STATEMENTS
          </Link>
        </div>
      </div>
    </div>
  );
}
