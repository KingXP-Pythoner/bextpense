"use server";

import { revalidateTag } from "next/cache";
import { authActionClient } from "./safe-action-client";
import { createTransactionSchema } from "@/schemas/transactions";

export const createTransactionAction = authActionClient
	.metadata({
		actionName: "createTransactionAction",
	})
	.schema(createTransactionSchema)
	.action(
		async ({ parsedInput }) => {
			try {
				const response = await fetch(
					`${process.env.CORE_API_URL}/api/transactions`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							amount: parsedInput.amount,
							type: parsedInput.type,
							description: parsedInput.description,
							categoryId: parsedInput.categoryId,
							transactionDate: parsedInput.transactionDate,
							title: parsedInput.title,
						}),
						cache: "no-store",
					},
				);

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`Failed to create transaction: ${errorText}`);
				}

				const result = await response.json();

				return result;
			} catch (error: any) {
				console.error("Error creating transaction:", error);
				throw error;
			}
		},
		{
			onSuccess: async (data) => {
				console.log("[SERVER] Transaction created:", data);
				revalidateTag("expense-tracker-all-transactions");
				revalidateTag("expense-tracker-overview");
			},
			onError: async (error) => {
				console.error("[SERVER] Error creating transaction:", error);
			},
		},
	);
