export type UserRole = 'admin' | 'user';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  photoUrl?: string;
  role: UserRole;
}

export interface Transaction {
  _id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note?: string;
}

export interface SavingsGoal {
  _id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}
