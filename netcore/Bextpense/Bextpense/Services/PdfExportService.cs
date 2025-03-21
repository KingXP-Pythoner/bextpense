using System;
using System.Threading.Tasks;
using Microsoft.Playwright;

namespace Bextpense.Services
{
    public interface IPdfExportService
    {
        Task<byte[]> GeneratePdfFromUrl(string url);
    }

    public class PdfExportService : IPdfExportService
    {
        private readonly ILogger<PdfExportService> _logger;
        private readonly IConfiguration _configuration;

        public PdfExportService(ILogger<PdfExportService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<byte[]> GeneratePdfFromUrl(string url)
        {
            _logger.LogInformation("Generating PDF from URL: {Url}", url);

            try
            {
                // Initialize Playwright
                using var playwright = await Microsoft.Playwright.Playwright.CreateAsync();

                // Launch a new browser
                await using var browser = await playwright.Chromium.LaunchAsync(
                    new BrowserTypeLaunchOptions { Headless = true }
                );

                // Create a new browser context
                var context = await browser.NewContextAsync();

                // Create a new page
                var page = await context.NewPageAsync();

                // Navigate to the URL
                _logger.LogInformation("Navigating to URL: {Url}", url);
                await page.GotoAsync(
                    url,
                    new PageGotoOptions
                    {
                        WaitUntil = WaitUntilState.NetworkIdle,
                        Timeout = 60000, // 60 seconds timeout
                    }
                );

                // Wait for the page to be fully loaded
                await page.WaitForLoadStateAsync(LoadState.NetworkIdle);

                // Wait an additional second for any JavaScript to complete
                await Task.Delay(1000);

                // Generate PDF
                _logger.LogInformation("Generating PDF");
                var pdfBytes = await page.PdfAsync(
                    new PagePdfOptions
                    {
                        Format = "A4",
                        PrintBackground = true,
                        Margin = new Margin
                        {
                            Top = "1cm",
                            Bottom = "1cm",
                            Left = "1cm",
                            Right = "1cm",
                        },
                        Scale = 0.8f,
                    }
                );

                _logger.LogInformation(
                    "PDF generated successfully, size: {Size} bytes",
                    pdfBytes.Length
                );
                return pdfBytes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate PDF from URL: {Url}", url);
                throw;
            }
        }
    }
}
