/**
 * Type-safe try-catch wrapper for both synchronous and asynchronous operations
 * Returns a tuple with [data, error] where exactly one is undefined
 */

export type Result<T, E = Error> =
	| [T, undefined] // Success case: data with no error
	| [undefined, E] // Error case: error with no data

/**
 * Executes a synchronous function and returns a type-safe result tuple
 *
 * @param fn - Function to execute within try-catch
 * @returns [data, undefined] on success or [undefined, error] on error
 */
export function tryCatch<T, E = Error>(fn: () => T): Result<T, E> {
	try {
		return [fn(), undefined]
	} catch (error) {
		return [undefined, error as E]
	}
}

/**
 * Executes an asynchronous function and returns a Promise with a type-safe result tuple
 *
 * @param fn - Async function to execute within try-catch
 * @returns Promise with [data, undefined] on success or [undefined, error] on error
 */
export async function tryCatchAsync<T, E = Error>(fn: () => Promise<T>): Promise<Result<T, E>> {
	try {
		const data = await fn()
		return [data, undefined]
	} catch (error) {
		return [undefined, error as E]
	}
}

/**
 * Unwraps a Result tuple and returns the value or throws the error
 * Useful when you want to use the value directly and handle errors elsewhere
 *
 * @param result - Result tuple from tryCatch or tryCatchAsync
 * @param errorTransformer - Optional function to transform the error before throwing
 * @returns The value if success
 * @throws The error if failure
 */
export function unwrap<T, E = Error>(result: Result<T, E>, errorTransformer?: (error: E) => unknown): T {
	const [data, error] = result

	if (error !== undefined) {
		if (errorTransformer) {
			throw errorTransformer(error)
		}
		throw error
	}

	return data as T
}

/**
 * Maps a Result's value if it's successful, preserves the error otherwise
 *
 * @param result - The original Result tuple
 * @param mapper - Function to transform the data
 * @returns A new Result tuple with the transformed data or the original error
 */
export function mapResult<T, U, E = Error>(result: Result<T, E>, mapper: (data: T) => U): Result<U, E> {
	const [data, error] = result

	if (error !== undefined) {
		return [undefined, error]
	}

	return [mapper(data as T), undefined]
}

/**
 * Type guard to check if a Result is successful
 *
 * @param result - Result tuple to check
 * @returns True if the result is successful (has data and no error)
 */
export function isSuccess<T, E = Error>(result: Result<T, E>): result is [T, undefined] {
	return result[1] === undefined
}

/**
 * Type guard to check if a Result is an error
 *
 * @param result - Result tuple to check
 * @returns True if the result is an error (has error and no data)
 */
export function isError<T, E = Error>(result: Result<T, E>): result is [undefined, E] {
	return result[1] !== undefined
}
