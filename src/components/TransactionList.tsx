/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Trash2, 
  Filter, 
  Calendar, 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  ChevronDown,
  X
} from 'lucide-react';
import { Transaction, DEFAULT_CATEGORIES, Category } from '../types';
import { formatRupiah, formatIndonesianDate, formatMonthYear } from '../utils';
import CategoryIcon from './CategoryIcon';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onLoadSamples: () => void;
  onClearAll: () => void;
}

export default function TransactionList({
  transactions,
  onDeleteTransaction,
  onLoadSamples,
  onClearAll,
}: TransactionListProps) {
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Find category details helper
  const getCategoryDetails = (catId: string, type: 'income' | 'expense'): Category => {
    const found = DEFAULT_CATEGORIES.find(c => c.id === catId);
    if (found) return found;
    
    // Default fallback if category not found
    return {
      id: catId,
      name: catId.charAt(0).toUpperCase() + catId.slice(1),
      icon: 'HelpCircle',
      type: type,
      color: 'slate',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      textColor: 'text-slate-700 dark:text-slate-300',
      iconColor: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    };
  };

  // Get list of unique month-years from transactions for the month dropdown filter
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach(t => {
      const monthYear = t.date.slice(0, 7); // YYYY-MM
      months.add(monthYear);
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a)); // Newest first
  }, [transactions]);

  // Reset filters
  const resetFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedMonth('all');
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Search matches description or category name
      const catDetails = getCategoryDetails(t.category, t.type);
      const matchesSearch = 
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        catDetails.name.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = selectedType === 'all' || t.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesMonth = selectedMonth === 'all' || t.date.startsWith(selectedMonth);

      return matchesSearch && matchesType && matchesCategory && matchesMonth;
    });
  }, [transactions, search, selectedType, selectedCategory, selectedMonth]);

  // Group filtered transactions by Date
  const groupedTransactions = useMemo(() => {
    const groups: { [date: string]: { list: Transaction[]; netTotal: number } } = {};
    
    // Sort transactions by date descending, then ID descending
    const sorted = [...filteredTransactions].sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.id.localeCompare(a.id);
    });

    sorted.forEach(t => {
      if (!groups[t.date]) {
        groups[t.date] = { list: [], netTotal: 0 };
      }
      groups[t.date].list.push(t);
      if (t.type === 'income') {
        groups[t.date].netTotal += t.amount;
      } else {
        groups[t.date].netTotal -= t.amount;
      }
    });

    return groups;
  }, [filteredTransactions]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));
  }, [groupedTransactions]);

  const hasActiveFilters = search || selectedType !== 'all' || selectedCategory !== 'all' || selectedMonth !== 'all';

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Calendar size={18} className="text-indigo-600 dark:text-indigo-400" />
          Riwayat Transaksi
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onLoadSamples}
            id="btn-load-samples-inline"
            className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/60 border border-indigo-100/50 dark:border-indigo-900/30 rounded-lg cursor-pointer transition-all"
            title="Muat data contoh untuk latihan"
          >
            Muat Sampel
          </button>
          <button
            onClick={() => {
              if (window.confirm("Apakah Anda yakin ingin menghapus semua catatan transaksi harian Anda?")) {
                onClearAll();
              }
            }}
            id="btn-clear-all-inline"
            className="px-2.5 py-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 border border-rose-100/50 dark:border-rose-900/30 rounded-lg cursor-pointer transition-all"
            title="Hapus semua catatan keuangan Anda"
          >
            Hapus Semua
          </button>
        </div>
      </div>

      {/* Filter Controls Grid */}
      <div className="space-y-4 mb-6">
        {/* Search Input */}
        <div className="relative rounded-lg border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all bg-slate-50 dark:bg-slate-950/20 overflow-hidden">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="search-transactions"
            placeholder="Cari catatan atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-transparent text-sm outline-none text-slate-700 dark:text-slate-200"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Transaction Type Pills */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              id="btn-filter-type-all"
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              id="btn-filter-type-income"
              onClick={() => setSelectedType('income')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Pemasukan
            </button>
            <button
              id="btn-filter-type-expense"
              onClick={() => setSelectedType('expense')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Pengeluaran
            </button>
          </div>

          <div className="flex flex-1 gap-2">
            {/* Month Filter Dropdown */}
            <div className="relative flex-1">
              <select
                id="filter-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-300 outline-none hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all appearance-none cursor-pointer"
              >
                <option value="all">Semua Bulan</option>
                {availableMonths.map(m => (
                  <option key={m} value={m}>
                    {formatMonthYear(`${m}-01`)}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <ChevronDown size={14} />
              </div>
            </div>

            {/* Category Filter Dropdown */}
            <div className="relative flex-1">
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-300 outline-none hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all appearance-none cursor-pointer"
              >
                <option value="all">Semua Kategori</option>
                {DEFAULT_CATEGORIES.filter(c => selectedType === 'all' || c.type === selectedType).map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Clear Indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between p-2 px-3 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-950/30 rounded-lg">
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
              Menampilkan {filteredTransactions.length} transaksi terfilter
            </span>
            <button
              onClick={resetFilters}
              id="btn-reset-filters"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Transaction List Entries */}
      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-1">
        {sortedDates.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-950/15 border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400 dark:text-slate-500">
              <Search size={22} />
            </div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tidak ada transaksi ditemukan
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {hasActiveFilters 
                ? 'Cobalah untuk mereset filter atau mengubah kata kunci pencarian Anda.' 
                : 'Catatan Anda masih kosong. Silakan tambahkan transaksi baru menggunakan formulir di samping.'}
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {sortedDates.map(dateStr => {
              const { list, netTotal } = groupedTransactions[dateStr];
              const isNetPositive = netTotal >= 0;

              return (
                <motion.div
                  key={dateStr}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2.5"
                >
                  {/* Daily Date Header with Net Calculation */}
                  <div className="flex items-center justify-between text-xs font-bold py-1.5 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatIndonesianDate(dateStr)}
                    </span>
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isNetPositive 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                    }`}>
                      Net: {isNetPositive ? '+' : '-'}{formatRupiah(netTotal)}
                    </span>
                  </div>

                  {/* Transaction list for this date */}
                  <div className="space-y-2">
                    {list.map(t => {
                      const cat = getCategoryDetails(t.category, t.type);
                      return (
                        <motion.div
                          layoutId={t.id}
                          key={t.id}
                          className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50/50 dark:hover:bg-slate-950/30 border border-slate-200 dark:border-slate-800 transition-all duration-150 group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Category Icon */}
                            <div className={`p-2.5 rounded-lg shrink-0 ${cat.iconColor}`}>
                              <CategoryIcon name={cat.icon} size={16} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate leading-snug">
                                {t.description}
                              </h4>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-none mt-1">
                                {cat.name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* Money details */}
                            <div className="text-right">
                              <span className={`font-mono text-sm font-bold tracking-tight ${
                                t.type === 'income' 
                                  ? 'text-emerald-600 dark:text-emerald-400' 
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}>
                                {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                              </span>
                            </div>

                            {/* Delete button */}
                            <button
                              onClick={() => onDeleteTransaction(t.id)}
                              id={`btn-delete-${t.id}`}
                              className="p-2 text-slate-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all duration-200 cursor-pointer"
                              title="Hapus Transaksi"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
