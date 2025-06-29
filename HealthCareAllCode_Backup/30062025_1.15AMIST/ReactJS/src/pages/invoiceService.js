// src/pages/invoiceService.js
const BILLING_SERVICE = process.env.REACT_APP_BILLING_SERVICE;

export const fetchInvoicesByPatientId = async (patientId) => {
  const token = localStorage.getItem("jwtToken");
  const response = await fetch(`${BILLING_SERVICE}/api/invoices/patient/${patientId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch invoices.");
  }

  return response.json();
};
