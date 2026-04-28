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

    /// <summary>
    /// Represents a time restriction rule that defines when sales of a product are restricted.
    /// Sales are allowed during the time window between RestrictedBefore and RestrictedAfter.
    /// </summary>
    public sealed class TimeRestrictionRule
    {
        /// <summary>
        /// Gets or sets the time cutoff after which sales are restricted.
        /// Used with RestrictedBefore to define a time window.
        /// </summary>
        public TimeSpan? RestrictedAfter { get; set; }

        /// <summary>
        /// Gets or sets the time before which sales are restricted.
        /// Used with RestrictedAfter to define a time window.
        /// </summary>
        public TimeSpan? RestrictedBefore { get; set; }

        /// <summary>
        /// Gets or sets the days of the week on which the restriction applies. If empty, applies to all days.
        /// </summary>
        public HashSet<DayOfWeek> Days { get; set; } = new HashSet<DayOfWeek>();

        /// <summary>
        /// Gets or sets the optional reason code identifier associated with this restriction.
        /// </summary>
        public string? ReasonId { get; set; }

        /// <summary>
        /// Determines whether the restriction is active at the specified local date and time.
        /// Sales are restricted if the current time is outside the allowed time window.
        /// If RestrictedBefore equals RestrictedAfter, no restriction applies.
        /// </summary>
        /// <param name="localNow">The current date and time in the channel's local time zone.</param>
        /// <returns>True if sales are restricted at the specified time; otherwise, false.</returns>
        public bool IsRestricted(DateTime localNow)
        {
            // Check if the restriction applies to the current day of the week
            var dayOk = Days == null || Days.Count == 0 || Days.Contains(localNow.DayOfWeek);
            if (!dayOk)
            {
                return false;
            }

            // If no time restrictions are set, allow sales
            if (RestrictedBefore == null && RestrictedAfter == null)
            {
                return false;
            }

            // If both times are set and equal, no restriction applies
            if (RestrictedBefore.HasValue && RestrictedAfter.HasValue && RestrictedBefore.Value == RestrictedAfter.Value)
            {
                return false;
            }

            var currentTime = localNow.TimeOfDay;

            // Handle the case with only RestrictedAfter (legacy behavior)
            if (RestrictedAfter.HasValue && !RestrictedBefore.HasValue)
            {
                return currentTime >= RestrictedAfter.Value;
            }

            // Handle the case with only RestrictedBefore
            if (RestrictedBefore.HasValue && !RestrictedAfter.HasValue)
            {
                return currentTime < RestrictedBefore.Value;
            }

            // Both times are set - check if current time is in the allowed window
            // At this point we know both values are set because we've already handled the null cases
            var beforeValue = RestrictedBefore!.Value;
            var afterValue = RestrictedAfter!.Value;
            
            if (beforeValue < afterValue)
            {
                // Normal window: e.g., 08:00 to 20:00 - restrict if before 08:00 OR after 20:00
                return currentTime < beforeValue || currentTime >= afterValue;
            }
            else
            {
                // Overnight window: e.g., 20:00 to 08:00 - restrict if before 08:00 AND after 20:00
                // This means sales are allowed from 20:00 to 07:59:59 (crossing midnight)
                return currentTime < beforeValue && currentTime >= afterValue;
            }
        }
    }
}
