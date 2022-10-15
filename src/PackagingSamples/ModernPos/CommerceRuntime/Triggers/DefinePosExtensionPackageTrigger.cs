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
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// Class that implements a post trigger for the GetExtensionPackageDefinitionsRequest request type.
    /// </summary>
    public class DefinePosExtensionPackageTrigger : IRequestTriggerAsync
    {
        /// <summary>
        /// Gets the supported requests for this trigger.
        /// </summary>
        public IEnumerable<Type> SupportedRequestTypes
        {
            get
            {
                return new[] { typeof(GetExtensionPackageDefinitionsRequest) };
            }
        }

        /// <summary>
        /// Post trigger to retrieve extension package.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="response">The response.</param>
        public Task OnExecuted(Request request, Response response)
        {
            ThrowIf.Null(request, "request");
            ThrowIf.Null(response, "response");

            var getExtensionsResponse = (GetExtensionPackageDefinitionsResponse)response;
            var extensionPackageDefinition = new ExtensionPackageDefinition();

            // Should match the PackageName used when packaging the customization package (i.e. in CustomizationPackage.props).
            extensionPackageDefinition.Name = "Contoso.ModernPosPackagingSample";
            extensionPackageDefinition.Publisher = "Contoso";
            extensionPackageDefinition.IsEnabled = true;

            getExtensionsResponse.ExtensionPackageDefinitions.Add(extensionPackageDefinition);

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