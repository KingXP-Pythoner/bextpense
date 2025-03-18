using Microsoft.AspNetCore.Mvc;

namespace Bextpense.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HelloWorldController : ControllerBase
    {
        private readonly ILogger<HelloWorldController> _logger;

        public HelloWorldController(ILogger<HelloWorldController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult HelloWorld()
        {
            return Ok("Hello World");
        }
    }
}
