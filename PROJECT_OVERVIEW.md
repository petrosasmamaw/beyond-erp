# Beyond ERP — Project Overview & Architecture Guide

## 1. Executive Summary

**Beyond ERP** is an enterprise-grade, mobile-first Enterprise Resource Planning (ERP) platform architected for modern businesses across diverse emerging and established economic sectors. Originally designed specifically for the Ethiopian business ecosystem (featuring Ethiopian calendar, 15% VAT, Telebirr/CBE Birr payments, and 4 local languages), the platform has expanded in the root repository into a multi-market, full-stack Next.js application equipped with North American/Canadian compliance modules (CRA EDI, HST/GST/PST, PIPEDA), Google Gemini AI copilot assistance, CRM deal pipelines, and offline-first PWA sync capabilities.

---

## 2. Repository Structure & Dual Architectures

The repository contains two distinct architectural implementations:

```
beyond-erp-landing/ (Root Workspace)
├── src/                          # Next.js 15 App Router Frontend + Full-Stack API Routes
│   ├── app/                      # Next.js App Router (Layouts, (app), (auth), /crm, /sa, /api)
│   │   ├── (app)/                # Authenticated App views (Dashboard, Sectors, Finance, CRM, etc.)
│   │   ├── (auth)/               # Auth flow (Login, Register, Onboarding details)
│   │   └── api/                  # Serverless API routes (AI assistant, Auth, DB fallback, Sectors)
│   ├── components/               # UI components, Modals, Nav, AI Assistant Sidebar & Widget
│   ├── contexts/                 # AppContext (Offline/Online sync, State), ThemeContext (Light/Dark)
│   ├── features/                 # Sector engines (12 sector workflows) & core ERP views
│   └── lib/                      # Localization (canadian.ts, format.ts), Supabase, Firebase, Mock DB
├── beyond-erp-main/              # Original Full-Stack Monorepo
│   ├── backend/                  # Node.js + Express 4 + Prisma ORM + PostgreSQL + Docker API
│   │   ├── prisma/               # Database schema (schema.prisma) & seed files
│   │   └── src/                  # Express controllers, routes, RBAC, domain workflows
│   ├── frontend/                 # Independent Next.js 15 client talking to backend:4000
│   └── README.md                 # Original Ethiopian ERP specification
├── beyond-erp.html               # Single-file standalone HTML/JS mobile ERP prototype
├── firestore.rules               # Firebase security rules
├── firebase-applet-config.json   # Firebase app configuration
├── docker-compose.yml            # Container definitions
├── package.json                  # Root dependencies (@google/genai, @supabase/supabase-js, firebase)
├── PROJECT_OVERVIEW.md           # Master Project Overview (This Document)
├── BEYOND_ERP_MAIN.md            # In-Depth Guide to beyond-erp-main Monorepo
└── THEME_AND_DESIGN_SYSTEM.md    # Dedicated Theme, Styling & Design System Specification
```

---

## 3. Comparative Architecture: Root vs `beyond-erp-main`

| Feature / Dimension | Root Application (`beyond-erp-landing`) | `beyond-erp-main` Monorepo |
|---|---|---|
| **Primary Framework** | Next.js 15.1.3 (React 19, TypeScript 5.8) | Split: Node.js Express 4 (Backend) + Next.js 15 (Frontend) |
| **API Architecture** | Built-in Next.js App Router API Routes (`/src/app/api/*`) | Standalone REST API running on Express (`http://localhost:4000`) |
| **Database & Persistence** | In-Memory `ServerStore` (`src/app/api/db.ts`) + Supabase + Firebase | PostgreSQL via Prisma ORM 6.14 (`schema.prisma` with 17 models) |
| **Market Focus** | **Global & Hybrid**: Ethiopian ERP core + Canadian Enterprise (HST/GST/PST, PIPEDA, CRA) | **Ethiopian Domestic**: Telebirr, CBE Birr, Amole, 15% VAT, E.C. Calendar |
| **AI Capabilities** | Integrated Google Gemini 2.5 Flash copilot (`@google/genai`) | Rule-based domain workflows |
| **CRM Module** | Full Kanban/Pipeline CRM (`/crm`) with stage tracking and deal values | Focus on operational sector records |
| **Internationalization** | English (USA) & French (Canada) with dynamic currency (CAD / ETB) | Amharic, Afaan Oromo, Tigrinya, English with ETB currency |
| **Testing** | Vitest 4.1.7 unit & component tests | Supertest + Vitest integration tests for API endpoints |

---

## 4. Key Functional Modules

### 4.1. 12 Vertical Sector Engines
Beyond ERP provides specialized business logic and workflows tailored to 12 distinct industries:
1. **Retail & Trading**: POS checkout, stock management, SKU & barcode scanning, low-stock alerts, customer ledger.
2. **Manufacturing**: Bill of Materials (BOM) costing, multi-stage production orders, QA sign-off, machinery downtime tracking.
3. **Agriculture & Farming**: Crop cycle tracking, planting/harvest schedules, livestock health records, weather logs, yield tracking.
4. **Construction & Contracting**: Project milestones, daily site reports, equipment tracking, subcontractor payments, BOQ variance.
5. **Healthcare & Clinics**: Patient electronic health records (EHR), OPD consultations, prescription management, pharmacy inventory, lab orders.
6. **Education & Schools**: Student enrollment, tuition fee billing, attendance tracking, teacher schedules, gradebook logs.
7. **Hospitality & Restaurants**: Room reservations, table POS, housekeeping status, food & beverage inventory, guest billing.
8. **Transport & Logistics**: Fleet tracking, trip manifest logs, fuel consumption, driver dispatch, maintenance schedules.
9. **Financial Services & Microfinance**: Loan issuance, repayment schedules, interest calculation, collateral tracking, risk tiers.
10. **Real Estate & Property**: Lease agreements, tenant ledger, rent collection, unit vacancies, maintenance requests.
11. **NGO & Community Development**: Grant tracking, donor reporting, project budget utilization, M&E field metrics.
12. **Custom Sector Requests (`request-custom`)**: Extensible module allowing enterprises to define bespoke workflows and field schemas.

### 4.2. Financial Management & Multi-Jurisdiction Taxation
- **Ethiopian Fiscal Mode**: 15% Standard VAT, TIN number validation, Meskerem–Pagume calendar date stamping, Telebirr/CBE Birr merchant reconciliation.
- **Canadian Fiscal Mode**:
  - Comprehensive tax engine supporting all 13 provinces and territories (`AB`, `BC`, `MB`, `NB`, `NL`, `NS`, `NT`, `NU`, `ON`, `PE`, `QC`, `SK`, `YT`).
  - Automated tax distinction: Harmonized Sales Tax (HST), GST + PST, GST + QST (Quebec 9.975%), and GST-only.
  - Form **GST34 Return** generation for CRA EDI electronic filing.
  - Canadian Payroll deductions engine calculating CPP, EI, PPIP (Quebec), and provincial/federal bracketed income tax.
- **Double-Entry General Ledger**: Pre-configured Chart of Accounts (`ASSET`, `LIABILITY`, `EQUITY`, `INCOME`, `EXPENSE`) with debit/credit ledger validation.
- **P&L and Balance Sheet**: Real-time aggregation of income and expense streams.

### 4.3. Gemini AI Enterprise Copilot
- Powered by `@google/genai` targeting the `gemini-2.5-flash` model.
- Exposes an interactive floating assistant (`AIAssistantWidget.tsx`) and full-screen drawer (`AIAssistantSidebar.tsx`).
- Capable of conversational querying across financials, stock levels, and operations.
- Generates executable actions (e.g., auto-logging transactions into the ledger directly from natural language commands) with a resilient rule-based offline fallback.

### 4.4. Offline-First PWA Architecture
- Service Worker registration (`public/sw.js`) and PWA manifest (`public/manifest.json`).
- Network listener in `AppContext.tsx` automatically transitions the app into offline mode upon disconnection.
- Mutations (transactions, stock changes, notes) are placed into an in-memory & `localStorage` synchronization queue (`pendingQueue`).
- When network connectivity is restored, operations are automatically flushed and synced with server endpoints.

---

## 5. Technology Stack Summary

- **Frontend Framework**: Next.js 15.1.3 (App Router, Turbopack ready), React 19, TypeScript 5.8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`), Custom CSS Variables, Lucide Icons, FontAwesome
- **AI / LLM Integration**: Google GenAI SDK (`@google/genai`)
- **Cloud & Auth**: Supabase JS (`@supabase/supabase-js`), Firebase 12.18 (Auth & Firestore)
- **Monorepo Backend**: Express 4, Prisma ORM 6.14, PostgreSQL 16 (Dockerized), Zod, Bcrypt, JWT, Nodemailer
- **Testing**: Vitest 4.1.7, React Testing Library, Supertest

---

## 6. Getting Started

### Running the Root Application (Next.js 15):
```bash
# In the root workspace
npm install
npm run dev
# Accessible at http://localhost:3000
```

### Running the Full Monorepo (`beyond-erp-main`):
```bash
# Terminal 1: Backend
cd beyond-erp-main/backend
npm install
docker compose up -d
npm run db:migrate
npm run seed
npm run dev      # http://localhost:4000

# Terminal 2: Frontend
cd beyond-erp-main/frontend
npm install
npm run dev      # http://localhost:8080 or 3000
```
