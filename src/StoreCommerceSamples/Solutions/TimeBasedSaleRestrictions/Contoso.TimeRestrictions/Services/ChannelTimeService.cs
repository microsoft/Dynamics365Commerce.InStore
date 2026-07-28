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
    using System.Threading.Tasks;
    using Microsoft.Dynamics.Commerce.Runtime;

    /// <summary>
    /// Provides time-related services for converting UTC time to channel-specific local time.
    /// </summary>
    public sealed class ChannelTimeService
    {
        private readonly RequestContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="ChannelTimeService"/> class.
        /// </summary>
        /// <param name="context">The request context.</param>
        public ChannelTimeService(RequestContext context) => _context = context;

        /// <summary>
        /// Gets the current time in the channel's local time zone.
        /// </summary>
        /// <returns>The current date and time in the channel's local time zone.</returns>
        public Task<DateTime> GetNowInChannelLocalTimeAsync()
        {
            var channelConfig = _context.GetChannelConfiguration();
            var tzId = channelConfig?.TimeZoneInfoId ?? TimeZoneInfo.Local.Id;
            var tz = TimeZoneInfo.FindSystemTimeZoneById(tzId);
            var nowLocal = TimeZoneInfo.ConvertTime(DateTime.UtcNow, tz);
            return Task.FromResult(nowLocal);
        }
    }
}
