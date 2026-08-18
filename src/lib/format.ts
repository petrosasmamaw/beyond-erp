export function formatCurrency(value: number) {
  return `CAD ${new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2
  }).format(value || 0)}`;
}

export function formatDate(input: string | Date) {
  const date = typeof input === "string" ? new Date(input) : input;
  if (isNaN(date.getTime())) return "N/A";
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

export function validateCanadianPhone(phone: string) {
  return /^(\+?1)?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(phone);
}

export function getEthiopianDate(input = new Date()) {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toISOString().slice(0, 10);
}

export function getEthiopianFiscalYear(date = new Date()): number {
  return date.getFullYear();
}

export function getEthiopianHoliday(date = new Date()): string | null {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if (m === 7 && d === 1) return "Canada Day";
  if (m === 5 && d === 24) return "Victoria Day";
  if (m === 9 && d === 1) return "Labour Day";
  return null;
}


