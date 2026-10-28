# Beyond ERP Main (`beyond-erp-main`) — Complete Architectural Guide

## 1. Introduction

`beyond-erp-main` is the original, production-ready full-stack monorepo designed specifically as a **mobile-first ERP platform for Ethiopian businesses**. It provides micro, small, and medium enterprises (MSMEs)—from retail shops in Merkato to commercial farms in Hawassa, private clinics, schools, and transport fleets—with a unified system to manage cash flow, staff, inventory, and legal compliance.

---

## 2. Directory Structure

```
beyond-erp-main/
├── backend/                  # Node.js + Express + Prisma + PostgreSQL
│   ├── docker-compose.yml    # PostgreSQL 16 container definition
│   ├── package.json          # Express 4, Prisma 6.14, Bcrypt, JWT, Zod, Nodemailer
│   ├── prisma/
│   │   ├── schema.prisma     # 17 Relational Data Models & Enums
│   │   ├── seed.ts           # Database seeder execution script
│   │   └── migrations/       # SQL migration history
│   ├── src/
│   │   ├── auth.ts           # JWT authentication, password hashing & verification
│   │   ├── domain-workflows.ts # Sector-specific business logic & validation rules
│   │   ├── email.ts          # Nodemailer SMTP & transaction notification dispatch
│   │   ├── index.ts          # Main Express server (routes, middleware, rate limiting)
│   │   ├── index.test.ts     # Vitest + Supertest integration tests
│   │   └── seed-data.ts      # Comprehensive seed data for Ethiopian companies & sectors
│   ├── tsconfig.json
│   └── vitest.config.ts
├── frontend/                 # Next.js 15 + React 19 Single Page App
│   ├── beyond-erp.html       # Standalone single-file prototype preview
│   ├── package.json          # Dependencies: Next 15.1.3, React 19, Lucide icons
│   ├── postcss.config.mjs    # Tailwind CSS PostCSS plugin
│   ├── public/               # PWA icons, manifest.json, sw.js
│   ├── src/
│   │   ├── app/              # App router: (app), (auth), sa (super-admin), layout
│   │   ├── components/       # Modals (TelebirrModal, EmployeeModal, TransactionModal), Nav
│   │   ├── contexts/         # AppContext (offline queue), AuthContext, ThemeContext
│   │   ├── features/         # Ethiopian Sector workflows & ERP views
│   │   └── lib/              # API client, formatters, Ethiopian calendar helpers
│   ├── tsconfig.json
│   └── vitest.config.ts
└── README.md                 # Original project summary
```

---

## 3. Backend Architecture (`beyond-erp-main/backend`)

### 3.1. Database Schema & Prisma ORM (`schema.prisma`)
The system models 17 relational entities designed around Ethiopian corporate compliance:

1. **`User`**: System user records featuring `fullName`, `email`, `phone`, `passwordHash`, `role`, and `status`.
2. **`Sector`**: 12 business sectors with custom metadata (`features` JSON, color badges, team assignments).
3. **`TeamMember`**: Sector-assigned staff with granular feature permissions.
4. **`Transaction`**: Financial income/expenses with `amount`, `category`, `paymentMethod`, `vatAmount` (15%), and sync flags.
5. **`Employee`**: Staff records with salary, department, Ethiopian phone validation, and hire dates.
6. **`Invoice`**: B2B invoices with auto-calculated 15% VAT, customer TIN, line items JSON, and payment status (`DRAFT`, `SENT`, `PAID`, `OVERDUE`).
7. **`Receipt`**: Proof of payment linked to transaction records.
8. **`ExpenseApproval`**: Multi-level managerial expense approval pipeline (`REQUESTED`, `APPROVED`, `REJECTED`, `PAID`).
9. **`ChartAccount` & `LedgerEntry`**: Double-entry general ledger supporting Standard Chart of Accounts (`ASSET`, `LIABILITY`, `EQUITY`, `INCOME`, `EXPENSE`).
10. **`PayrollRun`**: Periodic payroll batch with gross pay, tax/pension deductions, and employee itemization.
11. **`SectorRecord`**: Dynamic domain records per sector (patient visits, harvest logs, batch QA, lease records).
12. **`SectorWorkItem`**: Sector-specific task tracking with priorities (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) and due dates.
13. **`RegistrationRequest`**: Company onboarding queue with payment reference checks before user account provisioning.
14. **`AuditLog`**: Tamper-evident activity logs capturing actor, action, endpoint, IP address, and payload metadata.
15. **`EmailLog`**: History of sent transactional emails and delivery states.
16. **`AppSetting`**: Global business configurations (TIN, company name, VAT toggle, Telebirr integration toggle, language).

### 3.2. Five-Role Role-Based Access Control (RBAC)
The backend enforces strict permission tiers:
- **`OWNER`**: Unrestricted access across all financial ledgers, system settings, user creation, audit logs, and sector workflows.
- **`ADMIN`**: User management, sector assignments, approvals, full financial and operational view.
- **`MANAGER`**: Sector-scoped administrative tasks, employee approvals, expense sign-offs, transaction entry.
- **`STAFF`**: Day-to-day transactional entry, POS checkout, sector record logging, task management.
- **`VIEWER`**: Read-only access to dashboards, reports, and financial summaries.

### 3.3. Ethiopian Payment Integrations
Built-in support for Ethiopian domestic payment mechanisms:
- **Telebirr**: In-app payment modal (`TelebirrModal.tsx`) with QR/USSD reference validation and merchant approval workflows.
- **CBE Birr** (Commercial Bank of Ethiopia): Mobile banking reference reconciliation.
- **Amole** / Dashen Bank: Payment status verification.
- **Bank Transfer & Cash**: Standard cash-up and slip logging.

### 3.4. Ethiopian Localization Engine
- **Ethiopian Calendar**: Direct conversion and display of the 13-month Ethiopian Calendar (Meskerem through Pagume, 7–8 years behind Gregorian).
- **Public Holidays**: Automatic calculation and dynamic notification badges for 8 national holidays:
  - Genna (Ethiopian Christmas)
  - Timkat (Epiphany)
  - Adwa Victory Day (March 2)
  - Labour Day (May 1)
  - Patriots Victory Day (May 5)
  - Derg Downfall Day (May 28)
  - Enkutatash (Ethiopian New Year)
  - Meskel (Finding of the True Cross)
- **Languages**: Native four-language localization strings:
  - English
  - Amharic (አማርኛ)
  - Afaan Oromo
  - Tigrinya (ትግርኛ)
- **TIN & VAT**: Default 15% value-added tax calculation and Ethiopian 10-digit TIN validation.

---

## 4. Frontend Client (`beyond-erp-main/frontend`)

- **Routing & Views**: Next.js 15 App Router located in `src/app/`:
  - `(app)/`: Main application shell with dynamic routes (`/m/[module]`, `/sectors/[id]`, `/reports`, `/admin`).
  - `(auth)/`: Mobile login, user onboarding registration, and verification flow.
  - `sa/`: Super-Admin monitoring dashboard.
- **State Management**:
  - `AppContext.tsx`: Handles transactions, employees, settings, and the **offline mutation sync queue**.
  - `AuthContext.tsx`: Manages JWT tokens, user sessions, and permission checks.
  - `ThemeContext.tsx`: Light/Dark mode state management and `localStorage` persistence.
- **Offline PWA**:
  - Configured with `public/sw.js` and `public/manifest.json`.
  - Queues all transactions locally when disconnected and displays an offline indicator pill.
  - Automatically submits queued mutations upon detecting reconnection.

---

## 5. Seed Data & Demo Accounts

The project includes pre-configured demo seed accounts in `backend/prisma/seed.ts`:

| Email | Password | Role | Assigned Sector |
|---|---|---|---|
| `owner@beyonderp.local` | `Beyond@12345` | OWNER | All Sectors |
| `admin@beyonderp.local` | `Admin@12345` | ADMIN | General Operations |
| `manager@beyonderp.local` | `Manager@12345` | MANAGER | Retail & Trading |
| `staff@beyonderp.local` | `Staff@12345` | STAFF | Healthcare / Clinic |
| `viewer@beyonderp.local` | `Viewer@12345` | VIEWER | Reports & Audits |

---

## 6. How to Run & Test `beyond-erp-main`

### 1. Start the PostgreSQL Database
```bash
cd beyond-erp-main/backend
docker compose up -d
```

### 2. Initialize the Backend API
```bash
# In beyond-erp-main/backend
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run seed
npm run dev
# The API will be running at http://localhost:4000
```

### 3. Run the Frontend Client
```bash
# In beyond-erp-main/frontend
cp .env.example .env.local
npm install
npm run dev
# The frontend will be running at http://localhost:8080 (or port configured in package.json)
```

### 4. Run Integration & Unit Tests
```bash
# Backend integration tests (Supertest + Vitest)
cd beyond-erp-main/backend
npm test

# Frontend unit & smoke tests (Vitest + JSDOM)
cd beyond-erp-main/frontend
npm test
```
