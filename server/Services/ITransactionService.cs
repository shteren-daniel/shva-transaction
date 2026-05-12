using server.Models;

namespace server.Services;

public interface ITransactionService
{
    Task<TransactionResponse> InsertTransactionAsync(TransactionRequest request);
    Task<IEnumerable<Transaction>> GetApprovedTransactionAsync();
}