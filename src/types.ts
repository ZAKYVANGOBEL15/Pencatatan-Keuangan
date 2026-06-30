/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  description: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon identifier
  type: TransactionType;
  color: string; // Tailwind color name (e.g., 'emerald', 'amber')
  bgColor: string; // Tailwind background color class
  textColor: string; // Tailwind text color class
  iconColor: string; // Tailwind icon color class
}

export interface Budget {
  limit: number;
  enabled: boolean;
}

export const DEFAULT_CATEGORIES: Category[] = [
  // Expenses
  {
    id: 'makanan',
    name: 'Makanan & Minuman',
    icon: 'Utensils',
    type: 'expense',
    color: 'amber',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    textColor: 'text-amber-700 dark:text-amber-300',
    iconColor: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    id: 'transportasi',
    name: 'Transportasi',
    icon: 'Car',
    type: 'expense',
    color: 'blue',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    textColor: 'text-blue-700 dark:text-blue-300',
    iconColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    id: 'belanja',
    name: 'Belanja',
    icon: 'ShoppingBag',
    type: 'expense',
    color: 'rose',
    bgColor: 'bg-rose-50 dark:bg-rose-950/20',
    textColor: 'text-rose-700 dark:text-rose-300',
    iconColor: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  },
  {
    id: 'tagihan',
    name: 'Tagihan & Utilitas',
    icon: 'ReceiptText',
    type: 'expense',
    color: 'orange',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    textColor: 'text-orange-700 dark:text-orange-300',
    iconColor: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  },
  {
    id: 'hiburan',
    name: 'Hiburan & Gaya Hidup',
    icon: 'Tv',
    type: 'expense',
    color: 'violet',
    bgColor: 'bg-violet-50 dark:bg-violet-950/20',
    textColor: 'text-violet-700 dark:text-violet-300',
    iconColor: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  },
  {
    id: 'kesehatan',
    name: 'Kesehatan',
    icon: 'Heart',
    type: 'expense',
    color: 'red',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    textColor: 'text-red-700 dark:text-red-300',
    iconColor: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    id: 'investasi_keluar',
    name: 'Investasi & Tabungan',
    icon: 'PiggyBank',
    type: 'expense',
    color: 'teal',
    bgColor: 'bg-teal-50 dark:bg-teal-950/20',
    textColor: 'text-teal-700 dark:text-teal-300',
    iconColor: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  },
  {
    id: 'lain_keluar',
    name: 'Lain-lain',
    icon: 'HelpCircle',
    type: 'expense',
    color: 'slate',
    bgColor: 'bg-slate-100 dark:bg-slate-800/50',
    textColor: 'text-slate-700 dark:text-slate-300',
    iconColor: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  },

  // Income
  {
    id: 'gaji',
    name: 'Gaji & Upah',
    icon: 'Briefcase',
    type: 'income',
    color: 'emerald',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    iconColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    id: 'bisnis',
    name: 'Bisnis & Sampingan',
    icon: 'TrendingUp',
    type: 'income',
    color: 'cyan',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
    textColor: 'text-cyan-700 dark:text-cyan-300',
    iconColor: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  {
    id: 'investasi_masuk',
    name: 'Investasi & Dividen',
    icon: 'Coins',
    type: 'income',
    color: 'indigo',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    iconColor: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  {
    id: 'hadiah',
    name: 'Hadiah & Hibahan',
    icon: 'Gift',
    type: 'income',
    color: 'fuchsia',
    bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-950/20',
    textColor: 'text-fuchsia-700 dark:text-fuchsia-300',
    iconColor: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
  },
  {
    id: 'lain_masuk',
    name: 'Lain-lain',
    icon: 'Plus',
    type: 'income',
    color: 'slate',
    bgColor: 'bg-slate-100 dark:bg-slate-800/50',
    textColor: 'text-slate-700 dark:text-slate-300',
    iconColor: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  },
];
