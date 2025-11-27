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
    using System.Runtime.Serialization;

    [DataContract]
    public class ProductRecognitionResult
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProductRecognitionResult"/> class.
        /// </summary>
        public ProductRecognitionResult()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ProductRecognitionResult"/> class.
        /// </summary>
        /// <param name="productId">The product identifier.</param>
        /// <param name="confidenceScore">The confidence score.</param>
        public ProductRecognitionResult(long productId, double confidenceScore)
        {
            this.ProductId = productId;
            this.ConfidenceScore = confidenceScore;
        }

        /// <summary>
        /// Gets or sets the product identifier.
        /// </summary>
        [DataMember]
        public long ProductId { get; set; }

        /// <summary>
        /// Gets or sets the confidence score.
        /// </summary>
        [DataMember]
        public double ConfidenceScore { get; set; }
    }
}