using Bextpense.Commands.CreateTransaction.DTOs;
using Bextpense.Commands.DeleteTransaction.DTOs;
using Bextpense.Commands.Services;
using Bextpense.Commands.UpdateTransaction.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Bextpense.Commands.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionCommandService _transactionService;
        private readonly ILogger<TransactionsController> _logger;

        public TransactionsController(
            ITransactionCommandService transactionService,
            ILogger<TransactionsController> logger
        )
        {
            _transactionService = transactionService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction(
            [FromBody] CreateTransactionRequest request
        )
        {
            try
            {
                _logger.LogInformation("Received create transaction request: {@Request}", request);

                // TODO: Get actual user ID from authentication
                var userId = "test-fake-user-id";

                var result = await _transactionService.CreateTransactionAsync(userId, request);
                return Created($"api/transactions/{result.Id}", result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create transaction");
                return Problem(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTransaction(
            [FromBody] UpdateTransactionRequest request
        )
        {
            try
            {
                _logger.LogInformation("Received update transaction request: {@Request}", request);

                // TODO: Get actual user ID from authentication
                var userId = "test-fake-user-id";

                var result = await _transactionService.UpdateTransactionAsync(userId, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update transaction");
                return Problem(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(string id)
        {
            try
            {
                _logger.LogInformation("Received delete transaction request for ID: {Id}", id);

                // TODO: Get actual user ID from authentication
                var userId = "test-fake-user-id";

                var request = new DeleteTransactionRequest { Id = id };
                var result = await _transactionService.DeleteTransactionAsync(userId, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete transaction");
                return Problem(ex.Message);
            }
        }
    }
}
