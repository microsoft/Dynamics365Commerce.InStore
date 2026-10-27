namespace ProductRecognition.CommerceRuntime
{
    using System.Runtime.Serialization;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// The service request for retrieving Custom Vision configuration.
    /// </summary>
    [DataContract]
    public sealed class GetCustomVisionConfigurationRequest : Request
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetCustomVisionConfigurationRequest"/> class.
        /// </summary>
        public GetCustomVisionConfigurationRequest()
        {
        }
    }
}