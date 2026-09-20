import React, { useState, useEffect } from 'react';
import type { Transaction, Category } from './types';
import AmountInputModal from './components/AmountInputModal';
import DataSheetView from './components/DataSheetView';
import ExpenseCategoryPanel from './components/ExpenseCategoryPanel';
import CalendarPicker from './components/CalendarPicker';

const DataSheetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DEFAULT_CATEGORIES: Category[] = [
  // 支出 18個
  { id: '食費', label: '食費', type: 'expense' },
  { id: '日用品', label: '日用品', type: 'expense' },
  { id: '交通費', label: '交通費', type: 'expense' },
  { id: '通信費', label: '通信費', type: 'expense' },
  { id: '水道光熱費', label: '水道光熱費', type: 'expense' },
  { id: '家賃', label: '家賃', type: 'expense' },
  { id: '交際費', label: '交際費', type: 'expense' },
  { id: '趣味・娯楽', label: '趣味・娯楽', type: 'expense' },
  { id: '医療費', label: '医療費', type: 'expense' },
  { id: '美容・衣類', label: '美容・衣類', type: 'expense' },
  { id: '教育・教養', label: '教育・教養', type: 'expense' },
  { id: '家具・家電', label: '家具・家電', type: 'expense' },
  { id: '消耗品費', label: '消耗品費', type: 'expense' },
  { id: '雑費', label: '雑費', type: 'expense' },
  { id: '保険', label: '保険', type: 'expense' },
  { id: '税金・社会保険', label: '税金・社会保険', type: 'expense' },
  { id: '旅行・イベント', label: '旅行・イベント', type: 'expense' },
  { id: 'その他支出', label: 'その他', type: 'expense' },
  // 収入 2個
  { id: '給与・売上', label: '給与・売上', type: 'income' },
  { id: 'その他収入', label: 'その他収入', type: 'income' },
];

const loadCategories = (): Category[] => {
  try {
    const storedCategories = localStorage.getItem('transactionCategories_v3');
    if (storedCategories) {
      const parsed = JSON.parse(storedCategories);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to parse categories from localStorage", error);
  }
  return DEFAULT_CATEGORIES;
};

const App: React.FC = () => { /* State */
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(loadCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDataSheetVisible, setIsDataSheetVisible] = useState(false);

  // 選択中の日付（初期値は今日）
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });

  useEffect(() => {
    try {
      localStorage.setItem('transactionCategories_v3', JSON.stringify(categories));
    } catch (error) {
      console.error("Failed to save categories to localStorage", error);
    }
  }, [categories]);

  const handleCategoryClick = (categoryLabel: string) => {
    const category = categories.find(c => c.label === categoryLabel);
    if (category) {
      setSelectedCategory(category);
      setIsModalOpen(true);
    }
  };

  const handleUpdateCategory = (id: string, newLabel: string) => {
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === id ? { ...cat, label: newLabel } : cat
      )
    );
  };

  const handleAddTransaction = (amount: number) => {
    if (selectedCategory) {
      const newTransaction: Transaction = {
        id: new Date().getTime().toString(),
        category: selectedCategory.label,
        amount,
        type: selectedCategory.type,
        date: currentDate,
      };
      setTransactions(prev => [...prev, newTransaction]);
    }
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleClearTransactions = () => {
    setTransactions([]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="mb-6 pb-4 border-b border-slate-200">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-700">収支入力パネル</h1>
            <p className="text-slate-500 mt-2">日付を選び、カテゴリをクリックして金額を入力してください。</p>
          </div>
        </header>

        {/* カレンダー常時表示 */}
        <CalendarPicker selectedDate={currentDate} onSelectDate={setCurrentDate} />

        {/* カテゴリグリッド (収入2 + 支出18 = 20個) */}
        {/* スマホ(縦長)で見やすいように2列、タブレットは3~4列、PCは5列くらいにする */}
        <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* 先に収入を表示 */}
          {incomeCategories.map(category => (
            <ExpenseCategoryPanel
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
              onUpdate={handleUpdateCategory}
            />
          ))}
          {/* 続けて支出を表示 */}
          {expenseCategories.map(category => (
            <ExpenseCategoryPanel
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
              onUpdate={handleUpdateCategory}
            />
          ))}
        </main>

        <footer className="mt-12 text-center pb-10">
          <button
            onClick={() => setIsDataSheetVisible(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
          >
            <DataSheetIcon className="w-6 h-6" />
            データシートを表示する
          </button>
        </footer>
      </div>

      {isModalOpen && selectedCategory && (
        <AmountInputModal
          category={selectedCategory}
          onSubmit={handleAddTransaction}
          onClose={handleCloseModal}
        />
      )}

      {isDataSheetVisible && (
        <DataSheetView
          transactions={transactions}
          showDate={true}
          onClose={() => setIsDataSheetVisible(false)}
          onClear={handleClearTransactions}
        />
      )}
    </div>
  );
};

export default App;
