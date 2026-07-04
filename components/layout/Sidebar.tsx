"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/upload", label: "Upload Documents", icon: "upload_file" },
  { href: "/extracted-data", label: "Extracted Data", icon: "table_rows" },
  { href: "/statements", label: "Financial Statements", icon: "analytics" },
  { href: "/analysis", label: "AI Analysis", icon: "psychology" },
  { href: "/export", label: "Export Reports", icon: "file_download" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-[90] w-64 pt-16"
      style={{
        background: "rgba(14,14,14,0.85)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "20px 0 40px -15px rgba(0,0,0,0.5)",
      }}
    >
      {/* Precision Terminal Indicator */}
      <div className="px-6 pt-6 pb-4">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: "#ffffff",
              boxShadow: "0 0 8px rgba(255,255,255,0.7)",
              animation: "pulse 2s infinite",
            }}
          />
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "#ffffff" }}
            >
              LEKHAI AI
            </p>
            <p
              className="text-xs mt-0.5"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "rgba(196,199,200,0.5)",
              }}
            >
              Terminal Active
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${
                isActive
                  ? "sidebar-active"
                  : "text-[rgba(196,199,200,0.45)] hover:text-[rgba(226,226,226,0.9)] hover:bg-[rgba(255,255,255,0.05)]"
              }`}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", letterSpacing: "0.02em" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom CTA */}
      <div className="px-4 pb-6 space-y-3 border-t border-[rgba(255,255,255,0.05)] pt-4 mt-2">
        <Link
          href="/upload"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] hover:brightness-110"
          style={{
            background: "#ffffff",
            color: "#131313",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            letterSpacing: "0.05em",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
            add_circle
          </span>
          GENERATE REPORT
        </Link>
        <div className="flex flex-col gap-1">
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-1.5 transition-colors"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "rgba(196,199,200,0.4)",
              letterSpacing: "0.04em",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
              help
            </span>
            Support
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-1.5 transition-colors"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "rgba(196,199,200,0.4)",
              letterSpacing: "0.04em",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
              sensors
            </span>
            Network: Active
          </a>
        </div>
      </div>
    </aside>
  );
}
