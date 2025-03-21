using Bextpense.Infrastructure.Data;
using Bextpense.Queries.AllTransactions;
using Bextpense.Queries.AllTransactions.DTOs;
using Bextpense.Queries.AllTransactions.Services;
using Bextpense.Queries.Home.GetTransactionOverview;
using Bextpense.Queries.Home.GetTransactionOverview.Services;
using Bextpense.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Bextpense.Queries.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ITransactionAnalysisService _transactionAnalysis;
        private readonly ITransactionService _transactionService;
        private readonly ILogger<TransactionsController> _logger;
        private readonly IPdfExportService _pdfExportService;
        private readonly IConfiguration _configuration;

        public TransactionsController(
            AppDbContext db,
            ITransactionAnalysisService transactionAnalysis,
            ITransactionService transactionService,
            ILogger<TransactionsController> logger,
            IPdfExportService pdfExportService,
            IConfiguration configuration
        )
        {
            _db = db;
            _transactionAnalysis = transactionAnalysis;
            _transactionService = transactionService;
            _logger = logger;
            _pdfExportService = pdfExportService;
            _configuration = configuration;
        }

        [HttpGet("transaction-overview")]
        public async Task<IActionResult> GetTransactionOverview()
        {
            // TODO: Get actual user ID from authentication
            var userId = "test-fake-user-id";
            var handler = new GetTransactionOverviewHandler(_db, _transactionAnalysis);
            try
            {
                var result = await handler.Run(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get transaction overview");
                return Problem("Failed to get transaction overview");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTransactions(
            [FromQuery] GetTransactionsRequest request
        )
        {
            try
            {
                // Log request for debugging
                _logger.LogInformation("Received transaction request: {@Request}", request);

                // TODO: Get actual user ID from authentication
                var userId = "test-fake-user-id";

                // Ensure filters dictionary is initialized
                request.Filters ??= new Dictionary<string, string>();

                var result = await _transactionService.GetTransactionsAsync(userId, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get transactions");
                return Problem(ex.Message);
            }
        }

        [HttpGet("export-pdf")]
        public async Task<IActionResult> ExportPdf([FromQuery] string page)
        {
            try
            {
                // Log request for debugging
                _logger.LogInformation("Received PDF export request for page: {Page}", page);

                if (string.IsNullOrEmpty(page))
                {
                    return BadRequest("Page URL is required");
                }

                // Generate PDF from the URL
                var pdfBytes = await _pdfExportService.GeneratePdfFromUrl(page);

                // Return the PDF
                return File(
                    pdfBytes,
                    "application/pdf",
                    $"transactions-export-{DateTime.UtcNow:yyyy-MM-dd}.pdf"
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to export PDF");
                return Problem($"Failed to export PDF: {ex.Message}");
            }
        }
    }
}
