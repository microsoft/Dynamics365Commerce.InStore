namespace ProductRecognition.CommerceRuntime
{
    using System.Runtime.Serialization;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// Service response for Custom Vision configuration.
    /// </summary>
    [DataContract]
    public sealed class GetCustomVisionConfigurationResponse : Response
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetCustomVisionConfigurationResponse"/> class.
        /// </summary>
        /// <param name="endpoint">The Custom Vision endpoint.</param>
        /// <param name="projectId">The Custom Vision project ID.</param>
        /// <param name="iterationName">The Custom Vision iteration name.</param>
        /// <param name="certificateSubjectName">The certificate subject name for authentication.</param>
        public GetCustomVisionConfigurationResponse(
            string endpoint,
            string projectId,
            string iterationName,
            string certificateSubjectName)
        {
            this.Endpoint = endpoint;
            this.ProjectId = projectId;
            this.IterationName = iterationName;
            this.CertificateSubjectName = certificateSubjectName;
        }

        /// <summary>
        /// Gets the Custom Vision endpoint.
        /// </summary>
        [DataMember]
        public string Endpoint { get; private set; }

        /// <summary>
        /// Gets the Custom Vision project ID.
        /// </summary>
        [DataMember]
        public string ProjectId { get; private set; }

        /// <summary>
        /// Gets the Custom Vision iteration name.
        /// </summary>
        [DataMember]
        public string IterationName { get; private set; }

        /// <summary>
        /// Gets the certificate subject name for authentication.
        /// </summary>
        [DataMember]
        public string CertificateSubjectName { get; private set; }
    }
}
