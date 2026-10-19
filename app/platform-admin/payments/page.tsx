import { RegistrationsWorkspace } from "@/components/platform-admin/registrations-workspace"
import { PaymentSummaryBar } from "@/components/platform-admin/payment-summary"

export default function PlatformPaymentsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <PaymentSummaryBar />
      <p className="text-sm text-slate-600">
        Match each transaction ID to your bank or Telebirr statement, then approve as{" "}
        <strong>paid</strong> or <strong>promotional</strong>.
      </p>
      <RegistrationsWorkspace filter="pending" showPaymentColumn />
    </div>
  )
}
