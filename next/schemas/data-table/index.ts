import { z } from "zod";
import { dataTableConfig } from "@/constants/data-table-config";

/**
 * Schema for sorting items in data tables
 */
export const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

/**
 * Type for sorting item
 */
export type SortingItem = z.infer<typeof sortingItemSchema>;

/**
 * Schema for filter items in data tables
 */
export const filterSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  type: z.enum(dataTableConfig.columnTypes),
  rowId: z.string(),
});

/**
 * Type for filter item
 */
export type FilterItem = z.infer<typeof filterSchema>; 