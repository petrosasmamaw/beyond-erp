import { RegistrationsWorkspace } from "@/components/platform-admin/registrations-workspace"

export default function PlatformRegistrationsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="mb-4 text-sm text-slate-600">
        Review every signup, verify details, approve companies, and send login access.
      </p>
      <RegistrationsWorkspace filter="all" />
    </div>
  )
}
