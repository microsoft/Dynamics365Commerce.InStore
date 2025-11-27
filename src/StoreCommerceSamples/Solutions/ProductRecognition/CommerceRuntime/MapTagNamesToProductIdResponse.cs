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
