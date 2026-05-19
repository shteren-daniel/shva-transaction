using System.Globalization;

namespace server.Helpers;

public static class TimeZoneHelper
{
    public static bool IsBankHours(string country, DateTime localTime)
    {
        return localTime.Hour >= 8 && localTime.Hour < 18;
    }
}