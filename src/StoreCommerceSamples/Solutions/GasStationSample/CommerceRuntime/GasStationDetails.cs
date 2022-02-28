

namespace GasStationSample.CommerceRuntime
{
    using Microsoft.Dynamics.Commerce.Runtime;
    using System;
    using System.Collections.Generic;
    using System.Runtime.Serialization;
    using System.Text;

    public class GasStationDetails
    {
        public GasStationDetails(string storeNumber, string itemId)
        {
            this.StoreNumber = storeNumber;
            this.GasolineItemId = itemId;
        }

        [DataMember]
        public string StoreNumber { get; set; }

        [RequiredToBeUtc(true)]
        [DataMember]
        public DateTimeOffset LastGasDeliveryTime { get; set; }

        [RequiredToBeUtc(true)]
        [DataMember]
        public DateTimeOffset NextGasDeliveryTime { get; set; }

        [DataMember]
        public decimal GasBasePrice { get; set; }

        [DataMember]
        public int GasPumpCount { get; set; }

        [DataMember]
        public decimal GasTankCapacity { get; set; }

        [DataMember]
        public decimal GasTankLevel { get; set; }

        [DataMember]
        public string GasolineItemId { get; set; }
    }
}
