import Link from "next/link"
import { SiteShell } from "@/components/marketing/site-shell"

export default function HomePage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0033ad]">
            SME management platform
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Run sales, catalogue, inventory, and team in one simple workspace.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Beyond Solution helps small businesses register, pay manually via CBE or Telebirr,
            and get approved access to a mobile-first dashboard — including Telegram mini app support.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-[#0033ad] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Register your company
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-[#dbe4ff] bg-white px-5 py-3 text-center text-sm font-semibold text-[#0033ad]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dbe4ff] bg-white">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:grid-cols-3">
          {[
            { title: "Catalogue & QR", body: "Publish products and services with a shareable link." },
            { title: "POS & reports", body: "Track sales, tax summaries, and daily operations." },
            { title: "Team access", body: "Owners add employees with role-based permissions." },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-[#e8eeff] p-5">
              <h2 className="font-semibold text-[#0033ad]">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  )
}
