import type { ColumnSort, Row } from "@tanstack/react-table";
import { filterSchema } from "@/schemas/data-table";
import { z } from "zod";

export interface TablePagination {
  pageIndex: number;
  pageSize: number;
}

export interface TableSorting {
  id: string;
  desc: boolean;
}

export interface TableFilters {
  [key: string]: string | number | boolean | null;
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type StringKeyOf<TData> = Extract<keyof TData, string>

export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, "id"> & {
    id: StringKeyOf<TData>
  }
>

export interface TableResponse<T> {
  data: T[];
  pageCount: number;
  totalCount: number;
} 

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: StringKeyOf<TData>
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[]

export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData> | "title"
  label: string
  placeholder?: string
  options?: Option[]
}

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: "update" | "delete"
}

