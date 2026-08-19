import type { PhoneCountry } from "./types";

export const phoneCountries: Record<PhoneCountry, { label: string; dialCode: string; placeholder: string }> = {
  MX: { label: "🇲🇽 +52", dialCode: "+52", placeholder: "55 1234 5678" },
  CA: { label: "🇨🇦 +1", dialCode: "+1", placeholder: "604 555 0123" },
  US: { label: "🇺🇸 +1", dialCode: "+1", placeholder: "415 555 0123" },
};

export function splitPhone(value: string, fallback: PhoneCountry) {
  const clean = value.trim().replace(/[^\d+]/g, "");
  if (clean.startsWith("+52")) return { country: "MX" as PhoneCountry, national: clean.slice(3) };
  if (clean.startsWith("+1")) return { country: fallback === "US" ? "US" as PhoneCountry : "CA" as PhoneCountry, national: clean.slice(2) };
  return { country: fallback, national: clean.replace(/^\+/, "") };
}

export function normalizePhone(country: PhoneCountry, value: string) {
  const digits = value.replace(/\D/g, "");
  const dialDigits = phoneCountries[country].dialCode.replace(/\D/g, "");
  const national = digits.startsWith(dialDigits) && digits.length > 10 ? digits.slice(dialDigits.length) : digits;
  const normalized = `${phoneCountries[country].dialCode}${national}`;
  return /^\+[1-9]\d{7,14}$/.test(normalized) ? normalized : "";
}
