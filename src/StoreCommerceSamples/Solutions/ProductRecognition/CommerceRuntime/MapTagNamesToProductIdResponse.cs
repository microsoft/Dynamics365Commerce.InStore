namespace ProductRecognition.CommerceRuntime
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// Service response for mapping tag names to product IDs.
    /// </summary>
    [DataContract]
    public sealed class MapTagNamesToProductIdResponse : Response
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MapTagNamesToProductIdResponse"/> class.
        /// </summary>
        /// <param name="productIdsByTagName">Dictionary mapping tag names to product IDs.</param>
        public MapTagNamesToProductIdResponse(IDictionary<string, long> productIdsByTagName)
        {
            this.ProductIdsByTagName = productIdsByTagName;
        }

        /// <summary>
        /// Gets the dictionary mapping tag names to product IDs.
        /// </summary>
        [DataMember]
        public IDictionary<string, long> ProductIdsByTagName { get; private set; }
    }
}
