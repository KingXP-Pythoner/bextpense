"use server"

import { revalidateTag } from "next/cache"
import { authActionClient } from "./safe-action-client"
import { updateTransactionSchema } from "@/schemas/transactions"

export const updateTransactionAction = authActionClient.metadata({
    actionName: "updateTransactionAction",
})
  .schema(updateTransactionSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await fetch(`${process.env.CORE_API_URL}/api/transactions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parsedInput.id,
          amount: parsedInput.amount,
          type: parsedInput.type,
          description: parsedInput.description,
          categoryId: parsedInput.categoryId,
          transactionDate: parsedInput.transactionDate,
          title: parsedInput.title,
        }),
        cache: "no-store",
      })

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update transaction: ${errorText}`);
      }

      const result = await response.json()
      
      return result
    } catch (error: any) {
      console.error("Error updating transaction:", error)
      throw error
    }
  }, {
      onSuccess: async (data) => {
          console.log("[SERVER] Transaction updated:", data)
          revalidateTag("expense-tracker-all-transactions")
          revalidateTag("expense-tracker-overview")
      },
      onError: async (error) => {
        console.error("[SERVER] Error updating transaction:", error)
      } 
  }) 