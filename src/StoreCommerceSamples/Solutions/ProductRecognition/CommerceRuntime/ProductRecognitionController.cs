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
    using Microsoft.Dynamics.Commerce.Runtime;
    using Microsoft.Dynamics.Commerce.Runtime.DataModel;
    using Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts;
    using System.Threading.Tasks;

    /// <summary>
    /// The controller for product recognition functionality.
    /// </summary>
    public class ProductRecognitionController : IController
    {
        /// <summary>
        /// Recognize products from image data using Custom Vision.
        /// </summary>
        /// <param name="context">The endpoint context.</param>
        /// <param name="imageData">Base64 encoded image data.</param>
        /// <param name="confidenceThreshold">Optional confidence threshold (defaults to 0.3).</param>
        /// <returns>List of recognized products with confidence scores.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Employee, CommerceRoles.Customer, CommerceRoles.Application)]
        public async Task<PagedResult<ProductRecognitionResult>> RecognizeProduct(
            IEndpointContext context,
            string imageData,
            double? confidenceThreshold = null)
        {
            ThrowIf.NullOrWhiteSpace(imageData, nameof(imageData));

            var request = new ProductRecognitionRequest(
                imageData,
                confidenceThreshold: confidenceThreshold);

            var response = await context.ExecuteAsync<ProductRecognitionResponse>(request).ConfigureAwait(false);
            return new PagedResult<ProductRecognitionResult>(response.RecognitionResults.AsReadOnly());
        }
    }
}
