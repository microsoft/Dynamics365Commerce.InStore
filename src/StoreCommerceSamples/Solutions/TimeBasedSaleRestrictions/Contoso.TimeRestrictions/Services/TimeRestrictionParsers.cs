/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.TimeRestrictions.Services
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;

    /// <summary>
    /// Provides utility methods for parsing time restriction configuration values.
    /// </summary>
    public static class TimeRestrictionParsers
    {
        /// <summary>
        /// Parses a time cutoff string in HH:mm format.
        /// </summary>
        /// <param name="cutoff">The time string to parse (e.g., "20:00" or "8:30").</param>
        /// <returns>A TimeSpan representing the cutoff time, or null if the input is invalid.</returns>
        public static TimeSpan? ParseCutoff(string cutoff)
        {
            if (string.IsNullOrWhiteSpace(cutoff)) return null;
            if (TimeSpan.TryParseExact(cutoff.Trim(), new[]{@"hh\:mm", @"h\:mm"}, CultureInfo.InvariantCulture, out var ts))
            {
                return ts;
            }
            return null;
        }

        /// <summary>
        /// Parses a comma-separated list of day names into a set of DayOfWeek values.
        /// </summary>
        /// <param name="daysCsv">Comma-separated day names (e.g., "Mon,Wed,Fri" or "Monday,Wednesday,Friday").</param>
        /// <returns>A HashSet of DayOfWeek values representing the parsed days.</returns>
        public static HashSet<DayOfWeek> ParseDays(string daysCsv)
        {
            var set = new HashSet<DayOfWeek>();
            if (string.IsNullOrWhiteSpace(daysCsv)) return set;
            foreach (var token in daysCsv.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                var t = token.Trim();
                if (Enum.TryParse<DayOfWeek>(NormalizeDay(t), true, out var day))
                {
                    set.Add(day);
                }
            }
            return set;
        }

        /// <summary>
        /// Normalizes short day names (Mon, Tue, etc.) to full day names.
        /// </summary>
        /// <param name="input">The day name to normalize.</param>
        /// <returns>The full day name or the original input if no match is found.</returns>
        private static string NormalizeDay(string input)
        {
            // Accept short names Mon/Tue/... and full names
            return input switch
            {
                "Mon" => "Monday",
                "Tue" => "Tuesday",
                "Wed" => "Wednesday",
                "Thu" => "Thursday",
                "Fri" => "Friday",
                "Sat" => "Saturday",
                "Sun" => "Sunday",
                _ => input
            };
        }
    }
}
