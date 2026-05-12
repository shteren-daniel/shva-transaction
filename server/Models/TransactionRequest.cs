namespace server.Models;

public class TransactionRequest
{
    public decimal Amount { get; set; }
    public string Country { get; set; } = string.Empty;
    public DateTime ClientTimeUtc { get; set; }
}