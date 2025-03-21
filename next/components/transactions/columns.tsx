"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TTransaction } from "@/lib/types/transaction";
import dayjs from "dayjs";
import { formatCurrency, toSentenceCase } from "@/lib/utils/format";
import { Checkbox } from "../shared/ui/checkbox";
import { CustomCheckbox } from "../shared/ui/custom-checkbox";
import { Badge } from "../shared/ui/badge";
import { cn } from "@/lib/utils";
import { EditTransactionDialog } from '../shared/edit-transaction-dialog';
import { DeleteTransactionDialog } from '@/components/shared/delete-transaction-dialog';

export const getColumns = (): ColumnDef<TTransaction>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mr-1 border-muted-foreground data-[state=checked]:border-primary"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value)
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <CustomCheckbox
        className="mr-1 border-muted-foreground data-[state=checked]:border-primary"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Transaction",
    accessorKey: "title",
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ row }) => <div className="text-sm text-muted-foreground truncate max-w-[200px]">{row.original.description}</div>,
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => <div>{formatCurrency(row.original.amount)}</div>,
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => <Badge variant="outline" className={cn("capitalize", row.original.type === "income" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 " : "bg-destructive/10 text-destructive  border-destructive/30")}>{toSentenceCase(row.original.type)}</Badge>,
  },
  {
    header: "Category", 
    accessorKey: "category",
    cell: ({ row }) => <Badge variant="outline" className="capitalize">{toSentenceCase(row.original.category)}</Badge>,
  },
  {
    header: "Transaction Date",
    accessorKey: "transactionDate",
    cell: ({ row }) => <div>{dayjs(row.original.transactionDate).format("DD/MM/YYYY")}</div>,
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => <div>{dayjs(row.original.createdAt).format("DD/MM/YYYY")}</div>,
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ row }) => <div>{dayjs(row.original.updatedAt).format("DD/MM/YYYY")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // Check the type of date fields and convert accordingly
      const transaction = {
        ...row.original,
        transactionDate: typeof row.original.transactionDate === 'object' 
          ? row.original.transactionDate.toISOString() 
          : row.original.transactionDate,
        createdAt: typeof row.original.createdAt === 'object' 
          ? row.original.createdAt.toISOString() 
          : row.original.createdAt,
        updatedAt: typeof row.original.updatedAt === 'object' 
          ? row.original.updatedAt.toISOString() 
          : row.original.updatedAt,
      } as TTransaction & {
        transactionDate: string;
        createdAt: string;
        updatedAt: string;
      };
      
      return (
        <div className="flex items-center gap-2">
          <EditTransactionDialog transaction={transaction} />
          <DeleteTransactionDialog transaction={row.original} />
        </div>
      );
    },
  },
];
