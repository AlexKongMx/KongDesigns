import { useEffect, useState } from "react";
import { normalizePhone, phoneCountries, splitPhone } from "./phone";
import type { PhoneCountry } from "./types";

export function PhoneField({
  value,
  defaultCountry,
  allowedCountries,
  onChange,
}: {
  value: string;
  defaultCountry: PhoneCountry;
  allowedCountries: PhoneCountry[];
  onChange: (phone: string) => void;
}) {
  const initial = splitPhone(value, defaultCountry);
  const [country, setCountry] = useState(initial.country);
  const [national, setNational] = useState(initial.national);

  useEffect(() => {
    const next = splitPhone(value, country);
    if (value.startsWith("+") && next.national !== national) {
      setCountry(next.country);
      setNational(next.national);
    }
  }, [value]);

  function update(nextCountry: PhoneCountry, nextNational: string) {
    setCountry(nextCountry);
    setNational(nextNational);
    onChange(normalizePhone(nextCountry, nextNational));
  }

  return <div className="wdm-phone-field">
    <select
      aria-label="País y código telefónico"
      value={country}
      onChange={(event) => update(event.target.value as PhoneCountry, national)}
    >
      {allowedCountries.map((code) => <option value={code} key={code}>{phoneCountries[code].label}</option>)}
    </select>
    <input
      required
      inputMode="tel"
      autoComplete="tel-national"
      value={national}
      placeholder={phoneCountries[country].placeholder}
      onChange={(event) => update(country, event.target.value)}
    />
  </div>;
}
