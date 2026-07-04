"use client";

import { useState } from "react";
import { useFinancialStore } from "@/store/financialStore";

const FY_OPTIONS = ["FY 2024-25", "FY 2023-24", "FY 2022-23", "FY 2021-22"];

export default function Header() {
  const [fyOpen, setFyOpen] = useState(false);
  const { companyName, financialYear, setFinancialYear } = useFinancialStore();

  return (
    <header
      className="fixed top-0 left-64 right-0 z-[100] flex justify-between items-center h-16 px-8"
      style={{
        background: "rgba(14,14,14,0.75)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      {/* Left: Company name + FY selector */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#ffffff", color: "#0e0e0e" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>
              receipt_long
            </span>
          </div>
          <span
            className="font-bold tracking-tight text-white"
            style={{ fontSize: "15px", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {companyName || "ACME CORP"}
          </span>
        </div>

        <div className="h-4 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* Financial Year Selector */}
        <div className="relative">
          <button
            onClick={() => setFyOpen(!fyOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "rgba(226,226,226,0.8)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>calendar_today</span>
            {financialYear}
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>expand_more</span>
          </button>
          {fyOpen && (
            <div
              className="absolute top-full left-0 mt-2 w-40 rounded-xl py-2 z-50"
              style={{
                background: "rgba(20,20,20,0.95)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
              }}
            >
              {FY_OPTIONS.map((fy) => (
                <button
                  key={fy}
                  onClick={() => { setFinancialYear(fy); setFyOpen(false); }}
                  className="w-full text-left px-4 py-2.5 transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    color: financialYear === fy ? "#ffffff" : "rgba(196,199,200,0.6)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {financialYear === fy && (
                    <span className="material-symbols-outlined mr-2" style={{ fontSize: "12px" }}>check</span>
                  )}
                  {fy}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Search + Avatar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          className="recessed-input flex items-center gap-2 px-4 py-1.5 rounded-full w-56"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "rgba(196,199,200,0.4)" }}>
            search
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm flex-1 placeholder-[rgba(196,199,200,0.25)]"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "rgba(226,226,226,0.8)" }}
          />
        </div>

        {/* Notification bell */}
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-[rgba(255,255,255,0.06)]"
          style={{ color: "rgba(196,199,200,0.5)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>notifications</span>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p
              className="text-xs font-bold leading-tight text-white"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Finance User
            </p>
            <p
              className="text-xs leading-tight"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)", fontSize: "10px" }}
            >
              Accountant
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#ffffff",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            F
          </div>
        </div>
      </div>
    </header>
  );
}
