import React, { useState, useEffect, useRef } from 'react';
import type { Category } from '../types';

interface AmountInputModalProps {
  category: Category;
  enableDate: boolean;
  initialDate: string;
  onSubmit: (amount: number, date: string) => void;
  onClose: () => void;
}

const AmountInputModal: React.FC<AmountInputModalProps> = ({ category, enableDate, initialDate, onSubmit, onClose }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(initialDate);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(amount, 10);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      onSubmit(numericAmount, date);
    }
  };

  const isIncome = category.type === 'income';
  const typeLabel = isIncome ? '収入' : '支出';
  const accentColor = isIncome ? 'text-blue-600' : 'text-indigo-600';
  const buttonColor = isIncome ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700';
  const ringColor = isIncome ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-indigo-500 focus:border-indigo-500';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{typeLabel}を入力</h2>
        <p className="text-slate-500 mb-6">カテゴリ: <span className={`font-semibold ${accentColor}`}>{category.label}</span></p>

        <form onSubmit={handleSubmit}>
          {enableDate && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">日付</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-lg">¥</span>
            <input
              ref={inputRef}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className={`w-full pl-8 pr-4 py-3 text-2xl border-2 border-slate-300 rounded-md transition ${ringColor}`}
              required
              min="1"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-md text-white font-semibold transition ${buttonColor}`}
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AmountInputModal;
