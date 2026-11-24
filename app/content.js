import { cache } from "react";
import groups from "./wedding-fields.json";

const fields = Object.assign({}, ...Object.values(groups));
const defaults = Object.fromEntries(
  Object.entries(fields).map(([key, field]) => [key, field.default])
);

export const getWeddingContent = cache(async () => {
  const origin = process.env.MARRIAGE_MANAGER_URL;
  if (!origin) return defaults;

  try {
    const response = await fetch(new URL("/api/public/wedding-site", origin), {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const { content } = await response.json();
    return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => {
      const value = content?.[key];
      const isDate = key.endsWith("At");
      const valid = typeof value === "string" && value.trim() &&
        (!isDate || (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) &&
          Number.isFinite(Date.parse(value + ":00+05:30"))));
      return [key, valid ? value : fallback];
    }));
  } catch (error) {
    console.error("Could not load wedding content from Marriage Expense Manager:", error.message);
    return defaults;
  }
});
