namespace server.Models;

public class Transaction
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string Country { get; set; } = string.Empty;
    public DateTime RequestedAtUtc { get; set; }
    public string Status { get; set; } = string.Empty; // Approved / Rejected
}