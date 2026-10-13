import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Indian numbering system:
 * < 1 Lakh: ₹45,000 / ₹90,000
 * >= 1 Lakh and < 1 Crore: ₹85 Lakh / ₹45.5 Lakh
 * >= 1 Crore: ₹1.25 Cr / ₹4.80 Cr
 */
export function formatINR(amount: number, isRent: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "₹ Price on Request";
  }

  const suffix = isRent ? " / mo" : "";

  if (amount >= 10000000) {
    const cr = amount / 10000000;
    const formatted = cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2).replace(/\.?0+$/, "");
    return `₹${formatted} Cr${suffix}`;
  }

  if (amount >= 100000) {
    const lakh = amount / 100000;
    const formatted = lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2).replace(/\.?0+$/, "");
    return `₹${formatted} Lakh${suffix}`;
  }

  return `₹${amount.toLocaleString("en-IN")}${suffix}`;
}

export function formatNumberIN(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return "0";
  return val.toLocaleString("en-IN");
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function truncate(text: string, length: number): string {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}
