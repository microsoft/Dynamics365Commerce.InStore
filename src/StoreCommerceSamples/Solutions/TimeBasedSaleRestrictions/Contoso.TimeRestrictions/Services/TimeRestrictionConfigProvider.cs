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
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Dynamics.Commerce.Runtime;
    using Microsoft.Dynamics.Commerce.Runtime.DataModel;
    using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
    using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

    /// <summary>
    /// Provides access to time restriction configuration for products and channels.
    /// </summary>
    public sealed class TimeRestrictionConfigProvider
    {
        private readonly RequestContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="TimeRestrictionConfigProvider"/> class.
        /// </summary>
        /// <param name="context">The request context.</param>
        public TimeRestrictionConfigProvider(RequestContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves the time restriction rule for a specific product in a channel.
        /// </summary>
        /// <param name="productId">The product identifier.</param>
        /// <param name="channelId">The channel identifier.</param>
        /// <returns>A TimeRestrictionRule containing the configured restrictions for the product.</returns>
        public async Task<TimeRestrictionRule> GetRestrictionForProductAsync(long productId, long channelId)
        {
            string? afterTime = null;
            string? beforeTime = null;
            string? restrictionDays = null;
            string? reasonId = null;

            // Step 1: Try to read from product attributes
            var productAttributes = await GetProductAttributesAsync(productId, channelId).ConfigureAwait(false);
            if (productAttributes != null && productAttributes.Any())
            {
                afterTime = GetAttributeValue(productAttributes, AttributeConstants.RestrictedAfterTime);
                beforeTime = GetAttributeValue(productAttributes, AttributeConstants.RestrictedBeforeTime);
                restrictionDays = GetAttributeValue(productAttributes, AttributeConstants.RestrictionDays);
                reasonId = GetAttributeValue(productAttributes, AttributeConstants.RestrictionReasonId);
            }

            var rule = new TimeRestrictionRule
            {
                RestrictedAfter = TimeRestrictionParsers.ParseCutoff(afterTime ?? string.Empty),
                RestrictedBefore = TimeRestrictionParsers.ParseCutoff(beforeTime ?? string.Empty),
                Days = TimeRestrictionParsers.ParseDays(restrictionDays ?? string.Empty),
                ReasonId = reasonId
            };

            return rule;
        }

        /// <summary>
        /// Retrieves product attributes from the database.
        /// </summary>
        /// <param name="productId">The product identifier.</param>
        /// <param name="channelId">The channel identifier.</param>
        /// <returns>A collection of product attributes.</returns>
        private async Task<IEnumerable<AttributeValue>> GetProductAttributesAsync(long productId, long channelId)
        {
            var getAttributesRequest = new GetAttributeValuesByProductIdsServiceRequest(
                channelId,
                0, // catalogId
                new[] { productId },
                QueryResultSettings.AllRecords);

            var getAttributesResponse = await _context.ExecuteAsync<GetAttributeValuesByProductIdsServiceResponse>(getAttributesRequest).ConfigureAwait(false);
            if (getAttributesResponse?.AttributeValuesPerProduct != null && getAttributesResponse.AttributeValuesPerProduct.TryGetValue(productId, out var attributes))
            {
                return attributes;
            }

            return Enumerable.Empty<AttributeValue>();
        }

        /// <summary>
        /// Gets the value of a specific attribute from the product attributes collection.
        /// </summary>
        /// <param name="attributes">The collection of product attributes.</param>
        /// <param name="attributeName">The name of the attribute to retrieve.</param>
        /// <returns>The attribute value as a string, or null if not found.</returns>
        private string? GetAttributeValue(IEnumerable<AttributeValue> attributes, string attributeName)
        {
            var attribute = attributes.FirstOrDefault(a => string.Equals(a.Name, attributeName, StringComparison.OrdinalIgnoreCase));
            return attribute?.TextValue ?? attribute?.KeyName;
        }

        /// <summary>
        /// Gets the value of a specific extension property from a collection.
        /// </summary>
        /// <param name="properties">The collection of extension properties.</param>
        /// <param name="propertyKey">The key of the property to retrieve.</param>
        /// <returns>The property value as a string, or null if not found.</returns>
        private string? GetExtensionPropertyValue(ICollection<CommerceProperty> properties, string propertyKey)
        {
            var prop = properties.FirstOrDefault(p => string.Equals(p.Key, propertyKey, StringComparison.OrdinalIgnoreCase));
            return prop?.Value?.StringValue;
        }

        /// <summary>
        /// Gets a localized message describing why the cart line is blocked due to time restrictions.
        /// </summary>
        /// <param name="line">The cart line that is restricted.</param>
        /// <param name="localNow">The current date and time in the channel's local time zone.</param>
        /// <param name="rule">The time restriction rule that is blocking the sale.</param>
        /// <returns>A localized message describing the restriction.</returns>
        public string GetLocalizedBlockedMessage(CartLine line, DateTime localNow, TimeRestrictionRule rule)
        {
            var itemName = line?.Description ?? Resources.Resources.TimeRestriction_DefaultItemName;

            // If we have both before and after times, describe the allowed window
            if (rule.RestrictedBefore.HasValue && rule.RestrictedAfter.HasValue)
            {
                var beforeStr = rule.RestrictedBefore.Value.ToString(@"hh\:mm", CultureInfo.InvariantCulture);
                var afterStr = rule.RestrictedAfter.Value.ToString(@"hh\:mm", CultureInfo.InvariantCulture);
                return string.Format(CultureInfo.CurrentUICulture, Resources.Resources.TimeRestriction_PermittedTimeWindowFormat, itemName, beforeStr, afterStr);
            }
            // If we only have after time
            else if (rule.RestrictedAfter.HasValue)
            {
                var afterStr = rule.RestrictedAfter.Value.ToString(@"hh\:mm", CultureInfo.InvariantCulture);
                return string.Format(CultureInfo.CurrentUICulture, Resources.Resources.TimeRestriction_NotPermittedAfterFormat, itemName, afterStr);
            }
            // If we only have before time
            else if (rule.RestrictedBefore.HasValue)
            {
                var beforeStr = rule.RestrictedBefore.Value.ToString(@"hh\:mm", CultureInfo.InvariantCulture);
                return string.Format(CultureInfo.CurrentUICulture, Resources.Resources.TimeRestriction_NotPermittedBeforeFormat, itemName, beforeStr);
            }
            else
            {
                return string.Format(CultureInfo.CurrentUICulture, Resources.Resources.TimeRestriction_NotPermittedGeneric, itemName);
            }
        }
    }
}
