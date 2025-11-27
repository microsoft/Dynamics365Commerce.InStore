/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */
namespace ProductRecognition.CommerceRuntime
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Dynamics.Commerce.Runtime;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// Handler for mapping tag names to product IDs.
    /// </summary>
    public class MapTagNamesToProductIdHandler : IRequestHandlerAsync
    {
        private readonly Dictionary<string, long> itemIdsByTag = new Dictionary<string, long>(StringComparer.OrdinalIgnoreCase)
        {
            // MAP tag names to product IDs here
        };

        /// <summary>
        /// Gets the collection of supported request types by this handler.
        /// </summary>
        public IEnumerable<Type> SupportedRequestTypes
        {
            get
            {
                return new[]
                {
                    typeof(MapTagNamesToProductIdRequest),
                };
            }
        }

        /// <summary>
        /// Executes the map tag names to product IDs request.
        /// </summary>
        /// <param name="request">The request parameter.</param>
        /// <returns>The mapping service response.</returns>
        public async Task<Response> Execute(Request request)
        {
            ThrowIf.Null(request, nameof(request));

            switch (request)
            {
                case MapTagNamesToProductIdRequest mapRequest:
                    return await this.MapTagNamesToProductId(mapRequest).ConfigureAwait(false);
                default:
                    throw new NotSupportedException(string.Format(CultureInfo.InvariantCulture, "Request '{0}' is not supported.", request.GetType()));
            }
        }

        /// <summary>
        /// Maps tag names to product IDs.
        /// </summary>
        /// <param name="request">The mapping request.</param>
        /// <returns>The mapping response.</returns>
        private Task<MapTagNamesToProductIdResponse> MapTagNamesToProductId(MapTagNamesToProductIdRequest request)
        {
            ThrowIf.Null(request, nameof(request));
            ThrowIf.Null(request.TagNames, nameof(request.TagNames));

            var productIdsByTagName = new Dictionary<string, long>(StringComparer.OrdinalIgnoreCase);

            foreach (string tagName in request.TagNames)
            {
                if (!string.IsNullOrWhiteSpace(tagName) && this.itemIdsByTag.TryGetValue(tagName, out long productId))
                {
                    productIdsByTagName[tagName] = productId;
                }
            }

            return Task.FromResult(new MapTagNamesToProductIdResponse(productIdsByTagName));
        }
    }
}
