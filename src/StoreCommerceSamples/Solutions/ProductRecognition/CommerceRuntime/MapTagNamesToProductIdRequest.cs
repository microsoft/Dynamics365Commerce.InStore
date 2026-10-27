namespace ProductRecognition.CommerceRuntime
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// The service request for mapping tag names to product IDs.
    /// </summary>
    [DataContract]
    public sealed class MapTagNamesToProductIdRequest : Request
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MapTagNamesToProductIdRequest"/> class.
        /// </summary>
        /// <param name="tagNames">The tag names to map.</param>
        public MapTagNamesToProductIdRequest(IEnumerable<string> tagNames)
        {
            this.TagNames = tagNames;
        }

        /// <summary>
        /// Gets the tag names to map to product IDs.
        /// </summary>
        [DataMember]
        public IEnumerable<string> TagNames { get; private set; }
    }
}
