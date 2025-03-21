import { z } from "zod";
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES, DEFAULT_OFFSET, DEFAULT_PER_PAGE_MAX, DEFAULT_PER_PAGE_MIN } from "@/constants/transaction";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Base schema for creating a transaction
 */
export const createTransactionBaseSchema = z.object({
  amount: z.coerce.number().min(1),
  description: z.string().max(256).optional(),
  type: z.enum(TRANSACTION_TYPES),
  categoryId: z.enum([
    ...TRANSACTION_CATEGORIES.income,
    ...TRANSACTION_CATEGORIES.expense
  ]),
  transactionDate: z.number()
    .refine((val) => !dayjs(val).isAfter(dayjs()), {
      message: "Transaction date cannot be in the future"
    })
});

/**
 * Schema used for validating transaction creation from client
 */
export const createTransactionSchema = createTransactionBaseSchema.extend({
  title: z.string().min(1).max(64),
}).strict();

/**
 * Type for the create transaction schema
 */
export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;

/**
 * Schema for transaction data returned from API
 */
export const transactionDtoSchema = createTransactionBaseSchema.omit({
  transactionDate: true,
}).extend({
  id: z.string(),
  title: z.string(),
  transactionDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * Type for transaction DTO
 */
export type TransactionDto = z.infer<typeof transactionDtoSchema>;

/**
 * Schema for transaction list response
 */
export const transactionListResponseSchema = z.object({
  data: z.array(transactionDtoSchema),
  pageCount: z.number(),
  totalCount: z.number(),
});

/**
 * Type for transaction list response
 */
export type TransactionListResponse = z.infer<typeof transactionListResponseSchema>;

/**
 * Schema for transaction request parameters
 */
export const transactionRequestSchema = z.object({
  // Pagination
  pageIndex: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  
  // Sorting
  sortBy: z.array(
    z.object({
      id: z.string(),
      desc: z.boolean(),
    })
  ).default([{ id: "updatedAt", desc: true }]),
  
  // Simple filters
  title: z.string().optional().default(""),
  search: z.string().optional().default(""),
  type: z.array(
    z.enum(TRANSACTION_TYPES as unknown as [string, ...string[]])
  ).optional().default([]),
  category: z.array(
    z.enum([...TRANSACTION_CATEGORIES.income, ...TRANSACTION_CATEGORIES.expense] as unknown as [string, ...string[]])
  ).optional().default([]),
  
  // Date range
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  
  // Advanced filters
  filters: z.array(
    z.object({
      id: z.string(),
      value: z.any(),
    })
  ).optional().default([]),
});

/**
 * Type for transaction request parameters
 */
export type TransactionRequestParams = z.infer<typeof transactionRequestSchema>;

/**
 * Schema for fetching transactions from API (client-side)
 */
export const fetchTransactionsSchema = z.object({
  pagination: z.object({
    pageIndex: z.number(),
    pageSize: z.number(),
  }),
  sorting: z.array(z.object({
    id: z.string(),
    desc: z.boolean(),
  })),
  filters: z.record(z.any()),
});

/**
 * Type for fetching transactions parameters
 */
export type FetchTransactionsParams = z.infer<typeof fetchTransactionsSchema>;

/**
 * Schema for transaction filter parameters used in the UI search form
 */
export const transactionFilterParamsSchema = z
  .object({
    sortBy: z.array(z.any()).default([{ id: "transactionDate", desc: "true" }]),
    type: z
      .array(z.enum(TRANSACTION_TYPES))
      .optional()
      .default([]),
    title: z.string().optional().default(""),
    search: z.string().optional().default(""),
    category: z
      .array(z.enum([...Object.values(TRANSACTION_CATEGORIES.income), ...Object.values(TRANSACTION_CATEGORIES.expense)] as [string, ...string[]]))
      .optional()
      .default([]),
    off: z.coerce
      .number()
      .optional()
      .default(0)
      .superRefine((off, ctx) => {
        if (off < DEFAULT_OFFSET && off !== 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `offset must be greater than or equal to ${DEFAULT_OFFSET}`,
          })
        }
      }),
    filters: z.array(z.any()).optional().default([]),
    
    fromDate: z.date().optional().default(dayjs.utc().startOf("month").subtract(1, "month").toDate()),
    toDate: z.date().optional().default(dayjs.utc().add(1, "day").toDate()),

    pageIndex: z.coerce.number().optional().default(1),
    pageSize: z.coerce
      .number()
      .optional()
      .default(DEFAULT_PER_PAGE_MIN)
      .transform((amount) =>
        Math.min(DEFAULT_PER_PAGE_MAX, Math.max(DEFAULT_PER_PAGE_MIN, Math.round(amount / 10) * 10))
      ),
  })
  .strict();

/**
 * Type for transaction filter parameters
 */
export type TransactionFilterParams = z.infer<typeof transactionFilterParamsSchema>;

/**
 * Schema used for validating transaction update from client
 */
export const updateTransactionSchema = createTransactionBaseSchema.extend({
  id: z.string(),
  title: z.string().min(1).max(64),
}).strict();

/**
 * Type for the update transaction schema
 */
export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>;

/**
 * Schema used for validating transaction delete from client
 */
export const deleteTransactionSchema = z.object({
  id: z.string(),
}).strict();

export type DeleteTransactionSchema = z.infer<typeof deleteTransactionSchema>; 