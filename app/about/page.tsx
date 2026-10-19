import { SiteShell } from "@/components/marketing/site-shell"

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900">About</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Beyond Solution builds practical tools for Ethiopian SMEs. We verify each company registration,
          activate accounts manually after payment review, and provide login credentials once approved.
        </p>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Use the web app on mobile or open the same experience inside Telegram via{" "}
          <a href="https://t.me/Beyondetbot" className="font-medium text-[#0033ad]">@Beyondetbot</a>.
        </p>
      </section>
    </SiteShell>
  )
}
