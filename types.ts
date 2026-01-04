export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
}

export interface Category {
  id: string;
  label: string;
  type: TransactionType;
}
