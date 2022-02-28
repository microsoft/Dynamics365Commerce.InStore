namespace GasStationSample.CommerceRuntime
{
    using System.Runtime.Serialization;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// A class representing the request to start all the gas pumps.
    /// </summary>
    [DataContract]
    public sealed class StartAllPumpsDataRequest : Request
    {
        public StartAllPumpsDataRequest(string storeNumber)
        {
            this.StoreNumber = storeNumber;
        }

        /// <summary>
        /// The store number.
        /// </summary>
        public string StoreNumber { get; private set; }
    }
}