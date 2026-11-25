// Operator details for the imprint and privacy policy.
// The values are read at build time from OPERATOR_* environment variables
// (see .env.example and next.config.js), so the repository holds no personal data.

export type Lang = "en" | "de";

export type Operator = {
  name?: string;
  business?: string;
  street?: string;
  city?: string;
  country: Record<Lang, string | undefined>;
  email?: string;
  phone?: string;
  vatId?: string;
  authority?: string;
};

const clean = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export const operator: Operator = {
  name: clean(process.env.OPERATOR_NAME),
  business: clean(process.env.OPERATOR_BUSINESS),
  street: clean(process.env.OPERATOR_STREET),
  city: clean(process.env.OPERATOR_CITY),
  country: {
    en: clean(process.env.OPERATOR_COUNTRY_EN),
    de: clean(process.env.OPERATOR_COUNTRY_DE)
  },
  email: clean(process.env.OPERATOR_EMAIL),
  phone: clean(process.env.OPERATOR_PHONE),
  vatId: clean(process.env.OPERATOR_VAT_ID),
  authority: clean(process.env.SUPERVISORY_AUTHORITY)
};

export const isConfigured = Boolean(operator.name && operator.street && operator.city && operator.email);
