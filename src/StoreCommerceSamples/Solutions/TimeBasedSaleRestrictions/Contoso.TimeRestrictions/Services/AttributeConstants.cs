
/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.TimeRestrictions.Services
{
    /// <summary>
    /// Defines constant names for time restriction attributes used in product and channel configuration.
    /// </summary>
    public static class AttributeConstants
    {
        /// <summary>
        /// The attribute name for the time cutoff after which sales are restricted, in HH:mm format.
        /// Used with RestrictedBeforeTime to define a time window.
        /// </summary>
        public const string RestrictedAfterTime = "RestrictedAfterTime";

        /// <summary>
        /// The attribute name for the time before which sales are restricted, in HH:mm format.
        /// Used with RestrictedAfterTime to define a time window. If both values are equal, no restriction applies.
        /// </summary>
        public const string RestrictedBeforeTime = "RestrictedBeforeTime";

        /// <summary>
        /// The attribute name for comma-separated day names (e.g., "Mon,Tue,Wed,Thu,Fri,Sat,Sun").
        /// </summary>
        public const string RestrictionDays     = "RestrictionDays";

        /// <summary>
        /// The optional attribute name for a reason code identifier associated with the restriction.
        /// </summary>
        public const string RestrictionReasonId = "RestrictionReasonId";
    }
}
