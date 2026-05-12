namespace server.Helpers;

public static class TimeZoneHelper
{
    private static readonly Dictionary<string, string> CountryTimeZones =
     new(StringComparer.OrdinalIgnoreCase)
     {
         ["Israel"] = "Israel Standard Time",
         ["France"] = "Romance Standard Time",
         ["USA"] = "Eastern Standard Time",
         ["Japan"] = "Tokyo Standard Time",
         ["Germany"] = "W. Europe Standard Time",
         ["UK"] = "GMT Standard Time",
         ["India"] = "India Standard Time",
         ["China"] = "China Standard Time"
     };

    public static string GetTimeZoneId(string country)
    {
        if (CountryTimeZones.TryGetValue(country.Trim(), out var timezone))
        {
            return timezone;
        }

        throw new ArgumentException($"Unsupported country: {country}");
    }


    public static DateTime GetLocalTime(string country, DateTime utcTime)
    {
        var timeZoneId = GetTimeZoneId(country);

        var timeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);

        return TimeZoneInfo.ConvertTimeFromUtc(utcTime, timeZone);
    }

    public static bool IsBankHours(string country, DateTime utcTime)
    {
        var localTime = GetLocalTime(country, utcTime);

        return localTime.Hour >= 8 && localTime.Hour < 18;
    }
}