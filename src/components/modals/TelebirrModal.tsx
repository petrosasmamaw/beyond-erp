"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { validateCanadianPhone } from "@/lib/format";
import { defaultTransaction } from "@/features/erp/helpers";
import { useApp } from "@/contexts/AppContext";
import { Modal } from "@/components/ui/Modal";
import type { Transaction } from "@/lib/types";

export function TelebirrModal() {
  const { modal, closeModal, showToast, sectors, openTransactionModal } = useApp();
  const isOpen = modal?.type === "telebirr";

  const [form, setForm] = useState({ phone: "", amount: 0, purpose: "" });

  const handleSend = (direction: "INCOME" | "EXPENSE") => {
    if (!validateCanadianPhone(form.phone) || form.amount <= 0) {
      showToast("Add a valid Canadian phone and amount");
      return;
    }
    closeModal();
    const base = defaultTransaction(sectors);
    const seed: Transaction = {
      id: `interac-${Date.now()}`,
      type: direction,
      amount: Number(form.amount),
      vatAmount: Number(form.amount) * 0.13,
      paymentMethod: "Interac e-Transfer",
      description: form.purpose || `Interac ${direction === "INCOME" ? "receipt" : "payment"}`,
      sectorId: base.sectorId ?? null,
      status: "COMPLETED",
      synced: true,
      occurredAt: new Date().toISOString(),
      category: base.category,
      createdAt: new Date().toISOString()
    };
    openTransactionModal(seed);
  };

  return (
    <Modal title="Interac e-Transfer" isOpen={isOpen} onClose={closeModal}>
      <div className="telebirr-mark">
        <ArrowRightLeft size={26} />
        <div>
          <strong>Interac e-Transfer Ready</strong>
          <span>Instant Canadian bank clearing and settlement.</span>
        </div>
      </div>
      <div className="stack">
        <label>
          Phone / Email
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="416-555-1234"
          />
        </label>
        <label>
          Amount (CAD)
          <input
            type="number"
            min="1"
            value={form.amount || ""}
            onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
          />
        </label>
        <label>
          Purpose
          <input
            value={form.purpose}
            onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
            placeholder="Customer payment"
          />
        </label>
        <div className="form-grid">
          <button className="primary-button" type="button" onClick={() => handleSend("EXPENSE")}>
            Send Money
          </button>
          <button className="secondary-button" type="button" onClick={() => handleSend("INCOME")}>
            Receive Money
          </button>
        </div>
      </div>
    </Modal>
  );
}
