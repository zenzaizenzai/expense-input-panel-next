export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  type: TransactionType;
}

export interface Category {
  id: string;
  label: string;
  type: TransactionType;
}
