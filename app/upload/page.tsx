"use client";

import { useRef, useState, useCallback } from "react";
import { useFinancialStore, UploadedFile } from "@/store/financialStore";
import Link from "next/link";

const ACCEPT_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "text/csv": "CSV",
  "text/xml": "XML",
  "application/xml": "XML",
  "image/jpeg": "JPG",
  "image/png": "PNG",
};

function detectDocType(filename: string): UploadedFile["type"] {
  const lower = filename.toLowerCase();
  if (lower.includes("bank") || lower.includes("statement") || lower.includes("hdfc") || lower.includes("sbi")) return "bank_statement";
  if (lower.includes("invoice") || lower.includes("bill") || lower.includes("purchase") || lower.includes("vendor")) return "purchase_invoice";
  if (lower.includes("payroll") || lower.includes("salary") || lower.includes("hr") || lower.includes("employee")) return "payroll_report";
  if (lower.includes("tally") || lower.includes("ledger") || lower.includes("trial")) return "tally_export";
  return "unknown";
}

const DOC_TYPE_META: Record<UploadedFile["type"], { label: string; icon: string; color: string }> = {
  bank_statement: { label: "Bank Statement", icon: "account_balance", color: "rgba(255,255,255,0.9)" },
  purchase_invoice: { label: "Purchase Invoice", icon: "receipt_long", color: "rgba(255,255,255,0.7)" },
  payroll_report: { label: "Payroll Report", icon: "people", color: "rgba(255,255,255,0.7)" },
  tally_export: { label: "Tally Export", icon: "table_chart", color: "rgba(255,255,255,0.7)" },
  unknown: { label: "Auto-detecting…", icon: "psychology", color: "rgba(196,199,200,0.5)" },
};

const SUPPORTED_TYPES = [
  { title: "Bank Statements", formats: "PDF · XLSX · CSV", icon: "account_balance", desc: "HDFC, ICICI, SBI, Axis, Kotak etc." },
  { title: "Purchase Bills", formats: "PDF · JPG · PNG", icon: "receipt_long", desc: "Vendor invoices with GST details" },
  { title: "Payroll Reports", formats: "PDF · XLSX · CSV", icon: "groups", desc: "Employee salary & deduction data" },
  { title: "Tally Exports", formats: "XLSX · CSV · XML", icon: "table_chart", desc: "Ledger, trial balance, P&L exports" },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function UploadPage() {
  const { addUploadedFile, updateFileStatus, uploadedFiles } = useFinancialStore();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      const id = `f-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const docType = detectDocType(file.name);
      const newFile: UploadedFile = {
        id,
        name: file.name,
        size: file.size,
        type: docType,
        status: "uploading",
        progress: 0,
        uploadedAt: new Date().toISOString(),
      };
      addUploadedFile(newFile);

      // Call API and handle progress (polling implementation)
      import("@/store/api").then(({ uploadDocument, checkDocumentStatus }) => {
        updateFileStatus(id, "uploading", 30);
        uploadDocument(file)
          .then((res) => {
            updateFileStatus(id, "extracting", 50);
            
            // Poll until completed
            const pollInterval = setInterval(async () => {
              try {
                const statusRes = await checkDocumentStatus(res.document_id);
                if (statusRes.status === "completed") {
                  clearInterval(pollInterval);
                  updateFileStatus(id, "completed", 100);
                  // After processing is fully complete, sync data
                  useFinancialStore.getState().syncWithBackend();
                } else if (statusRes.status.startsWith("error")) {
                  clearInterval(pollInterval);
                  updateFileStatus(id, "error", 0);
                }
              } catch (err) {
                clearInterval(pollInterval);
                updateFileStatus(id, "error", 0);
              }
            }, 2000);
          })
          .catch((err) => {
            console.error(err);
            updateFileStatus(id, "error", 0);
          });
      });
    },
    [addUploadedFile, updateFileStatus]
  );

  const handleFiles = (files: FileList | File[]) => {
    Array.from(files).forEach(processFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const statusColor: Record<UploadedFile["status"], string> = {
    uploading: "rgba(255,255,255,0.6)",
    extracting: "rgba(255,255,255,0.9)",
    completed: "rgba(255,255,255,1)",
    error: "#ffb4ab",
  };

  return (
    <div className="min-h-screen pb-16" style={{ background: "#0e0e0e" }}>
      <div className="max-w-[1440px] mx-auto px-12 pt-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
            Workflow Step 1 of 6
          </p>
          <h1 className="font-semibold tracking-tight text-white" style={{ fontSize: "40px", letterSpacing: "-0.02em" }}>
            Statement Ingestion
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(196,199,200,0.5)" }}>
            Upload financial documents for AI-powered extraction and classification.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Upload Area */}
          <div className="col-span-8 space-y-6">
            {/* Drop Zone */}
            <div
              className={`liquid-glass glass-highlight rounded-xl p-12 relative overflow-hidden cursor-pointer transition-all duration-300 ${dragActive ? "drop-zone-active" : ""}`}
              style={{ borderRadius: "16px" }}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />
              <div
                className="relative flex flex-col items-center justify-center text-center rounded-xl p-16 transition-all duration-300"
                style={{
                  border: `2px dashed ${dragActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.12)"}`,
                  borderRadius: "12px",
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <span className="material-symbols-outlined text-white" style={{ fontSize: "36px" }}>
                    {dragActive ? "file_present" : "upload_file"}
                  </span>
                </div>
                <h2 className="font-medium text-white mb-3" style={{ fontSize: "22px" }}>
                  {dragActive ? "Release to Upload" : "Ingest Financial Documents"}
                </h2>
                <p className="mb-8 max-w-md" style={{ color: "rgba(196,199,200,0.55)", fontSize: "14px", lineHeight: "1.6" }}>
                  Drag and drop files here, or click to browse.{" "}
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>
                    PDF · XLSX · CSV · JPG · PNG · XML
                  </span>
                </p>
                <div className="flex gap-4">
                  <button
                    className="px-8 py-3 rounded-full font-bold text-sm transition-all hover:brightness-90 active:scale-[0.98]"
                    style={{ background: "#ffffff", color: "#131313", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: "0.04em" }}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    SELECT FILES
                  </button>
                  <button
                    className="px-8 py-3 rounded-full font-bold text-sm transition-all hover:bg-[rgba(255,255,255,0.1)]"
                    style={{
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(255,255,255,0.04)",
                      backdropFilter: "blur(10px)",
                      color: "#ffffff",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "12px",
                      letterSpacing: "0.04em",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    CLOUD IMPORT
                  </button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png,.xml"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
            </div>

            {/* Supported Types Grid */}
            <div className="grid grid-cols-2 gap-4">
              {SUPPORTED_TYPES.map((st) => (
                <div
                  key={st.title}
                  className="liquid-glass-sm glass-hover rounded-xl p-5 flex items-start gap-4 cursor-pointer"
                  style={{ borderRadius: "12px" }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <span className="material-symbols-outlined text-white" style={{ fontSize: "18px" }}>{st.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{st.title}</p>
                    <p className="text-xs mt-0.5 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.45)" }}>
                      {st.formats}
                    </p>
                    <p className="text-xs" style={{ color: "rgba(196,199,200,0.4)" }}>{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Uploads */}
            {uploadedFiles.filter(f => f.status !== "completed").length > 0 && (
              <div className="liquid-glass rounded-xl p-6" style={{ borderRadius: "16px" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-white animate-spin" style={{ fontSize: "18px", animationDuration: "3s" }}>
                      autorenew
                    </span>
                    Active Uploads
                  </h3>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(196,199,200,0.4)" }}>
                    OCR: Active
                  </span>
                </div>
                <div className="space-y-4">
                  {uploadedFiles.filter(f => f.status !== "completed").map(f => (
                    <div key={f.id} className="space-y-2 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: statusColor[f.status] }}>{DOC_TYPE_META[f.type].icon}</span>
                          <div>
                            <p className="text-sm text-white">{f.name}</p>
                            <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)" }}>
                              {DOC_TYPE_META[f.type].label} · {formatSize(f.size)}
                            </p>
                          </div>
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: statusColor[f.status] }}>
                          {Math.round(f.progress)}%
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${f.progress}%`, background: "#ffffff", boxShadow: "0 0 8px rgba(255,255,255,0.4)" }}
                        />
                      </div>
                      <p className="text-xs italic" style={{ color: "rgba(196,199,200,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {f.status === "extracting" ? "AI extracting data…" : "Uploading…"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadedFiles.filter(f => f.status === "completed").length > 0 && (
              <div className="flex justify-end">
                <Link
                  href="/extracted-data"
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:brightness-90 active:scale-[0.98]"
                  style={{ background: "#ffffff", color: "#131313", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                  REVIEW EXTRACTED DATA
                </Link>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="col-span-4 space-y-6">
            {/* Completed Files */}
            <div className="liquid-glass rounded-xl p-6 h-full flex flex-col" style={{ borderRadius: "16px" }}>
              <h3 className="font-medium text-white text-sm mb-5 flex items-center justify-between">
                Recent Ingests
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "rgba(196,199,200,0.3)" }}>autorenew</span>
              </h3>

              {/* Batch Progress Cards */}
              <div className="space-y-4 flex-1">
                {uploadedFiles.length === 0 ? (
                  <>
                    {[
                      { name: "Bank_Statement_Mar2025.pdf", type: "Bank Statement", ago: "2 hrs ago", verified: true },
                      { name: "Payroll_Q4_2025.xlsx", type: "Payroll Report", ago: "Yesterday", verified: true },
                      { name: "GST_Invoice_Batch.pdf", type: "Purchase Bills", ago: "Mar 25", verified: true },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <span className="material-symbols-outlined text-white" style={{ fontSize: "18px" }}>description</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{f.name}</p>
                          <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)", fontSize: "10px" }}>
                            {f.ago} · {f.verified ? "✓ Verified" : "Pending"}
                          </p>
                        </div>
                        <span
                          className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ fontSize: "18px", color: "#ffffff" }}
                        >
                          arrow_forward
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  uploadedFiles.filter(f => f.status === "completed").map(f => (
                    <div key={f.id} className="flex items-center gap-4 group">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <span className="material-symbols-outlined text-white" style={{ fontSize: "18px" }}>
                          {DOC_TYPE_META[f.type].icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{f.name}</p>
                        <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(196,199,200,0.4)", fontSize: "10px" }}>
                          {DOC_TYPE_META[f.type].label} · ✓ Extracted
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* AI Status Card */}
              <div
                className="mt-6 p-4 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>
                    security
                  </span>
                  <span className="text-sm font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    AI Extraction Engine
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(196,199,200,0.55)" }}>
                  Documents are processed using OCR + NLP pipeline. Bank statements, invoices, and payroll data are automatically classified and structured into JSON for review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
