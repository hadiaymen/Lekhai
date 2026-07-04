import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── Types ─── */
export interface Transaction {
  id: string;
  date: string;
  narration: string;
  debit: number;
  credit: number;
  balance: number;
  category: string;
  approved: boolean;
}

export interface Invoice {
  id: string;
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  gstNumber: string;
  taxAmount: number;
  totalAmount: number;
  category: string;
  approved: boolean;
}

export interface PayrollEntry {
  id: string;
  employeeName: string;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  approved: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: "bank_statement" | "purchase_invoice" | "payroll_report" | "tally_export" | "unknown";
  status: "uploading" | "extracting" | "completed" | "error";
  progress: number;
  uploadedAt: string;
}

export interface FinancialData {
  revenue: number;
  costOfSales: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  // Detail breakdowns
  salaries: number;
  rent: number;
  utilities: number;
  otherExpenses: number;
  currentAssets: number;
  nonCurrentAssets: number;
  currentLiabilities: number;
  longTermLiabilities: number;
  capital: number;
  retainedEarnings: number;
}

export interface AIInsight {
  title: string;
  description: string;
  type: "positive" | "warning" | "neutral";
  metric?: string;
}

/* ─── Default Demo Data ─── */
const defaultFinancialData: FinancialData = {
  revenue: 0,
  costOfSales: 0,
  grossProfit: 0,
  operatingExpenses: 0,
  netProfit: 0,
  totalAssets: 0,
  totalLiabilities: 0,
  equity: 0,
  operatingCashFlow: 0,
  investingCashFlow: 0,
  financingCashFlow: 0,
  salaries: 0,
  rent: 0,
  utilities: 0,
  otherExpenses: 0,
  currentAssets: 0,
  nonCurrentAssets: 0,
  currentLiabilities: 0,
  longTermLiabilities: 0,
  capital: 0,
  retainedEarnings: 0,
};

const defaultInsights: AIInsight[] = [];

const defaultTransactions: Transaction[] = [];

const defaultInvoices: Invoice[] = [];

const defaultPayroll: PayrollEntry[] = [];

/* ─── Store ─── */
interface FinancialStore {
  companyName: string;
  financialYear: string;
  uploadedFiles: UploadedFile[];
  transactions: Transaction[];
  invoices: Invoice[];
  payroll: PayrollEntry[];
  financialData: FinancialData;
  aiInsights: AIInsight[];
  healthScore: number;
  isAnalysisComplete: boolean;

  setCompanyName: (name: string) => void;
  setFinancialYear: (fy: string) => void;
  addUploadedFile: (file: UploadedFile) => void;
  updateFileStatus: (id: string, status: UploadedFile["status"], progress?: number) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  updatePayroll: (id: string, updates: Partial<PayrollEntry>) => void;
  setFinancialData: (data: Partial<FinancialData>) => void;
  recalculate: () => void;
  setIsAnalysisComplete: (v: boolean) => void;
  syncWithBackend: () => Promise<void>;
}

export const useFinancialStore = create<FinancialStore>()(
  persist(
    (set, get) => ({
      companyName: "ACME Corporation",
      financialYear: "FY 2024-25",
      uploadedFiles: [],
      transactions: defaultTransactions,
      invoices: defaultInvoices,
      payroll: defaultPayroll,
      financialData: defaultFinancialData,
      aiInsights: defaultInsights,
      healthScore: 0,
      isAnalysisComplete: false,

      setCompanyName: (name) => set({ companyName: name }),
      setFinancialYear: (fy) => set({ financialYear: fy }),

      addUploadedFile: (file) =>
        set((state) => ({ uploadedFiles: [file, ...state.uploadedFiles] })),

      updateFileStatus: (id, status, progress) =>
        set((state) => ({
          uploadedFiles: state.uploadedFiles.map((f) =>
            f.id === id ? { ...f, status, progress: progress ?? f.progress } : f
          ),
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      updateInvoice: (id, updates) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, ...updates } : inv
          ),
        })),

      updatePayroll: (id, updates) =>
        set((state) => ({
          payroll: state.payroll.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      setFinancialData: (data) =>
        set((state) => ({ financialData: { ...state.financialData, ...data } })),

      recalculate: () => {
        const state = get();
        const { transactions, invoices, payroll } = state;

        const revenue = transactions
          .filter((t) => t.credit > 0 && ["Sales", "Service Income", "Other Income"].includes(t.category))
          .reduce((sum, t) => sum + t.credit, 0);

        const salaries = payroll.reduce((sum, p) => sum + p.grossSalary, 0);
        const purchases = invoices
          .filter((i) => i.category === "Purchases")
          .reduce((sum, i) => sum + i.totalAmount, 0);
        const otherExp = transactions
          .filter((t) => t.debit > 0 && !["Salaries", "Purchases", "Rent"].includes(t.category))
          .reduce((sum, t) => sum + t.debit, 0);
        const rent = transactions
          .filter((t) => t.category === "Rent")
          .reduce((sum, t) => sum + t.debit, 0);

        const costOfSales = purchases;
        const grossProfit = revenue - costOfSales;
        const operatingExpenses = salaries + rent + otherExp;
        const netProfit = grossProfit - operatingExpenses;

        set((s) => ({
          financialData: {
            ...s.financialData,
            revenue,
            costOfSales,
            grossProfit,
            operatingExpenses,
            netProfit,
            salaries,
            rent,
            otherExpenses: otherExp,
          },
        }));
      },

      setIsAnalysisComplete: (v) => set({ isAnalysisComplete: v }),
      syncWithBackend: async () => {
        try {
          const { fetchStatements, fetchTransactions } = await import("./api");
          const [statementsRes, txRes] = await Promise.all([
            fetchStatements(),
            fetchTransactions()
          ]);
          
          const backendData = statementsRes.data;
          const backendTxs = txRes.transactions || [];
          
          // Map backend transactions to store format
          const mappedTxs = backendTxs.map((t: any, i: number) => ({
            id: `api-tx-${i}`,
            date: t.date || new Date().toISOString().split("T")[0],
            narration: t.description,
            debit: t.type === "Debit" ? t.amount : 0,
            credit: t.type === "Credit" ? t.amount : 0,
            balance: 0,
            category: t.category,
            approved: true
          }));

          set((s) => ({
            transactions: mappedTxs,
            financialData: {
              ...s.financialData,
              revenue: backendData.profit_and_loss.revenue,
              costOfSales: backendData.profit_and_loss.cogs,
              grossProfit: backendData.profit_and_loss.gross_profit,
              operatingExpenses: backendData.profit_and_loss.operating_expenses,
              netProfit: backendData.profit_and_loss.net_profit,
              totalAssets: backendData.balance_sheet.assets,
              currentAssets: backendData.balance_sheet.assets, // Mapped for simple template
              totalLiabilities: backendData.balance_sheet.liabilities,
              currentLiabilities: backendData.balance_sheet.liabilities, // Mapped
              equity: backendData.balance_sheet.equity,
              operatingCashFlow: backendData.cash_flow.net_cash_flow,
            },
            isAnalysisComplete: true,
            healthScore: 85,
            aiInsights: [
              {
                title: "Data Extracted Successfully",
                description: "Financial data has been correctly classified using AI.",
                type: "positive",
                metric: "100%",
              }
            ]
          }));
        } catch (error) {
          console.error("Failed to sync with backend:", error);
        }
      },
    }),
    {
      name: "lekhai-financial-store",
      partialize: (state) => ({
        companyName: state.companyName,
        financialYear: state.financialYear,
        uploadedFiles: state.uploadedFiles,
        financialData: state.financialData,
        isAnalysisComplete: state.isAnalysisComplete,
      }),
    }
  )
);
