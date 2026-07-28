namespace ProductRecognition.CommerceRuntime
{
    using System.Runtime.Serialization;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// The service request for product recognition.
    /// </summary>
    [DataContract]
    public sealed class ProductRecognitionRequest : Request
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProductRecognitionRequest"/> class.
        /// </summary>
        /// <param name="imageData">The image data as a base64 string.</param>
        /// <param name="confidenceThreshold">Optional POS override for confidence threshold.</param>
        /// <param name="maxResults">Optional POS override for maximum number of results.</param>
        public ProductRecognitionRequest(
            string imageData,
            double? confidenceThreshold = null)
        {
            this.ImageData = imageData;
            this.ConfidenceThreshold = confidenceThreshold;
        }

        /// <summary>
        /// Gets the image data as a base64 string.
        /// </summary>
        [DataMember]
        public string ImageData { get; private set; }

        /// <summary>
        /// Gets the optional POS override for confidence threshold.
        /// </summary>
        [DataMember]
        public double? ConfidenceThreshold { get; private set; }
    }
}