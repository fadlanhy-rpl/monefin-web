import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a decimal string or number as IDR currency */
export function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/** Format an ISO date string to a readable locale date */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

/** Return the month name from a number (1-indexed) */
export function monthName(month: number): string {
  return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(
    new Date(2000, month - 1, 1)
  );
}

/** Get current YYYY-MM for period comparisons */
export function currentYearMonth(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

/** Spending status badge color mapping */
export const spendingStatusConfig = {
  hemat: {
    label: 'Hemat',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  normal: {
    label: 'Normal',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  boros: {
    label: 'Boros',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
} as const;
