/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Sun, Moon } from 'lucide-react';
import { Transaction } from './types';
import { getSampleTransactions } from './utils';
import MetricCards from './components/MetricCards';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

export default function App() {
  // Theme Management (Light / Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('catat-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light'; // Default light theme
  });

  useEffect(() => {
    localStorage.setItem('catat-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Financial States
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('catat-transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Load default beautiful sample transactions on first load
    return getSampleTransactions();
  });

  // Persist transactions
  useEffect(() => {
    localStorage.setItem('catat-transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Real-time calculation engine
  const financialMetrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [transactions]);

  // Add Transaction Event
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const txWithId: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setTransactions(prev => [txWithId, ...prev]);
  };

  // Delete Transaction Event
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Clear All Event
  const handleClearAll = () => {
    setTransactions([]);
  };

  // Load Samples Event
  const handleLoadSamples = () => {
    setTransactions(getSampleTransactions());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans pb-16">
      {/* Upper Utility Navbar (Professional Polish Theme) */}
      <header className="sticky top-0 z-50 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sm:px-8 shadow-sm">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded flex items-center justify-center text-white font-bold shadow-sm select-none">
              B
            </div>
            <div>
              <h1 id="app-title" className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
                BukuKas
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Saldo Saat Ini</p>
              <p className={`text-base font-bold leading-none mt-1 ${financialMetrics.balance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
                {financialMetrics.balance < 0 ? '-' : ''}Rp {new Intl.NumberFormat('id-ID').format(Math.abs(financialMetrics.balance))}
              </p>
            </div>

            {/* Theme switcher button */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              id="theme-toggle"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-950 cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Ganti Tema Visual"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Dashboard Title Intro Card */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
              <Sparkles size={12} />
              <span>PENCATATAN KEUANGAN PERSONAL</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
              BukuKas Sederhana
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Catat pemasukan dan pengeluaran harian Anda dengan mudah, cepat, dan tanpa ribet.
            </p>
          </div>
        </motion.div>

        {/* Dynamic Numerical Statistics */}
        <MetricCards
          balance={financialMetrics.balance}
          totalIncome={financialMetrics.totalIncome}
          totalExpense={financialMetrics.totalExpense}
        />

        {/* Two Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Entry Form (Spans 5) */}
          <div className="lg:col-span-5">
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>

          {/* RIGHT COLUMN: Transaction History List (Spans 7) */}
          <div className="lg:col-span-7">
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onLoadSamples={handleLoadSamples}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </main>

      {/* Elegant Bottom Footer */}
      <footer className="mt-16 h-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center px-8">
        <p className="text-xs text-slate-400 italic">Efisiensi dalam genggaman. © 2026 BukuKas Keuangan.</p>
      </footer>
    </div>
  );
}
