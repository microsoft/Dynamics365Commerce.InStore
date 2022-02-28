namespace GasStationSample.CommerceRuntime
{
    using System.Runtime.Serialization;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// A class representing the request to get the gas station details.
    /// </summary>
    [DataContract]
    public sealed class GetGasStationDetailsDataRequest : Request
    {
        public GetGasStationDetailsDataRequest(string storeNumber)
        {
            this.StoreNumber = storeNumber;
        }

        /// <summary>
        /// The store number.
        /// </summary>
        public string StoreNumber { get; private set; }
    }
}