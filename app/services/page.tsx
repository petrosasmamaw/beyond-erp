import { SiteShell } from "@/components/marketing/site-shell"

const plans = [
  {
    name: "Starter",
    price: "2,500 ETB / month",
    features: ["Dashboard access", "Catalogue + QR", "Up to 5 team members", "Telegram mini app"],
  },
]

export default function ServicesPage() {
  return (
    <SiteShell ctaHref="/register" ctaLabel="Start registration">
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Services</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          A focused mini ERP for SMEs: sales desk, stock, suppliers, payroll basics, and a public catalogue.
        </p>
        <div className="mt-8 grid gap-4 sm:max-w-md">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-xl border border-[#dbe4ff] bg-white p-6">
              <h2 className="text-lg font-semibold text-[#0033ad]">{plan.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  )
}
