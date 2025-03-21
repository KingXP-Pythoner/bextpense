import "server-only"
import { createSafeActionClient } from "next-safe-action"
import { z } from "zod"
import { fakeAuth } from "@/lib/fake-auth"
class SafeActionError extends Error {}

// Base client.
export const actionClient = createSafeActionClient({
	handleServerError: (e) => {
		console.error("🚨 [SAFE_ACTION_SERVER_ERROR]: Unexpected server error")
	},
	defineMetadataSchema: () => {
		return z.object({
			actionName: z.string(),
		})
	},
	// Define logging middleware.
}).use(async ({ next, clientInput, metadata }) => {
	console.log("📝 [SAFE_ACTION_MIDDLEWARE]: Logging... ")

	const startTime = performance.now()
	const executionResult = await next()
	const endTime = performance.now()
	const inMs = endTime - startTime
	const inSeconds = inMs / 1000
	console.dir(
		{
			actionName: metadata.actionName,
			durationInMs: inMs,
			durationInSeconds: inSeconds,
			clientInput,
			result: executionResult,
		},
		{ depth: Infinity }
	)
	// And then return the result of the awaited action.
	return executionResult
})

export const authActionClient = actionClient
	// Define authorization middleware.
	.use(async ({ next }) => {
		const user = await fakeAuth()

		if (!user) {
			throw new Error("Session not found!")
		}
		if (!user.userId || !user.email) {
			throw new Error("Session is not valid!")
		}
		// Return the next middleware with `userId` value in the context
		return next({
			ctx: {
				authUserId: user.userId,
				authUserName: user.name,
				authUserEmail: user.email,
			},
		})
	})

