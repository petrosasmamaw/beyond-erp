# beyond-erp

Beyond Solution — SME mini ERP (Next.js frontend + Express API + Neon PostgreSQL).

## Local development

```bash
# Frontend (port 3000)
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL and JWT_SECRET

# API (port 4000)
cd server && npm install
cp .env.example .env         # set DATABASE_URL, JWT_SECRET (match frontend), BREVO_*, etc.
npm run db:init
npm run db:migrate-payment
npm run dev
```

In another terminal from the project root: `npm run dev`

## Scripts (server)

- `npm run db:init` — apply schema
- `npm run db:migrate-payment` — payment settings tables
- `npm run db:sanitize-stores` — reset all company workspace JSON to empty (keeps profiles)
- `npm run admin:ensure` — ensure platform admin user
