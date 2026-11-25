// Operator details for the imprint and privacy policy.
// Read on the server at build/render time from OPERATOR_* environment variables
// (see .env.example), so the repository itself holds no personal data.

const clean = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export const operator = {
  name: clean(process.env.OPERATOR_NAME),
  business: clean(process.env.OPERATOR_BUSINESS),
  street: clean(process.env.OPERATOR_STREET),
  city: clean(process.env.OPERATOR_CITY),
  country: clean(process.env.OPERATOR_COUNTRY_DE),
  email: clean(process.env.OPERATOR_EMAIL),
  phone: clean(process.env.OPERATOR_PHONE),
  authority: clean(process.env.SUPERVISORY_AUTHORITY)
};

const lines = (...parts: (string | undefined)[]) =>
  parts.filter(Boolean).flatMap((part, i) => (i === 0 ? [part] : [<br key={i} />, part]));

export function OperatorAddress() {
  if (!operator.name) return <p>Betreiberangaben sind nicht konfiguriert (OPERATOR_* Variablen).</p>;
  return <p>{lines(operator.name, operator.business, operator.street, operator.city, operator.country)}</p>;
}

export function OperatorEmail() {
  return operator.email ? <a href={`mailto:${operator.email}`}>{operator.email}</a> : <span>–</span>;
}

export function OperatorPhone() {
  if (!operator.phone) return null;
  return (
    <>
      <br />
      Telefon: <a href={`tel:${operator.phone.replace(/[^+\d]/g, "")}`}>{operator.phone}</a>
    </>
  );
}
