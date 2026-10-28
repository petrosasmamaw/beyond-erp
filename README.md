# Beyond ERP — Enterprise Resource Planning

**Beyond ERP** is an enterprise-ready, mobile-first ERP platform architected for emerging and established global business sectors. It combines offline-first PWA reliability with deep multi-market financial engines (Ethiopian VAT/Telebirr & Canadian CRA EDI/HST), Google Gemini AI assistance, CRM deal pipelines, and 12 dedicated sector workflow engines.

---

## 📚 Complete Project Documentation

Detailed architecture specifications have been prepared in the following documents:

1. **[PROJECT_OVERVIEW.md](file:///c:/Users/For%20you/OneDrive/Desktop/folders/website/Client_PROJECTS1/beyond-erp-landing/PROJECT_OVERVIEW.md)**  
   *Comprehensive master architecture guide covering system overview, comparison between root Next.js app and the monorepo, 12 sector engines, Gemini AI copilot, Canadian & Ethiopian localization, and technology stacks.*

2. **[BEYOND_ERP_MAIN.md](file:///c:/Users/For%20you/OneDrive/Desktop/folders/website/Client_PROJECTS1/beyond-erp-landing/BEYOND_ERP_MAIN.md)**  
   *In-depth architectural guide for the `beyond-erp-main` monorepo: Node.js/Express backend, Prisma ORM schema with 17 models, PostgreSQL Docker environment, 5-role RBAC, Ethiopian payment rails (Telebirr, CBE Birr), Ethiopian calendar, and test suites.*

3. **[THEME_AND_DESIGN_SYSTEM.md](file:///c:/Users/For%20you/OneDrive/Desktop/folders/website/Client_PROJECTS1/beyond-erp-landing/THEME_AND_DESIGN_SYSTEM.md)**  
   *Dedicated Theme & Design System manual: CSS design tokens, 12 sector-specific color palettes, Dark & Light mode architecture (`ThemeContext.tsx`), bilingual Ge'ez & Latin typography (`Noto Sans Ethiopic`), responsive mobile-first phone frames, and UI components.*

---

## ⚡ Quick Start

### 1. Root Application (Next.js 15 Standalone)
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### 2. Full-Stack Monorepo (`beyond-erp-main`)
```bash
# Backend (Express + Prisma + Postgres)
cd beyond-erp-main/backend
docker compose up -d
npm install
npm run db:migrate
npm run seed
npm run dev      # http://localhost:4000

# Frontend (Next.js client)
cd ../frontend
npm install
npm run dev      # http://localhost:8080 or 3000
```

### 3. Standalone Prototype
Open [beyond-erp.html](file:///c:/Users/For%20you/OneDrive/Desktop/folders/website/Client_PROJECTS1/beyond-erp-landing/beyond-erp.html) directly in any browser for a zero-installation preview.
