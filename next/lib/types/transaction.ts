import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from "@/constants/transaction";

export type TTransactionType = (typeof TRANSACTION_TYPES)[number];

export type TTransactionCategory = (typeof TRANSACTION_CATEGORIES)[keyof typeof TRANSACTION_CATEGORIES][number];

export type TTransaction = {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: TTransactionType;
  category: TTransactionCategory;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
