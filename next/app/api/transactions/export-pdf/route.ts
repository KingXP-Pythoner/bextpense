import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";

export async function GET(request: NextRequest) {
  try {
    // Get the current URL for the page being viewed
    const pageUrl = request.nextUrl.searchParams.get("page");

    if (!pageUrl) {
      return NextResponse.json(
        { error: "Missing page parameter" },
        { status: 400 }
      );
    }

    // Call the .NET Core API endpoint to generate the PDF
    const response = await fetch(
      `${process.env.CORE_API_URL}/api/transactions/export-pdf?page=${encodeURIComponent(pageUrl)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText}`);
    }
    
    // Get the PDF data from the response
    const pdfBuffer = await response.arrayBuffer();
    
    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="transactions-export-${dayjs().format('YYYY-MM-DD')}.pdf"`,
      },
    });
  } catch (error: unknown) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate PDF", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 