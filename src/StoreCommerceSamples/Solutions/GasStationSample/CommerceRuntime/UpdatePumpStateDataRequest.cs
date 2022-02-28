namespace GasStationSample.CommerceRuntime
{
    using System.Runtime.Serialization;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// A request class to update the pump state.
    /// </summary>
    [DataContract]
    public sealed class UpdatePumpStateDataRequest : Request
    {
        public UpdatePumpStateDataRequest(string storeNumber, long id, GasPumpState state)
        {
            this.StoreNumber = storeNumber;
            this.PumpId = id;
            this.State = state;
        }

        /// <summary>
        /// Gets the store number.
        /// </summary>
        public string StoreNumber { get; private set; }

        /// <summary>
        /// Gets the pump identifier.
        /// </summary>
        public long PumpId { get; private set; }

        /// <summary>
        /// Gets the gas pump state.
        /// </summary>
        public GasPumpState State { get; private set; }
    }
}