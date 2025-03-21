import { endpoints } from "@/fetchers/endpoints";
import { NextResponse } from "next/server";

export async function GET() {
	const response = await fetch(
		`${process.env.CORE_API_URL}${endpoints.core.transactions.overview}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
	console.log(response);
	if (!response.ok) {
		console.error(`API request failed with status ${response.status}`);
		return NextResponse.json(
			{ error: "Failed to fetch transaction overview" },
			{ status: 500 },
		);
	}

	const data = await response.json();
	console.log(data);
	return NextResponse.json(data);
}
