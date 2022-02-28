namespace GasStationSample.CommerceRuntime
{
    using System.Runtime.Serialization;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// A class representing the response to the get gas station details request.
    /// </summary>
    [DataContract]
    public sealed class GetGasStationDetailsDataResponse : Response
    {
        public GetGasStationDetailsDataResponse(GasStationDetails details)
        {
            this.Details = details;
        }

        /// <summary>
        /// The gas station details.
        /// </summary>
        public GasStationDetails Details { get; private set; }
    }
}