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

## Deploy API on Render

1. **New Web Service** → connect `petrosasmamaw/beyond-erp`.
2. Set **Root Directory** to `server` (required).
3. **Build command:** `npm install && npm run build && npm run db:migrate-payment`
4. **Start command:** `npm start`
5. **Environment:** add `DATABASE_URL`, `JWT_SECRET`, `CLIENT_ORIGINS` (your Vercel URL), `APP_URL`, `BREVO_API_KEY`, `EMAIL_FROM`.
6. First deploy only (Shell): `npm run db:init` then `npm run admin:ensure`.

Frontend stays on **Vercel** with `NEXT_PUBLIC_API_URL` = your Render service URL.
