namespace GasStationSample.CommerceRuntime
{
    using System.Runtime.Serialization;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// A class representing the request to stop all the gas pumps.
    /// </summary>
    [DataContract]
    public sealed class StopAllPumpsDataRequest : Request
    {
        public StopAllPumpsDataRequest(string storeNumber)
        {
            this.StoreNumber = storeNumber;
        }

        /// <summary>
        /// Gets the store number.
        /// </summary>
        public string StoreNumber { get; private set; }
    }
}