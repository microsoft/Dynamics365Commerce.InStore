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
    using System.Threading.Tasks;
    using Microsoft.Dynamics.Commerce.Runtime;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// Handler for retrieving Custom Vision configuration.
    /// </summary>
    public class GetCustomVisionConfigurationHandler : IRequestHandlerAsync
    {
        private readonly string Endpoint = "https://customvisionpredictionapi.cognitiveservices.azure.com/";
        private readonly string ProjectId = "MY_PROJECT_ID";
        private readonly string IterationName = "MY_ITERATION_NAME";
        private readonly string CertificateSubjectName = "MY_CERTIFICATE_SUBJECT_NAME";

        /// <summary>
        /// Gets the collection of supported request types by this handler.
        /// </summary>
        public IEnumerable<Type> SupportedRequestTypes
        {
            get
            {
                return new[]
                {
                    typeof(GetCustomVisionConfigurationRequest),
                };
            }
        }

        /// <summary>
        /// Executes the get configuration request.
        /// </summary>
        /// <param name="request">The request parameter.</param>
        /// <returns>The configuration service response.</returns>
        public async Task<Response> Execute(Request request)
        {
            ThrowIf.Null(request, nameof(request));

            switch (request)
            {
                case GetCustomVisionConfigurationRequest configRequest:
                    return await this.GetConfiguration(configRequest).ConfigureAwait(false);
                default:
                    throw new NotSupportedException(string.Format(CultureInfo.InvariantCulture, "Request '{0}' is not supported.", request.GetType()));
            }
        }

        /// <summary>
        /// Retrieves the Custom Vision configuration from the resource file.
        /// </summary>
        /// <param name="request">The configuration request.</param>
        /// <returns>The configuration response.</returns>
        private Task<GetCustomVisionConfigurationResponse> GetConfiguration(GetCustomVisionConfigurationRequest request)
        {
            return Task.FromResult(new GetCustomVisionConfigurationResponse(
                Endpoint,
                ProjectId,
                IterationName,
                CertificateSubjectName));
        }
    }
}
