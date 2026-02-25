import { SavingsGoal, Transaction } from '@/types';

export const transactions: Transaction[] = [
  { _id: '1', amount: 3200, type: 'income', category: 'Salary', date: '2026-02-01', note: 'Monthly salary' },
  { _id: '2', amount: 250, type: 'expense', category: 'Groceries', date: '2026-02-03', note: 'Weekly groceries' },
  { _id: '3', amount: 120, type: 'expense', category: 'Transport', date: '2026-02-05', note: 'Ride sharing' }
];

export const goals: SavingsGoal[] = [
  { _id: 'g1', title: 'Emergency Fund', targetAmount: 10000, currentAmount: 4200, deadline: '2026-12-31' },
  { _id: 'g2', title: 'Vacation', targetAmount: 3000, currentAmount: 900, deadline: '2026-08-15' }
];

export const monthlyData = [
  { month: 'Sep', income: 4100, expense: 2400, total: 1700 },
  { month: 'Oct', income: 3900, expense: 2600, total: 1300 },
  { month: 'Nov', income: 4200, expense: 2500, total: 1700 },
  { month: 'Dec', income: 4400, expense: 2800, total: 1600 },
  { month: 'Jan', income: 4600, expense: 2950, total: 1650 },
  { month: 'Feb', income: 4300, expense: 2700, total: 1600 }
];

export const categoryData = [
  { name: 'Housing', value: 1200 },
  { name: 'Food', value: 650 },
  { name: 'Transport', value: 290 },
  { name: 'Health', value: 210 },
  { name: 'Leisure', value: 350 }
];
