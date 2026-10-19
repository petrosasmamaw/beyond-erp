import Link from "next/link"
import { SiteShell } from "@/components/marketing/site-shell"

export default function RegisterConfirmationPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-xl border border-[#dbe4ff] bg-white p-8">
          <h1 className="text-2xl font-bold text-[#0033ad]">Thank you</h1>
          <p className="mt-4 text-slate-600 leading-relaxed">
            We received your company details, license, and payment information. Our team will verify
            everything and send your login credentials by email.
          </p>
          <p className="mt-3 text-sm text-slate-500">This usually takes 1–2 business days.</p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-lg bg-[#0033ad] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to home
          </Link>
        </div>
      </section>
    </SiteShell>
  )
}
