/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso
{
    namespace Commerce.HardwareStation
    {
        using System.Runtime.Serialization;

        /// <summary>
        /// Print PDF request class.
        /// </summary>
        [DataContract]
        public class PrintFileRequest
        {
            /// <summary>
            /// Gets or sets the encoded binary file.
            /// </summary>
            [DataMember]
            public string[] Lines { get; private set; }

            /// <summary>
            /// Gets or sets the device name.
            /// </summary>
            [DataMember]
            public string FileName { get; set; }
        }
    }
}