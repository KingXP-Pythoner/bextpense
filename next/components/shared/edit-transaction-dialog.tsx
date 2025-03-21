"use client";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/shared/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Pencil } from "lucide-react";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogDescription,
	DialogClose,
} from "@/components/shared/ui/dialog";
import {
	FormControl,
	FormField,
	FormLabel,
	FormItem,
	FormMessage,
} from "@/components/shared/ui/form";
import { Form } from "@/components/shared/ui/form";
import { Input } from "@/components/shared/ui/input";
import { Combobox } from "@/components/shared/ui/combobox";
import { TTransaction, TTransactionType } from "@/lib/types/transaction";
import {
	TRANSACTION_CATEGORIES,
	TRANSACTION_TYPES,
} from "@/constants/transaction";
import { Separator } from "@/components/shared/ui/separator";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/shared/ui/popover";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import {
	updateTransactionSchema,
	UpdateTransactionSchema,
} from "@/schemas/transactions";
import { useAction } from "next-safe-action/hooks";
import { updateTransactionAction } from "@/actions/update-transaction";
import { toast } from "sonner";
import React from "react";
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
	transaction: TTransaction & {
		transactionDate: string;
		createdAt: string;
		updatedAt: string;
	};
};

const EditTransactionForm = ({
	transaction,
	onSuccess,
}: {
	transaction: TTransaction & {
		transactionDate: string;
		createdAt: string;
		updatedAt: string;
	};
	onSuccess: () => void;
}) => {
	const form = useForm<UpdateTransactionSchema>({
		resolver: zodResolver(updateTransactionSchema),
		defaultValues: {
			id: transaction.id,
			title: transaction.title,
			description: transaction.description || "",
			amount: transaction.amount,
			transactionDate: new Date(transaction.transactionDate).getTime(), // Convert ISO string to timestamp
			type: transaction.type as TTransactionType,
			categoryId: transaction.category,
		},
	});

	const { executeAsync: updateTransaction } = useAction(
		updateTransactionAction,
		{
			onSuccess: (data) => {
				toast.success("Transaction updated successfully");
				onSuccess?.();
			},
			onError: (error) => {
				const errorMessage = error?.error?.serverError || "Unknown error";
				toast.error(`Failed to update transaction: ${errorMessage}`);
			},
		},
	);

	return (
		<div>
			<Form {...form}>
				<form
					id="edit-transaction-form"
					onSubmit={form.handleSubmit(updateTransaction)}
					className="space-y-4"
				>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Amount</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Type</FormLabel>
								<Combobox
									triggerClassName="w-full"
									data={TRANSACTION_TYPES.map((type) => ({
										value: type,
										label: type.charAt(0).toUpperCase() + type.slice(1),
									}))}
									placeholder="Select transaction type"
									value={field.value}
									onChange={(value) =>
										field.onChange(value as TTransactionType)
									}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="categoryId"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Category</FormLabel>
								<Combobox
									triggerClassName="w-full"
									data={[
										...TRANSACTION_CATEGORIES.income.map((category) => ({
											value: category,
											label: category
												.split("_")
												.map(
													(word) =>
														word.charAt(0).toUpperCase() + word.slice(1),
												)
												.join(" "),
										})),
										...TRANSACTION_CATEGORIES.expense.map((category) => ({
											value: category,
											label: category
												.split("_")
												.map(
													(word) =>
														word.charAt(0).toUpperCase() + word.slice(1),
												)
												.join(" "),
										})),
									]}
									placeholder="Select category"
									value={field.value}
									onChange={(value) =>
										field.onChange(value as TTransactionType)
									}
								/>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="transactionDate"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Transaction date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn(
													"w-full pl-3 text-left font-normal",
													!field.value && "text-muted-foreground",
												)}
											>
												{field.value ? (
													dayjs(field.value).format("DD/MM/YYYY")
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto size-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={dayjs(field.value).toDate()}
											onSelect={(date) => {
												// Convert Date to timestamp (milliseconds)
												field.onChange(date ? date.getTime() : null);
											}}
											disabled={(date) =>
												date > dayjs().toDate() ||
												date < dayjs("1900-01-01").toDate()
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</div>
	);
};

export const EditTransactionDialog = ({ transaction }: Props) => {
	const [open, setOpen] = React.useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Button variant="outline" size="icon" onClick={() => setOpen(true)}>
				<Pencil className="stroke-primary" />
			</Button>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="font-medium text-lg">
						Edit transaction
					</DialogTitle>
					<DialogDescription>Modify your transaction details</DialogDescription>
				</DialogHeader>
				<EditTransactionForm
					transaction={transaction}
					onSuccess={() => setOpen(false)}
				/>
				<Separator className="h-4 bg-transparent" />
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Cancel
						</Button>
					</DialogClose>
					<Button type="submit" form="edit-transaction-form">
						Update
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
