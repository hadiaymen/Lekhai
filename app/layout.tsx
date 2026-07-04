import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lekhai AI – Financial Statement Generator",
  description:
    "AI-powered financial statement generation platform. Upload documents, extract data, generate P&L, Balance Sheet, Cash Flow statements, and export professional PDF reports.",
  keywords: "financial statements, AI accounting, P&L, balance sheet, cash flow, PDF export",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geist.variable} h-full antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
      >
        {/* Ambient background particles */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute w-96 h-96 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
              top: "10%",
              left: "20%",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute w-80 h-80 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
              bottom: "20%",
              right: "15%",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
              top: "60%",
              left: "50%",
              filter: "blur(50px)",
            }}
          />
        </div>

        <div className="relative z-10 flex h-full">
          <Sidebar />
          <div className="flex flex-col flex-1 min-h-screen pl-64">
            <Header />
            <main className="flex-1 pt-16 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
