export type ProvinceCode = "AB" | "BC" | "MB" | "NB" | "NL" | "NS" | "NT" | "NU" | "ON" | "PE" | "QC" | "SK" | "YT";

export type TaxRateDetails = {
  province: ProvinceCode;
  provinceName: string;
  gstRate: number;
  pstRate: number;
  hstRate: number;
  qstRate: number;
  combinedRate: number;
  taxType: "HST" | "GST+PST" | "GST+QST" | "GST";
};

export const PROVINCIAL_TAX_RATES: Record<ProvinceCode, TaxRateDetails> = {
  AB: { province: "AB", provinceName: "Alberta", gstRate: 0.05, pstRate: 0, hstRate: 0, qstRate: 0, combinedRate: 0.05, taxType: "GST" },
  BC: { province: "BC", provinceName: "British Columbia", gstRate: 0.05, pstRate: 0.07, hstRate: 0, qstRate: 0, combinedRate: 0.12, taxType: "GST+PST" },
  MB: { province: "MB", provinceName: "Manitoba", gstRate: 0.05, pstRate: 0.07, hstRate: 0, qstRate: 0, combinedRate: 0.12, taxType: "GST+PST" },
  NB: { province: "NB", provinceName: "New Brunswick", gstRate: 0, pstRate: 0, hstRate: 0.15, qstRate: 0, combinedRate: 0.15, taxType: "HST" },
  NL: { province: "NL", provinceName: "Newfoundland and Labrador", gstRate: 0, pstRate: 0, hstRate: 0.15, qstRate: 0, combinedRate: 0.15, taxType: "HST" },
  NS: { province: "NS", provinceName: "Nova Scotia", gstRate: 0, pstRate: 0, hstRate: 0.15, qstRate: 0, combinedRate: 0.15, taxType: "HST" },
  NT: { province: "NT", provinceName: "Northwest Territories", gstRate: 0.05, pstRate: 0, hstRate: 0, qstRate: 0, combinedRate: 0.05, taxType: "GST" },
  NU: { province: "NU", provinceName: "Nunavut", gstRate: 0.05, pstRate: 0, hstRate: 0, qstRate: 0, combinedRate: 0.05, taxType: "GST" },
  ON: { province: "ON", provinceName: "Ontario", gstRate: 0, pstRate: 0, hstRate: 0.13, qstRate: 0, combinedRate: 0.13, taxType: "HST" },
  PE: { province: "PE", provinceName: "Prince Edward Island", gstRate: 0, pstRate: 0, hstRate: 0.15, qstRate: 0, combinedRate: 0.15, taxType: "HST" },
  QC: { province: "QC", provinceName: "Quebec", gstRate: 0.05, pstRate: 0, hstRate: 0, qstRate: 0.09975, combinedRate: 0.14975, taxType: "GST+QST" },
  SK: { province: "SK", provinceName: "Saskatchewan", gstRate: 0.05, pstRate: 0.06, hstRate: 0, qstRate: 0, combinedRate: 0.11, taxType: "GST+PST" },
  YT: { province: "YT", provinceName: "Yukon", gstRate: 0.05, pstRate: 0, hstRate: 0, qstRate: 0, combinedRate: 0.05, taxType: "GST" }
};

export function calculateCanadianTax(amount: number, province: ProvinceCode) {
  const rules = PROVINCIAL_TAX_RATES[province] || PROVINCIAL_TAX_RATES.ON;
  const taxAmount = Math.round(amount * rules.combinedRate * 100) / 100;
  let gstHst = 0;
  let pstQst = 0;

  if (rules.taxType === "HST") {
    gstHst = taxAmount;
  } else if (rules.taxType === "GST+PST") {
    gstHst = Math.round(amount * rules.gstRate * 100) / 100;
    pstQst = Math.round(amount * rules.pstRate * 100) / 100;
  } else if (rules.taxType === "GST+QST") {
    gstHst = Math.round(amount * rules.gstRate * 100) / 100;
    pstQst = Math.round(amount * rules.qstRate * 100) / 100;
  } else {
    gstHst = taxAmount;
  }

  return {
    subtotal: amount,
    taxAmount,
    gstHst,
    pstQst,
    total: amount + taxAmount,
    rules
  };
}

export function generateGST34Return(totalSales: number, taxableSales: number, hstGstCollected: number, itcClaimed: number, province: ProvinceCode) {
  const netTaxOwing = Math.max(0, hstGstCollected - itcClaimed);
  return {
    formCode: "GST34-2026",
    reportingPeriod: "Q2 2026",
    province,
    line101_totalSales: totalSales,
    line103_taxableSales: taxableSales,
    line105_taxCollected: hstGstCollected,
    line108_itcClaimed: itcClaimed,
    line109_netTaxOwing: netTaxOwing,
    filingStatus: "READY_FOR_CRA_EDI",
    generatedAt: new Date().toISOString()
  };
}

export function calculateCanadianPayroll(grossSalary: number, province: ProvinceCode, payCycle: "bi-weekly" | "semi-monthly" | "monthly" = "bi-weekly") {
  const isQuebec = province === "QC";
  const maxPensionable = 68500;
  const basicExemption = 3500;
  const pensionableEarnings = Math.min(grossSalary * (payCycle === "monthly" ? 12 : payCycle === "semi-monthly" ? 24 : 26), maxPensionable) - (basicExemption / (payCycle === "monthly" ? 12 : payCycle === "semi-monthly" ? 24 : 26));
  const cppRate = isQuebec ? 0.064 : 0.0595;
  const cppDeduction = Math.max(0, Math.round(pensionableEarnings * cppRate / (payCycle === "monthly" ? 12 : payCycle === "semi-monthly" ? 24 : 26) * 100) / 100);

  const maxInsurable = 65700;
  const insurableEarnings = Math.min(grossSalary * (payCycle === "monthly" ? 12 : payCycle === "semi-monthly" ? 24 : 26), maxInsurable);
  const eiRate = isQuebec ? 0.132 : 0.164;
  const eiDeduction = Math.round(insurableEarnings * (eiRate / 100) / (payCycle === "monthly" ? 12 : payCycle === "semi-monthly" ? 24 : 26) * 100) / 100;
  const ppipDeduction = isQuebec ? Math.round(insurableEarnings * 0.00494 / (payCycle === "monthly" ? 12 : payCycle === "semi-monthly" ? 24 : 26) * 100) / 100 : 0;

  const taxableAnnual = grossSalary * (payCycle === "monthly" ? 12 : payCycle === "semi-monthly" ? 24 : 26);
  const taxRate = taxableAnnual > 165000 ? 0.26 : taxableAnnual > 110000 ? 0.22 : 0.15;
  const incomeTax = Math.round((taxableAnnual * taxRate / (payCycle === "monthly" ? 12 : payCycle === "semi-monthly" ? 24 : 26)) * 100) / 100;

  const totalDeductions = Math.round((cppDeduction + eiDeduction + ppipDeduction + incomeTax) * 100) / 100;
  const netPay = Math.round((grossSalary - totalDeductions) * 100) / 100;

  return {
    grossSalary,
    cppDeduction,
    eiDeduction,
    ppipDeduction,
    incomeTax,
    totalDeductions,
    netPay,
    payCycle,
    province
  };
}

export function generateCPA005EFT(companyName: string, companyAccount: string, transitNumber: string, institutionNumber: string, items: { name: string; accountNumber: string; transit: string; institution: string; amount: number }[]) {
  const header = `001HD${companyName.padEnd(30, " ")}${transitNumber}${institutionNumber}${companyAccount.padEnd(12, " ")}260818`;
  let totalAmount = 0;
  let count = 0;

  const details = items.map((item, idx) => {
    totalAmount += item.amount;
    count++;
    const amtStr = String(Math.round(item.amount * 100)).padStart(10, "0");
    const seq = String(idx + 1).padStart(9, "0");
    return `005DT${item.transit}${item.institution}${item.accountNumber.padEnd(12, " ")}${amtStr}${item.name.padEnd(30, " ")}${seq}`;
  });

  const totalStr = String(Math.round(totalAmount * 100)).padStart(12, "0");
  const countStr = String(count + 2).padStart(8, "0");
  const trailer = `999TR${countStr}${totalStr}`;

  return [header, ...details, trailer].join("\n");
}

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    finance: "Finance",
    employees: "Employees",
    reports: "Reports",
    sectors: "Sectors",
    admin: "Admin",
    settings: "Settings",
    transactions: "Transactions",
    newInvoice: "New Invoice",
    runPayroll: "Run Payroll",
    taxEngine: "Canadian Tax Engine (GST/HST/PST/QST)",
    eftExport: "CPA 005 EFT Export",
    t4Slips: "T4 & RL-1 Tax Slips",
    balanceSheet: "ASPE / IFRS Balance Sheet",
    developedBy: "Developed by",
  },
  fr: {
    dashboard: "Tableau de bord",
    finance: "Finances",
    employees: "Employés",
    reports: "Rapports",
    sectors: "Secteurs",
    admin: "Administration",
    settings: "Paramètres",
    transactions: "Transactions",
    newInvoice: "Nouvelle facture",
    runPayroll: "Exécuter la paie",
    taxEngine: "Moteur fiscal canadien (TPS/TVH/TVP/TVQ)",
    eftExport: "Exportation EFT CPA 005",
    t4Slips: "Feuillets fiscaux T4 et RL-1",
    balanceSheet: "Bilan ASPE / IFRS",
    developedBy: "Développé par",
  }
};
