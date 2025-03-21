"use server";

import { revalidateTag } from "next/cache";
import { authActionClient } from "./safe-action-client";
import { deleteTransactionSchema } from "@/schemas/transactions";

export const deleteTransactionAction = authActionClient
	.metadata({
		actionName: "deleteTransactionAction",
	})
	.schema(deleteTransactionSchema)
	.action(
		async ({ parsedInput }) => {
			try {
				const response = await fetch(
					`${process.env.CORE_API_URL}/api/transactions/${parsedInput.id}`,
					{
						method: "DELETE",
					},
				);

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`Failed to delete transaction: ${errorText}`);
				}

				const result = await response.json();

				return result;
			} catch (error: any) {
				console.error("Error deleting transaction:", error);
				throw error;
			}
		},
		{
			onSuccess: async (data) => {
				console.log("[SERVER] Transaction deleted:", data);
				revalidateTag("expense-tracker-all-transactions");
				revalidateTag("expense-tracker-overview");
			},
			onError: async (error) => {
				console.error("[SERVER] Error deleting transaction:", error);
			},
		},
	);
