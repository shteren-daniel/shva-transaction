using server.Helpers;
using server.Models;
using server.Repositories;

namespace server.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _repo;

    public TransactionService(ITransactionRepository repo)
    {
        _repo = repo;
    }

    public async Task<TransactionResponse> InsertTransactionAsync(TransactionRequest request)
    {
        var approved = TimeZoneHelper.IsBankHours(request.Country, request.ClientTimeUtc);

        var tx = new Transaction
        {
            Amount = request.Amount,
            Country = request.Country,
            RequestedAtUtc = request.ClientTimeUtc,
            Status = approved ? "Approved" : "Rejected"
        };

        await _repo.CreateAsync(tx);

        return new TransactionResponse
        {
            Status = tx.Status
        };
    }

    public async Task<IEnumerable<Transaction>> GetApprovedTransactionAsync()
    {
        return await _repo.GetApprovedAsync();
    }
}