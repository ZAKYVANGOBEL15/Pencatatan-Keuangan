/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircle, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { DEFAULT_CATEGORIES, TransactionType, Transaction } from '../types';
import CategoryIcon from './CategoryIcon';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<number>(0);
  const [displayAmount, setDisplayAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [description, setDescription] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Reset category if transaction type changes
  useEffect(() => {
    const defaultCatForType = DEFAULT_CATEGORIES.find(c => c.type === type);
    setCategory(defaultCatForType ? defaultCatForType.id : '');
  }, [type]);

  // Handle live numeric input formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/\D/g, '');
    if (!cleanValue) {
      setDisplayAmount('');
      setAmount(0);
      return;
    }
    const numericVal = parseInt(cleanValue, 10);
    setAmount(numericVal);
    setDisplayAmount(new Intl.NumberFormat('id-ID').format(numericVal));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      setError('Masukkan jumlah nominal uang terlebih dahulu.');
      return;
    }
    if (!category) {
      setError('Pilih salah satu kategori transaksi.');
      return;
    }

    onAddTransaction({
      type,
      amount,
      category,
      date,
      description: description.trim() || DEFAULT_CATEGORIES.find(c => c.id === category)?.name || '',
    });

    // Show visual feedback
    setIsSuccess(true);
    setAmount(0);
    setDisplayAmount('');
    setDescription('');
    
    // Reset success banner after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  const activeCategories = DEFAULT_CATEGORIES.filter(c => c.type === type);

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <PlusCircle size={18} className="text-indigo-600 dark:text-indigo-400" />
          Catat Transaksi Baru
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selector Toggle */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Tipe Transaksi
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="btn-type-income"
              onClick={() => setType('income')}
              className={`py-2 px-4 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              Pemasukan
            </button>
            <button
              type="button"
              id="btn-type-expense"
              onClick={() => setType('expense')}
              className={`py-2 px-4 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              Pengeluaran
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Jumlah (IDR)
          </label>
          <div className="relative rounded-lg border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all bg-slate-50 dark:bg-slate-950/20 overflow-hidden">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 dark:text-slate-500 select-none">
              Rp
            </span>
            <input
              type="text"
              id="input-amount"
              inputMode="numeric"
              placeholder="0"
              value={displayAmount}
              onChange={handleAmountChange}
              className="w-full pl-11 pr-4 py-3 bg-transparent text-lg font-mono font-bold outline-none text-slate-800 dark:text-slate-100"
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">⚠ {error}</p>}
        </div>

        {/* Category Selector Dropdown */}
        <div>
          <label htmlFor="select-category" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Kategori
          </label>
          <div className="relative">
            <select
              id="select-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans cursor-pointer"
            >
              <option value="" disabled>Pilih Kategori...</option>
              {activeCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date and Description Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Calendar size={12} />
              Tanggal
            </label>
            <input
              type="date"
              id="input-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <FileText size={12} />
              Keterangan
            </label>
            <input
              type="text"
              id="input-description"
              placeholder="Contoh: Makan Siang"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          id="btn-submit-transaction"
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold mt-2 shadow-md shadow-indigo-100/10 cursor-pointer active:scale-[0.99] transition-all"
        >
          Simpan Transaksi
        </button>

        {/* Success Alert */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-medium"
            >
              <CheckCircle2 size={14} className="shrink-0" />
              <span>Transaksi berhasil ditambahkan ke catatan!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
