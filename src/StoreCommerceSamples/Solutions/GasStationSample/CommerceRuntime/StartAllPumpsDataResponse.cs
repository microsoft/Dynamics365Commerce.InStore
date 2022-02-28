namespace GasStationSample.CommerceRuntime
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// A class representing the response to the start all gas pumps request.
    /// </summary>
    [DataContract]
    public sealed class StartAllPumpsDataResponse : Response
    {
        public StartAllPumpsDataResponse(IEnumerable<GasPump> pumps)
        {
            this.Pumps = pumps;
        }

        public IEnumerable<GasPump> Pumps { get; private set; }
    }
}