/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction } from './types';

/**
 * Formats a number as Indonesian Rupiah (IDR).
 * Example: 50000 -> "Rp 50.000" or "Rp50.000"
 */
export function formatRupiah(value: number, includeSymbol: boolean = true): string {
  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
  
  return includeSymbol ? `Rp ${formatted}` : formatted;
}

/**
 * Converts a standard date string (YYYY-MM-DD) into Indonesian natural date string.
 * Example: Today -> "Hari Ini", Yesterday -> "Kemarin", Others -> "Selasa, 30 Juni 2026"
 */
export function formatIndonesianDate(dateString: string): string {
  try {
    const today = new Date();
    const targetDate = new Date(dateString);
    
    // Set hours to 0 to compare dates only
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hari Ini';
    } else if (diffDays === 1) {
      return 'Kemarin';
    }
    
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const d = new Date(dateString);
    const dayName = days[d.getDay()];
    const dateNum = d.getDate();
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
    
    return `${dayName}, ${dateNum} ${monthName} ${year}`;
  } catch (error) {
    return dateString;
  }
}

/**
 * Formats YYYY-MM-DD or standard ISO date string to readable Indonesian Month and Year
 * Example: "2026-06-30" -> "Juni 2026"
 */
export function formatMonthYear(dateString: string): string {
  try {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const d = new Date(dateString);
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch (error) {
    return '';
  }
}

/**
 * Generates sample transaction data based on the current local time.
 */
export function getSampleTransactions(): Transaction[] {
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Helper to subtract days
  const subtractDays = (days: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'sample-1',
      type: 'income',
      amount: 4500000,
      category: 'gaji',
      date: subtractDays(2),
      description: 'Gaji Bulanan Utama',
    },
    {
      id: 'sample-2',
      type: 'expense',
      amount: 120000,
      category: 'belanja',
      date: subtractDays(2),
      description: 'Belanja Bulanan Alfamart',
    },
    {
      id: 'sample-3',
      type: 'expense',
      amount: 45000,
      category: 'makanan',
      date: subtractDays(1),
      description: 'Nasi Goreng Spesial & Es Teh',
    },
    {
      id: 'sample-4',
      type: 'expense',
      amount: 25000,
      category: 'transportasi',
      date: subtractDays(1),
      description: 'Isi Saldo e-Money KRL',
    },
    {
      id: 'sample-5',
      type: 'income',
      amount: 350000,
      category: 'bisnis',
      date: todayStr,
      description: 'Hasil Penjualan Kaos Sampingan',
    },
    {
      id: 'sample-6',
      type: 'expense',
      amount: 85000,
      category: 'makanan',
      date: todayStr,
      description: 'Makan Siang & Kopi Susu',
    },
    {
      id: 'sample-7',
      type: 'expense',
      amount: 150000,
      category: 'tagihan',
      date: todayStr,
      description: 'Isi Paket Data & Pulsa Internet',
    },
  ];
}
