namespace GasStationSample.CommerceRuntime
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// A class representing the response to the stop all gas pumps request.
    /// </summary>
    [DataContract]
    public sealed class StopAllPumpsDataResponse : Response
    {
        public StopAllPumpsDataResponse(IEnumerable<GasPump> pumps)
        {
            this.Pumps = pumps;
        }

        /// <summary>
        /// The gas pumps.
        /// </summary>
        public IEnumerable<GasPump> Pumps { get; private set; }
    }
}