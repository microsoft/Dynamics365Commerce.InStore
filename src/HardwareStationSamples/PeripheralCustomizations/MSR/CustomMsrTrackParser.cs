namespace Contoso.Commerce.HardwareStation.Peripherals
{
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using Microsoft.Dynamics.Commerce.HardwareStation.Models;
    using Microsoft.Dynamics.Commerce.HardwareStation.Peripherals.Entities;
    using Microsoft.Dynamics.Commerce.Runtime;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;

    /// <summary>
    /// Handles requests for getting the parsed magnetic card reader swipe information.
    /// </summary>
    public class CustomMsrTrackParser : SingleAsyncRequestHandler<GetParsedMagneticCardSwipeInfoRequest>
    {
        /// <summary>
        /// Gets the parsed magnetic card reader swipe information using a custom regular expression.
        /// </summary>
        /// <param name="request">The request to get the parsed magnetic card swipe information.</param>
        /// <returns>A response containing the parsed magnetic card swipe information.</returns>
        protected override Task<Response> Process(GetParsedMagneticCardSwipeInfoRequest request)
        {
            var swipeInfo = new MagneticCardSwipeInfo();
            swipeInfo.ParseTracks(request.Track1Data, request.Track2Data);

            // Custom track2 regular expression to extract the primary account number.
            Regex track2Regex = new Regex("^;?(?<PrimaryAccountNumber>[0-9]{1,19})<>((?<ExpiryDate>[0-9]{4})|((?<ExpiryDate>)=)).*$");
            var track2Match = track2Regex.Match(request.Track2Data);
            var group = track2Match.Groups["PrimaryAccountNumber"];
            swipeInfo.AccountNumber = group.Value;
            GetParsedMagneticCardSwipeInfoResponse response = new GetParsedMagneticCardSwipeInfoResponse(swipeInfo);

            return Task.FromResult<Response>(response);
        }
    }
}
