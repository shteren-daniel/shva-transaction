using System.Net;
using System.Text.Json;
using System.Linq;
using FluentValidation;

namespace server.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Unhandled exception occurred. TraceId: {TraceId}",
                    context.TraceIdentifier);

                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(
            HttpContext context,
            Exception exception)
        {
            context.Response.ContentType = "application/json";

            var statusCode = exception switch
            {
                ArgumentException => StatusCodes.Status400BadRequest,

                KeyNotFoundException => StatusCodes.Status404NotFound,

                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,

                ValidationException => StatusCodes.Status400BadRequest,

                _ => StatusCodes.Status500InternalServerError
            };

            var response = new ErrorResponse
            {
                StatusCode = statusCode,
                Message = exception.Message,
                TraceId = context.TraceIdentifier
            };

            if (exception is ValidationException validationException)
            {
                response.Message = "Validation failed";

                response.Errors = validationException.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key ?? string.Empty, g => g.Select(e => e.ErrorMessage).ToArray());
            }

            context.Response.StatusCode = statusCode;

            var json = JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(json);
        }
    }

    public class ErrorResponse
    {
        public int StatusCode { get; set; }

        public string Message { get; set; } = string.Empty;

        public string TraceId { get; set; } = string.Empty;
        
        public Dictionary<string, string[]>? Errors { get; set; }
    }
}