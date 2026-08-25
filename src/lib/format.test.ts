import { describe, expect, it } from "vitest";
import { formatCurrency, getInitials, validateCanadianPhone } from "./format";

describe("format helpers", () => {
  it("formats CAD values", () => {
    expect(formatCurrency(123456)).toContain("CAD");
  });

  it("generates initials", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("validates Canadian phone numbers", () => {
    expect(validateCanadianPhone("+1 415 555 2671")).toBe(true);
    expect(validateCanadianPhone("123")).toBe(false);
  });
});
