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