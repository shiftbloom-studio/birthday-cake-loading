import path from "node:path";
import { fileURLToPath } from "node:url";

// Operator details for /imprint, /impressum, /privacy and /datenschutz.
// They are inlined at build time, so set them as build variables (Workers Builds)
// or in a local .env file. See .env.example.
const LEGAL_ENV = [
  "OPERATOR_NAME",
  "OPERATOR_BUSINESS",
  "OPERATOR_STREET",
  "OPERATOR_CITY",
  "OPERATOR_COUNTRY_EN",
  "OPERATOR_COUNTRY_DE",
  "OPERATOR_EMAIL",
  "OPERATOR_PHONE",
  "OPERATOR_VAT_ID",
  "SUPERVISORY_AUTHORITY"
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: Object.fromEntries(LEGAL_ENV.map((key) => [key, process.env[key] ?? ""])),
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url))
  }
};

export default nextConfig;
