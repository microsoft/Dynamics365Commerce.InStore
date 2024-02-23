namespace Microsoft.Dynamics
{
    namespace Contoso.HardwareStation.Peripherals
    {
        using System;
        using System.Collections.Generic;
        using System.Text.RegularExpressions;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.HardwareStation;
        using Microsoft.Dynamics.Commerce.HardwareStation.PeripheralRequests.Opos;
        using Microsoft.Dynamics.Commerce.HardwareStation.Peripherals;
        using Microsoft.Dynamics.Commerce.HardwareStation.Peripherals.Entities.Opos;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Handlers;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Retail.Diagnostics;
        using Microsoft.Dynamics.Retail.Diagnostics.Extensions;
        using ThrowIf = Commerce.HardwareStation.ThrowIf;

        /// <summary>
        /// A custom OPOS based printer device handler.
        /// </summary>
        public class CustomOposPrinterDevice : INamedRequestHandlerAsync
        {
            private const string BarcodeRegex = "<B: (.+?)>";
            private const string EscMarker = "&#x1B;";
            private const string EscCharacter = "\x1B";
            private const string ImageTagStart = "<I:";
            private const string ImageTagEnd = ">";
            private const string OPOSMarkersForSplitRegEx = @"(&#x1B;\|1C|&#x1B;\|2C|&#x1B;\|3C|&#x1B;\|4C|\r\n|\|1C)";
            private static string peripheralName = "OposPrinter";
            private static int characterSet = -1;

            private enum Events
            {
                InvalidImage,
                PrintBitmapConfiguration,
                PrintBitmapException,
                PrintBitmapNotSupported,
                CapRecPapercutException,
            }

            /// <summary>
            /// Gets the unique name for this request handler.
            /// </summary>
            public string HandlerName
            {
                get { return PeripheralType.Opos; }
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
                        typeof(ClosePrinterDeviceRequest),
                    };
                }
            }

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
                        peripheralName = openPrinterRequest.DeviceName;
                        return await openPrinterRequest.RequestContext.Runtime.ExecuteNextAsync<Response>(
                            this, openPrinterRequest, openPrinterRequest.RequestContext, true, HandlerName).ConfigureAwait(false);

                    case PrintPrinterDeviceRequest printRequest:
                        if (peripheralName == null)
                        {
                            return await printRequest.RequestContext.Runtime.ExecuteNextAsync<Response>(
                                this, printRequest, printRequest.RequestContext, true, HandlerName).ConfigureAwait(false);
                        }

                        await PrintAsync(printRequest.RequestContext, printRequest.Header, printRequest.Lines, printRequest.Footer).ConfigureAwait(false);
                        break;
                    case ClosePrinterDeviceRequest closePrinterRequest:
                        peripheralName = null;
                        return await closePrinterRequest.RequestContext.Runtime.ExecuteNextAsync<Response>(
                            this, closePrinterRequest, closePrinterRequest.RequestContext, true, HandlerName).ConfigureAwait(false);

                    default:
                        throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
                }

                return NullResponse.Instance;
            }

            /// <summary>
            /// Print the text to the Printer.
            /// </summary>
            /// <param name="context">The OPOS printer.</param>
            /// <param name="textToPrint">The text to print on the receipt.</param>
            private async Task PrintTextAsync(RequestContext context, string textToPrint)
            {
                int resultCode;
                int resultCodeExtended;
                string oposPrinterMethod;
                string[] textToPrintSplit = Regex.Split(textToPrint, BarcodeRegex, RegexOptions.Compiled | RegexOptions.IgnoreCase);

                for (int i = 0; i < textToPrintSplit.Length; i++)
                {
                    // Grab text to print from the split array.
                    string toPrint = textToPrintSplit[i];

                    // Check if printer run out of paper after previous print call.
                    await this.CheckPaperStatusAsync(context).ConfigureAwait(false);

                    // Text is barcode if it doesn't contain any special escape characters found in normal receipt strings for OPS (e.g., '&#x1B;|1C' or '1C').
                    bool isBarcode = !Regex.IsMatch(toPrint, OPOSMarkersForSplitRegEx, RegexOptions.Compiled | RegexOptions.Multiline);

                    // If it is barcode, print it using special OPOS PrintBarCode method.
                    if (isBarcode)
                    {
                        oposPrinterMethod = "PrintBarCode";
                        await ExecuteOposMethodAsync(
                            context,
                            oposPrinterMethod,
                            2 /* PTR_S_RECEIPT */,
                            toPrint,
                            110 /* PTR_BCS_Code128 */,
                            80,
                            80,
                            -2 /* PTR_BC_CENTER */,
                            -13 /* PTR_BC_TEXT_BELOW */).ConfigureAwait(false);

                        resultCode = (int)await GetOposPropertyValueAsync(context, "ResultCode").ConfigureAwait(false);
                        resultCodeExtended = (int)await GetOposPropertyValueAsync(context, "ResultCodeExtended").ConfigureAwait(false);
                    }
                    else
                    {
                        // Print normal text using OPOS PrintNormal method.
                        oposPrinterMethod = "PrintNormal";
                        await this.ExecuteOposMethodAsync(context, oposPrinterMethod, 2 /* PTR_S_RECEIPT */, toPrint).ConfigureAwait(false);
                        resultCode = (int)await GetOposPropertyValueAsync(context, "ResultCode").ConfigureAwait(false);
                        resultCodeExtended = (int)await GetOposPropertyValueAsync(context, "ResultCodeExtended").ConfigureAwait(false);
                        await SetOposPropertyValueAsync(context, "BinaryConversion", 0).ConfigureAwait(false); // OposBcNone
                    }

                    CheckResultCode(oposPrinterMethod, resultCode, resultCodeExtended);
                }
            }

            /// <summary>
            /// Print the data on printer.
            /// </summary>
            /// <param name="header">The header.</param>
            /// <param name="lines">The lines.</param>
            /// <param name="footer">The footer.</param>
            private async Task PrintAsync(RequestContext context, string header, string lines, string footer)
            {
                header = header.Replace(EscMarker, EscCharacter);
                lines = lines.Replace(EscMarker, EscCharacter);
                footer = footer.Replace(EscMarker, EscCharacter);

                var getReceiptPartsRequest = new GetPrinterReceiptPartsRequest(peripheralName, characterSet, header, lines, footer);
                var receiptPartsResponse = await context.Runtime.ExecuteAsync<GetPrinterReceiptPartsResponse>(getReceiptPartsRequest, context: null).ConfigureAwait(false);

                await PrintReceiptParts(context, receiptPartsResponse.ReceiptHeaderParts).ConfigureAwait(false);
                await PrintReceiptParts(context, receiptPartsResponse.ReceiptLinesParts).ConfigureAwait(false);
                await PrintReceiptParts(context, receiptPartsResponse.ReceiptFooterParts).ConfigureAwait(false);

                // Avoid paper cut when noting is printed.
                if (!string.IsNullOrEmpty(header + lines + footer) && await ShouldCutPaperAsync(context).ConfigureAwait(false))
                {
                    // The number of lines that must be advanced before the receipt paper is cut.
                    string extraLinesToBeCut = string.Empty;
                    var linesToPaperCut = (int)await GetOposPropertyValueAsync(context, "RecLinesToPaperCut").ConfigureAwait(false);
                    for (int i = 0; i < linesToPaperCut; ++i)
                    {
                        extraLinesToBeCut += Environment.NewLine;
                    }

                    // Includes the new lines before cutting the paper.
                    await this.PrintTextAsync(context, extraLinesToBeCut).ConfigureAwait(false);

                    // CutPaper() will be blocked if printer is run out of paper, so it's important to check paper status beforehand.
                    await CheckPaperStatusAsync(context).ConfigureAwait(false);

                    // PERCENTAGE VALUE:
                    // 0        No cut
                    // 100      Full cut
                    // 1 - 99   Partial cut (will always leave small amount of paper uncut irrespective of actual value)
                    await ExecuteOposMethodAsync(context, "CutPaper", 95).ConfigureAwait(false);
                }
            }

            /// <summary>
            /// Print the receipt parts.
            /// </summary>
            /// <param name="context">The request context.</param>
            /// <param name="partsToPrint">The receipt parts to print.</param>
            private async Task PrintReceiptParts(RequestContext context, IReadOnlyCollection<ReceiptPart> partsToPrint)
            {
                foreach (var part in partsToPrint)
                {
                    switch (part.Type)
                    {
                        case ReceiptPartType.LegacyLogo:
                        case ReceiptPartType.LogoWithBytes:
                        case ReceiptPartType.Image:
                            var imageText = part.Value;
                            var data = Convert.FromBase64String(imageText.Substring(ImageTagStart.Length, imageText.Length - ImageTagStart.Length - ImageTagEnd.Length));
                            await this.PrintImageAsync(context, data).ConfigureAwait(false);
                            break;
                        case ReceiptPartType.Text:
                            await this.PrintTextAsync(context, part.Value).ConfigureAwait(false);
                            break;
                        default:
                            break;
                    }
                }
            }

            /// <summary>
            /// Method to print the raw bytes of a BMP-formatted image.
            /// </summary>
            /// <param name="context">The OPOS printer.</param>
            /// <param name="image">Image bytes to print.</param>
            private async Task PrintImageAsync(RequestContext context, byte[] image)
            {
                // Check if printer run out of paper after previous print call.
                await this.CheckPaperStatusAsync(context).ConfigureAwait(false);

                if ((bool)await GetOposPropertyValueAsync(context, "CapRecBitmap").ConfigureAwait(false))
                {
                    if (image != null && image.Length > 0)
                    {
                        int conversion = (int)await GetOposPropertyValueAsync(context, "BinaryConversion").ConfigureAwait(false); // Save current conversion mode
                        await SetOposPropertyValueAsync(context, "BinaryConversion", 2).ConfigureAwait(false); // OposBcDecimal

                        int resultCode;
                        try
                        {
                            string imageFilePath = System.IO.Path.Combine(System.IO.Path.GetTempPath(), "logo.bmp");
                            System.IO.File.WriteAllBytes(imageFilePath, image);

                            await ExecuteOposMethodAsync(context,
                                "PrintBitmap",
                                2 /* PTR_S_RECEIPT */,
                                imageFilePath,
                                -11 /* PTR_BM_ASIS */,
                                -2 /* PTR_BC_CENTER */).ConfigureAwait(false);
                            resultCode = (int)await GetOposPropertyValueAsync(context, "ResultCode").ConfigureAwait(false);
                        }
                        catch (Exception ex)
                        {
                            RetailLogger.Log.LogError(Events.PrintBitmapException, "PrintBitmap() failed due to following exception: {ex}", ex.ToString().AsSystemMetadata());
                        }

                        await SetOposPropertyValueAsync(context, "BinaryConversion", conversion).ConfigureAwait(false); // restore previous conversion mode
                        resultCode = (int)await GetOposPropertyValueAsync(context, "ResultCode").ConfigureAwait(false);
                        int resultCodeExtended = (int)await GetOposPropertyValueAsync(context, "ResultCodeExtended").ConfigureAwait(false);
                        CheckResultCode("PrintBitmap", resultCode, resultCodeExtended);
                    }
                    else
                    {
                        RetailLogger.Log.LogWarning(Events.InvalidImage, "Logo image is invalid or null.");
                    }
                }
                else
                {
                    RetailLogger.Log.LogWarning(Events.PrintBitmapNotSupported, "The printer '{printerName}' can't print bitmaps.", peripheralName.AsObjectMetadata());
                }
            }

            /// <summary>
            /// Check the OPOS printer result code.
            /// </summary>
            /// <param name="oposMethod">The OPOS method called.</param>
            /// <param name="resultCode">The result code from OPOS method.</param>
            /// <param name="resultCodeExtended">The extended result code from OPOS method.</param>
            private static void CheckResultCode(string oposMethod, int resultCode, int resultCodeExtended)
            {
                if (string.IsNullOrEmpty(oposMethod))
                {
                    throw new ArgumentException(string.Format("'Argument '{0}' can't be null or empty", nameof(oposMethod)));
                }

                if (resultCode != 0)
                {
                    string message = string.Format(
                        "OPOS printer failed to execute '{0}' with error '{1}', extended error code - {2}",
                        oposMethod, resultCode, resultCodeExtended);
                    throw new PeripheralException(PeripheralException.PrinterError, message);
                }
            }

            /// <summary>
            /// Check the OPOS printer paper status.
            /// </summary>
            /// <param name="context">The OPOS printer.</param>
            private async Task CheckPaperStatusAsync(RequestContext context)
            {
                var emptySensor = (bool)await GetOposPropertyValueAsync(context, "CapRecEmptySensor").ConfigureAwait(false);
                var recEmpty = (bool)await GetOposPropertyValueAsync(context, "RecEmpty").ConfigureAwait(false);
                if (emptySensor && recEmpty)
                {
                    RetailLogger.Log.HardwareStationPrinterOutOfPaper(peripheralName, PeripheralType.Opos);
                    throw new PeripheralException(PeripheralException.PrinterOutOfPaperError);
                }
            }

            /// <summary>
            /// Determines if the printer should cut the receipt paper based on the hardware station configuration and if it is supported on the OPOS printer.
            /// </summary>
            /// <param name="context">The OPOS printer.</param>
            /// <returns>True if the receipt paper should be cut. False otherwise.</returns>
            private async Task<bool> ShouldCutPaperAsync(RequestContext context)
            {
                try
                {
                    return (bool)await GetOposPropertyValueAsync(context, "CapRecPapercut").ConfigureAwait(false);;
                }
                catch (Exception ex)
                {
                    // If there is an exception thrown when checking the RecPapercut property log an error and return false to skip paper cutting.
                    RetailLogger.Log.LogError(Events.CapRecPapercutException, "context.CapRecPapercut failed due to following exception: {ex}", ex.AsSystemMetadata());
                    return false;
                }
            }

            /// <summary>
            /// Executes a method on the given OPOS device.
            /// </summary>
            /// <param name="context">The request context.</param>
            /// <param name="methodName">The name of the method to execute.</param>
            /// <param name="args">The list of arguments to send.</param>
            /// <returns></returns>
            private async Task ExecuteOposMethodAsync(RequestContext context, string methodName, params object[] args)
            {
                var request = new ExecuteOposDeviceMethodRequest(OposDeviceType.Printer, peripheralName, methodName, args);
                await context.Runtime.ExecuteAsync<Response>(request, context: context).ConfigureAwait(false);
            }

            /// <summary>
            /// Gets the value of a property from the given OPOS device.
            /// </summary>
            /// <param name="context">The request context.</param>
            /// <param name="propertyName">The name of the property.</param>
            /// <returns></returns>
            private async Task<object> GetOposPropertyValueAsync(RequestContext context, string propertyName)
            {
                var request = new GetOposDevicePropertyValueRequest(OposDeviceType.Printer, peripheralName, propertyName);
                GetOposDevicePropertyValueResponse response = await context.Runtime.ExecuteAsync<GetOposDevicePropertyValueResponse>(request, context: context).ConfigureAwait(false);
                return response.PropertyValue;
            }

            /// <summary>
            /// Sets the value of a property on the given OPOS device.
            /// </summary>
            /// <param name="context">The request context.</param>
            /// <param name="propertyName">The name of the property.</param>
            /// <param name="value">The value to set on the property.</param>
            /// <returns></returns>
            private async Task SetOposPropertyValueAsync(RequestContext context, string propertyName, object value)
            {
                var request = new SetOposDevicePropertyValueRequest(OposDeviceType.Printer, peripheralName, propertyName, value);
                await context.Runtime.ExecuteAsync<Response>(request, context: context).ConfigureAwait(false);
            }
        }
    }
}