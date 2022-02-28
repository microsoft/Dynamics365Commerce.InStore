

namespace GasStationSample.CommerceRuntime
{
    using Microsoft.Dynamics.Commerce.Runtime;
    using System;
    using System.Collections.Generic;
    using System.Runtime.Serialization;
    using System.Text;

    public class GasPumpState
    {
        public GasPumpState() : this(GasPumpStatus.Unknown)
        {
        }

        public GasPumpState(GasPumpStatus status)
        {
            this.GasPumpStatus = status;
            this.LastUpdateTime = DateTimeOffset.UtcNow;
        }

        [RequiredToBeUtc(true)]
        [DataMember]
        public DateTimeOffset LastUpdateTime { get; set; }

        [IgnoreDataMember]
        public GasPumpStatus GasPumpStatus { get; set; }

        [DataMember]
        public int GasPumpStatusValue
        {
            get
            {
                return (int)this.GasPumpStatus;
            }

            set
            {
                this.GasPumpStatus = (GasPumpStatus)value;
            }
        }

        [DataMember]
        public decimal SaleVolume { get; set; }

        [DataMember]
        public decimal SaleTotal { get; set; }
    }
}
