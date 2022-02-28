namespace GasStationSample.CommerceRuntime
{
    using System;
    using System.Collections.Generic;
    using System.Runtime.Serialization;
    using System.Text;

    [DataContract]
    public enum GasPumpStatus
    {
        [EnumMember]
        Unknown,

        [EnumMember]
        Idle,

        [EnumMember]
        Pumping,

        [EnumMember]
        PumpingComplete,

        [EnumMember]
        Stopped,

        [EnumMember]
        Emergency
    }
}
