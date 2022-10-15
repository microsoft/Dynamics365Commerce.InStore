/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.CommerceRuntime
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Dynamics.Commerce.Runtime;
    using Microsoft.Dynamics.Commerce.Runtime.DataModel;
    using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    public class AddExtensionPropertiesToProductSearchResults : IRequestTriggerAsync
    {
        // This key must match the name of the setting included in the CommerceRuntimeExtensionSettings.
        private const string IncludeExtensionPropertiesInProductSearchKey = "ext.Contoso.IncludeExtensionPropertiesInProductSearch";
        private const string ExtensionPropertyName = "CONTOSO_PRODUCT_VERSION";

        /// <summary>
        /// Gets the supported requests for this trigger.
        /// </summary>
        public IEnumerable<Type> SupportedRequestTypes
        {
            get
            {
                return new[] { typeof(SearchProductsServiceRequest) };
            }
        }

        /// <summary>
        /// Post trigger code to retrieve extension properties.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="response">The response.</param>
        public Task OnExecuted(Request request, Response response)
        {
            ThrowIf.Null(request, "request");
            ThrowIf.Null(response, "response");

            SearchProductsServiceResponse searchProductsResponse = response as SearchProductsServiceResponse;
            if (searchProductsResponse != null)
            {
                // Only include the version number in the extension properties if it is configured in the CommerceRuntime config file.
                if (request.RequestContext.Runtime.Configuration.Settings.TryGetValue(IncludeExtensionPropertiesInProductSearchKey, out string settingValue))
                {
                    if (bool.TryParse(settingValue, out bool shouldAddExtensionProperties) && shouldAddExtensionProperties)
                    {
                        var random = new Random();
                        foreach (ProductSearchResult productSearchResult in searchProductsResponse.ProductSearchResults)
                        {
                            var version = Math.Round((random.NextDouble() + .1) * random.Next(1, 10), 2); // Generate a random version number.
                            productSearchResult.SetProperty(ExtensionPropertyName, version.ToString());
                        }
                    }
                }
            }

            return Task.CompletedTask;
        }

        /// <summary>
        /// Pre trigger code.
        /// </summary>
        /// <param name="request">The request.</param>
        public Task OnExecuting(Request request)
        {
            return Task.CompletedTask;
        }
    }
}
