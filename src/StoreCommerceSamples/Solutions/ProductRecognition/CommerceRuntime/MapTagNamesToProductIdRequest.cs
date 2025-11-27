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
