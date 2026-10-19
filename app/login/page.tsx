import { Suspense } from "react"
import { SiteShell } from "@/components/marketing/site-shell"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <SiteShell ctaHref="/register" ctaLabel="Register">
      <section className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">
          Use the credentials we sent after your registration was approved.
        </p>
        <Suspense fallback={<p className="mt-6 text-sm text-slate-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </SiteShell>
  )
}
