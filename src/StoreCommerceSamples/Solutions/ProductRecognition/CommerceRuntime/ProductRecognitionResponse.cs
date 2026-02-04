namespace ProductRecognition.CommerceRuntime
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// Service response for product recognition functionality.
    /// </summary>
    [DataContract]
    public sealed class ProductRecognitionResponse : Response
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProductRecognitionResponse"/> class.
        /// </summary>
        /// <param name="recognitionResults">The collection of product recognition results.</param>
        public ProductRecognitionResponse(IEnumerable<ProductRecognitionResult> recognitionResults)
        {
            this.RecognitionResults = recognitionResults ?? new List<ProductRecognitionResult>();
        }

        /// <summary>
        /// Gets the collection of product recognition results.
        /// </summary>
        [DataMember]
        public IEnumerable<ProductRecognitionResult> RecognitionResults { get; private set; }
    }
}