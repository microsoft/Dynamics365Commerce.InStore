namespace Microsoft.Dynamics
{
    namespace Contoso.HardwareStation.Peripherals
    {
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.HardwareStation;
        using Microsoft.Dynamics.Commerce.HardwareStation.Peripherals;
        using Microsoft.Dynamics.Commerce.Runtime.Handlers;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Class implements windows based printer driver for hardware station.
        /// </summary>
#pragma warning disable CS0618 // JUSTIFICATION: Pending migration to asynchronous APIs.
        public class CustomWindowsPrinterDevice : INamedRequestHandlerAsync
#pragma warning restore CS0618
        {
            /// <summary>
            /// Gets the unique name for this request handler.
            /// </summary>
            public string HandlerName
            {
                get { return PeripheralType.Windows; }
            }

            /// <summary>
            /// Gets the collection of supported request types by this handler.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(OpenPrinterDeviceRequest),
                        typeof(PrintPrinterDeviceRequest),
                        typeof(ClosePrinterDeviceRequest)
                    };
                }
            }

            /// <summary>
            /// Gets or sets the printer name.
            /// </summary>
            protected string PrinterName { get; set; }

            /// <summary>
            /// Represents the entry point for the printer device request handler.
            /// </summary>
            /// <param name="request">The incoming request message.</param>
            /// <returns>The outgoing response message.</returns>
            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, nameof(request));

                switch (request)
                {
                    case OpenPrinterDeviceRequest openPrinterRequest:
                        this.Open(openPrinterRequest.DeviceName);
                        return await openPrinterRequest.RequestContext.Runtime.ExecuteNextAsync<Response>(
                            this, openPrinterRequest, openPrinterRequest.RequestContext, true, HandlerName).ConfigureAwait(false);
                    
                    case PrintPrinterDeviceRequest printRequest:
                        // If print request is for X- or Z-report then center receipt content
                        if (printRequest.Header.Contains("X-Report") || printRequest.Header.Contains("Z-Report"))
                        {
                            // Receipt content is read only, so create a new request instead of modifing original
                            PrintPrinterDeviceRequest customRequest = new PrintPrinterDeviceRequest(
                                CenterReceiptContent(printRequest.Header),
                                CenterReceiptContent(printRequest.Lines),
                                CenterReceiptContent(printRequest.Footer));
                            customRequest.RequestContext = printRequest.RequestContext;

                            printRequest = customRequest;
                        }

                        return await printRequest.RequestContext.Runtime.ExecuteNextAsync<Response>(
                            this, printRequest, printRequest.RequestContext, true, HandlerName).ConfigureAwait(false);
                    
                    case ClosePrinterDeviceRequest closePrinterRequest:
                        this.Close();
                        return await closePrinterRequest.RequestContext.Runtime.ExecuteNextAsync<Response>(
                            this, closePrinterRequest, closePrinterRequest.RequestContext, true, HandlerName).ConfigureAwait(false);
                    
                    default:
                        throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
                }
            }

            /// <summary>
            /// Centers receipt content on a standard size sheet of paper
            /// </summary>
            /// <param name="input">Left justified receipt content</param>
            /// <returns>Centered receipt content</returns>
            private string CenterReceiptContent(string input)
            {
                string newLine = "\r\n";
                string[] seperator = { newLine };
                string output = string.Empty;

                // Split receipt content on new line seperator and loop through each line
                string[] lines = input.Split(seperator, StringSplitOptions.None);
                foreach (string line in lines)
                {
                    // Pad right to total width 55 (longest line in z-report) to keep content left justified
                    //   then pad left to total width 98 to center on standard sheet of paper.
                    string paddedLine = line.PadRight(55);
                    output += paddedLine.PadLeft(98) + newLine;
                }

                // Prevent printer from adding extra blank line between receipt segments by removing trailing new line character
                return output.Remove(output.Length - newLine.Length);
            }

            /// <summary>
            /// Opens a peripheral.
            /// </summary>
            /// <param name="peripheralName">Name of the peripheral.</param>
            private void Open(string peripheralName)
            {
                this.PrinterName = peripheralName;
            }

            /// <summary>
            /// Closes a peripheral.
            /// </summary>
            private void Close()
            {
                this.PrinterName = null;
            }
        }
    }
}
