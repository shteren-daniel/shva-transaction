using FluentValidation;
using server.Models;

namespace server.Validators;

public class CreateTransactionRequestValidator
    : AbstractValidator<TransactionRequest>
{
    private static readonly string[] SupportedCountries =
    [
        "Israel",
        "France",
        "USA",
        "Japan"
    ];

    public CreateTransactionRequestValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0)
            .WithMessage("Amount must be greater than 0.");

        RuleFor(x => x.Country)
            .NotEmpty()
            .WithMessage("Country is required.")
            .Must(country => SupportedCountries.Contains(country))
            .WithMessage("Unsupported country.");

        RuleFor(x => x.ClientTimeUtc)
            .NotEmpty()
            .WithMessage("RequestedAtUtc is required.")
            .LessThanOrEqualTo(DateTime.UtcNow.AddMinutes(1))
            .WithMessage("RequestedAtUtc cannot be in the future.");
    }
}