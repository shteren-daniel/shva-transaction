using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/transactions")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _service;

    public TransactionsController(ITransactionService service)
    {
        _service = service;
    }

    [HttpPost("insertTransaction")]
    public async Task<IActionResult> insertTransaction(TransactionRequest request)
    {
        var result = await _service.InsertTransactionAsync(request);
        return Ok(result);
    }

    [HttpGet("getApprovedTransaction")]
    public async Task<IActionResult> getApprovedTransaction()
    {
        var result = await _service.GetApprovedTransactionAsync();
        return Ok(result);
    }
}