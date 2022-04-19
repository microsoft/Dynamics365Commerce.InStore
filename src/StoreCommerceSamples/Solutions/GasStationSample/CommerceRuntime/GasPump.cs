namespace GasStationSample.CommerceRuntime
{
    using Microsoft.Dynamics.Commerce.Runtime.DataModel;
    using System.Runtime.Serialization;
    using SystemAnnotations = System.ComponentModel.DataAnnotations;

    public class GasPump : CommerceEntity
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GasPump"/> class.
        /// </summary>
        public GasPump()
            : base("GasPump")
        {
        }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        [SystemAnnotations.Key]
        [DataMember]
        public long Id { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        [DataMember]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        [DataMember]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the state.
        /// </summary>
        [DataMember]
        public GasPumpState State { get; set; }
    }
}