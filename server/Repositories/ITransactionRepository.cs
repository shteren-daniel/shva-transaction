using server.Models;

namespace server.Repositories;

public interface ITransactionRepository
{
    Task<int> CreateAsync(Transaction tx);
    Task<IEnumerable<Transaction>> GetApprovedAsync();
}