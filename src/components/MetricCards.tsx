/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatRupiah } from '../utils';

interface MetricCardsProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

export default function MetricCards({
  balance,
  totalIncome,
  totalExpense,
}: MetricCardsProps) {
  const isPositive = balance >= 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-md border border-slate-700/50"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Wallet size={120} />
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Saldo</span>
          <div className="rounded-lg bg-slate-700/50 p-2 text-slate-200">
            <Wallet size={18} />
          </div>
        </div>
        <div className="font-mono text-3xl font-bold tracking-tight">
          {isPositive ? '' : '-'}{formatRupiah(balance)}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {isPositive ? 'Kondisi finansial aman' : 'Keuangan sedang defisit!'}
        </p>
      </motion.div>

      {/* Income Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Pemasukan</span>
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-2 text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight size={18} />
          </div>
        </div>
        <div className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
          {formatRupiah(totalIncome)}
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Dana masuk bulan ini
        </p>
      </motion.div>

      {/* Expense Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Pengeluaran</span>
          <div className="rounded-lg bg-rose-50 dark:bg-rose-950/20 p-2 text-rose-600 dark:text-rose-400">
            <ArrowDownRight size={18} />
          </div>
        </div>
        <div className="font-mono text-2xl font-bold text-rose-600 dark:text-rose-400 tracking-tight">
          {formatRupiah(totalExpense)}
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Dana keluar bulan ini
        </p>
      </motion.div>
    </div>
  );
}
