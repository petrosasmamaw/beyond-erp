import type {
  User,
  Transaction,
  Employee,
  Settings,
  AuditLog,
  Invoice,
  Receipt,
  ExpenseApproval,
  ChartAccount,
  PayrollRun,
  SectorRecord,
  RegistrationRequest,
  SectorWorkItem,
  TeamMember,
  DomainWorkflow
} from "@/lib/types";

export interface RegisteredUser extends User {
  passwordHash?: string;
}

// In-memory server-side database store
class ServerStore {
  public users: RegisteredUser[] = [
    {
      id: "user-client-1",
      fullName: "Enterprise Client",
      email: "client@enterprise.com",
      phone: "+14155552671",
      companyName: "Global Trading & Operations Inc.",
      companyTinNumber: "123456789 RT0001",
      companySectorId: "retail-trading",
      role: "OWNER",
      permissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings", "Audit", "Compliance"],
      effectivePermissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings", "Audit", "Compliance"],
      status: "ACTIVE",
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      passwordHash: "password123"
    }
  ];

  public currentUser: RegisteredUser = this.users[0];

  public transactions: Transaction[] = [
    {
      id: "tx-1",
      type: "INCOME",
      amount: 125000,
      description: "Enterprise SaaS Subscription & Implementation",
      category: "Sales Revenue",
      sectorId: "retail-trading",
      paymentMethod: "Bank Transfer",
      vatAmount: 18750,
      status: "COMPLETED",
      synced: true,
      occurredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: "tx-2",
      type: "EXPENSE",
      amount: 34000,
      description: "Cloud Infrastructure & AWS Hosting",
      category: "Operations",
      sectorId: "finance-banking",
      paymentMethod: "Corporate Card",
      vatAmount: 5100,
      status: "COMPLETED",
      synced: true,
      occurredAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      id: "tx-3",
      type: "INCOME",
      amount: 48000,
      description: "Consulting & Professional Services",
      category: "Services",
      sectorId: "consulting",
      paymentMethod: "Stripe",
      vatAmount: 7200,
      status: "COMPLETED",
      synced: true,
      occurredAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ];

  public employees: Employee[] = [
    {
      id: "emp-1",
      fullName: "Abebe Bekele",
      position: "Senior Systems Architect",
      department: "Engineering",
      phone: "+251911223344",
      email: "abebe@beyonderp.demo",
      salary: 85000,
      status: "ACTIVE",
      hiredDate: "2023-01-15",
      createdAt: new Date().toISOString()
    },
    {
      id: "emp-2",
      fullName: "Sara Mamo",
      position: "Chief Financial Officer",
      department: "Finance",
      phone: "+14155559988",
      email: "sara@beyonderp.demo",
      salary: 110000,
      status: "ACTIVE",
      hiredDate: "2022-06-01",
      createdAt: new Date().toISOString()
    }
  ];

  public settings: Settings = {
    id: "default",
    companyName: "Toronto Medical Center",
    tinNumber: "123456789 RT0001",
    companySectorId: "healthcare",
    businessType: "Corporation",
    language: "English (USA)",
    currency: "CAD",
    taxRate: 13,
    telebirrEnabled: false,
    cbeEnabled: false,
    ehmisEnabled: false,
    emailEnabled: true,
    telegramEnabled: false,
    smsEnabled: false,
    offlineMode: false,
    autoSync: true,
    dataCompression: true,
    vatRegistered: true
  };

  public auditLogs: AuditLog[] = [
    {
      id: "aud-1",
      actorId: "user-1",
      actorEmail: "yohannes@beyonderp.demo",
      action: "USER_LOGIN",
      method: "POST",
      path: "/api/auth/login",
      ip: "192.168.1.50",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      createdAt: new Date().toISOString()
    }
  ];

  public invoices: Invoice[] = [
    {
      id: "inv-1",
      invoiceNumber: "INV-2026-001",
      customerName: "Kebede Trading Co.",
      customerPhone: "+251911222333",
      sectorId: "retail-trading",
      items: [{ description: "Bulk medical consumables", quantity: 50, unitPrice: 1200 }],
      subtotal: 60000,
      vatAmount: 7800,
      total: 67800,
      status: "PAID",
      issuedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      dueDate: new Date(Date.now() + 25 * 86400000).toISOString()
    }
  ];

  public receipts: Receipt[] = [
    {
      id: "rec-1",
      receiptNumber: "REC-2026-001",
      payerName: "Kebede Trading Co.",
      amount: 67800,
      paymentMethod: "Bank Transfer",
      issuedAt: new Date(Date.now() - 4 * 86400000).toISOString()
    }
  ];

  public expenseApprovals: ExpenseApproval[] = [
    {
      id: "exp-1",
      title: "Quarterly Office Supplies & Hardware",
      amount: 4500,
      category: "Operations",
      sectorId: "retail-trading",
      requestedById: "emp-2",
      approvedById: "user-1",
      status: "APPROVED",
      notes: "Approved under operational budget 2026",
      requestedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    }
  ];

  public chartAccounts: ChartAccount[] = [
    { id: "acc-1000", code: "1000", name: "Cash and Cash Equivalents", type: "ASSET", active: true },
    { id: "acc-1200", code: "1200", name: "Accounts Receivable", type: "ASSET", active: true },
    { id: "acc-2000", code: "2000", name: "Accounts Payable", type: "LIABILITY", active: true },
    { id: "acc-3000", code: "3000", name: "Retained Earnings", type: "EQUITY", active: true },
    { id: "acc-4000", code: "4000", name: "Sales & Service Revenue", type: "INCOME", active: true },
    { id: "acc-5000", code: "5000", name: "Operating Expenses", type: "EXPENSE", active: true }
  ];

  public payrollRuns: PayrollRun[] = [
    {
      id: "pay-1",
      period: "January 2026",
      status: "PAID",
      grossPay: 195000,
      deductions: 29250,
      netPay: 165750,
      items: [
        { employeeId: "emp-1", employeeName: "Abebe Bekele", grossPay: 85000, deductions: 12750 },
        { employeeId: "emp-2", employeeName: "Sara Mamo", grossPay: 110000, deductions: 16500 }
      ],
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
    }
  ];

  public registrationRequests: RegistrationRequest[] = [
    {
      id: "reg-1",
      companyName: "Addis Agro Exports Ltd.",
      tinNumber: "0098765432",
      sectorId: "agriculture",
      fullName: "Tadesse Woldemariam",
      email: "tadesse@agroexport.demo",
      phone: "+251911998877",
      notes: "Requesting agricultural enterprise ERP onboarding",
      status: "APPROVED",
      paymentReference: "TRX-PAY-9988",
      approvedById: "user-1",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ];

  public workItems: SectorWorkItem[] = [
    {
      id: "wi-1",
      sectorId: "healthcare",
      title: "Annual PIPEDA Privacy Audit & Compliance Review",
      description: "Review patient data protection and cross-border data transfer protocols between Toronto and Addis Ababa.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      assignedToId: "emp-2",
      createdById: "user-1",
      createdAt: new Date().toISOString()
    }
  ];

  public sectorRecords: SectorRecord[] = [
    {
      id: "rec-sr-1",
      sectorId: "healthcare",
      recordType: "Patient File",
      title: "Patient #1092 - Consultation Record",
      ownerName: "Dr. Meron Tadesse",
      status: "ACTIVE",
      value: 350,
      metadata: { diagnosis: "Routine Checkup", department: "Cardiology" },
      createdAt: new Date().toISOString()
    }
  ];

  public logAudit(action: string, method: string, path: string, req?: Request) {
    const entry: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorId: this.currentUser?.id,
      actorEmail: this.currentUser?.email,
      action,
      method,
      path,
      ip: req?.headers.get("x-forwarded-for") || "127.0.0.1",
      userAgent: req?.headers.get("user-agent") || "BeyondERP-Client",
      createdAt: new Date().toISOString()
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }
}

export const db = new ServerStore();
