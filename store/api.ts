const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload document");
  }
  return response.json();
};

export const checkDocumentStatus = async (docId: string) => {
  const response = await fetch(`${API_BASE_URL}/upload/${docId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch document status");
  }
  return response.json();
};

export const fetchStatements = async () => {
  const response = await fetch(`${API_BASE_URL}/statements/`);
  if (!response.ok) {
    throw new Error("Failed to fetch statements");
  }
  return response.json();
};

export const fetchTransactions = async () => {
  const response = await fetch(`${API_BASE_URL}/upload/all/data`);
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return response.json();
};

export const exportPDF = async () => {
  const response = await fetch(`${API_BASE_URL}/export/`, {
    method: "GET",
  });
  
  if (!response.ok) {
    throw new Error("Failed to export PDF");
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Financial_Statement.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
};
