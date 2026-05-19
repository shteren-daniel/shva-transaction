using FluentValidation;
using server.Models;

namespace server.Validators;

public class CreateTransactionRequestValidator
    : AbstractValidator<TransactionRequest>
{
    public CreateTransactionRequestValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0)
            .WithMessage("Amount must be greater than 0.");

        RuleFor(x => x.Country)
            .NotEmpty()
            .WithMessage("Country is required.");

        RuleFor(x => x.ClientTimeUtc)
            .NotEmpty()
            .Must(BeUtc)
            .WithMessage("Time must be UTC")
            .Must(NotBeInFuture)
            .WithMessage("Time cannot be in the future")
            .Must(BeWithinReasonableRange)
            .WithMessage("Time is out of acceptable range");
    }

    private bool BeUtc(DateTimeOffset dt)
        => dt.Offset == TimeSpan.Zero;

    private bool NotBeInFuture(DateTimeOffset dt)
        => dt <= DateTimeOffset.UtcNow.AddSeconds(5);

    private bool BeWithinReasonableRange(DateTimeOffset dt)
        => dt >= DateTimeOffset.UtcNow.AddYears(-2);
}