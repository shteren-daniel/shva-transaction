using Dapper;
using server.Data;
using server.Models;

namespace server.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly IDbConnectionFactory _factory;

    public TransactionRepository(IDbConnectionFactory factory)
    {
        _factory = factory;
    }

    public async Task<int> CreateAsync(Transaction tx)
    {
        using var conn = _factory.CreateConnection();

        var sql = @"
            INSERT INTO Transactions (Amount, Country, RequestedAtUtc, Status)
            VALUES (@Amount, @Country, @RequestedAtUtc, @Status);
            SELECT CAST(SCOPE_IDENTITY() as int);";

        return await conn.ExecuteScalarAsync<int>(sql, tx);
    }

    public async Task<IEnumerable<Transaction>> GetApprovedAsync()
    {
        using var conn = _factory.CreateConnection();

        return await conn.QueryAsync<Transaction>(
            "SELECT * FROM Transactions WHERE Status = 'Approved'");
    }
}