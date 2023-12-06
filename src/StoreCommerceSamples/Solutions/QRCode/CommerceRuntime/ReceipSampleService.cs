/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace QRCode.CommerceRuntime
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Dynamics.Commerce.Runtime;
    using Microsoft.Dynamics.Commerce.Runtime.Localization.Services.Messages;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;
    using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

    /// <summary>
    /// The extended service to get custom sales receipt field.
    /// </summary>
    public class GetSalesTransactionCustomReceiptFieldService : IRequestHandlerAsync
    {
        /// <inheritdoc/>
        public IEnumerable<Type> SupportedRequestTypes => new[] { typeof(GetLocalizationCustomReceiptFieldServiceRequest) };

        /// <summary>
        /// Default QR code width.
        /// </summary>
        internal const int DefaultQrCodeWidth = 100;

        /// <summary>
        /// Default QR code height.
        /// </summary>
        internal const int DefaultQrCodeHeight = 100;

        /// <summary>
        /// Executes the requests.
        /// </summary>
        /// <param name="request">The request parameter.</param>
        /// <returns>The GetReceiptServiceResponse that contains the formatted receipts.</returns>
        public async Task<Response> Execute(Request request)
        {
            ThrowIf.Null(request, nameof(request));
            ThrowIf.Null(request.RequestContext, $"{nameof(request)}.{nameof(request.RequestContext)}");

            switch (request)
            {
                case GetLocalizationCustomReceiptFieldServiceRequest receiptRequest:
                    return await GetCustomReceiptFieldForSalesTransactionReceiptsAsync(receiptRequest).ConfigureAwait(false);
                default:
                    throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
            }
        }

        /// <summary>
        /// Gets the custom receipt field value for sales receipt.
        /// </summary>
        /// <param name="request">The service request to get custom receipt field value.</param>
        /// <returns>The value of custom receipt field.</returns>
        private static async Task<Response> GetCustomReceiptFieldForSalesTransactionReceiptsAsync(GetLocalizationCustomReceiptFieldServiceRequest request)
        {
            ThrowIf.Null(request.SalesOrder, $"{nameof(request)},{nameof(request.SalesOrder)}");

            string receiptFieldName = request.CustomReceiptField;
            string receiptFieldValue;

            switch (receiptFieldName)
            {
                case "QRCODESAMPLE":
                    receiptFieldValue = await GetQRCode(request).ConfigureAwait(false);
                    break;
                default:
                    return NotHandledResponse.Instance;
            }

            return new GetCustomReceiptFieldServiceResponse(receiptFieldValue);
        }

        /// <summary>
        /// Gets the QR code for the receipt.
        /// </summary>
        /// <param name="request">The service request to get custom receipt field value.</param>
        /// <returns>QR code custom field value.</returns>
        private static async Task<string> GetQRCode(GetLocalizationCustomReceiptFieldServiceRequest request)
        {
            string receiptFieldValue = string.Empty;

            string qrCodeContent = "https://microsoft.com";

            if (!string.IsNullOrEmpty(qrCodeContent))
            {
                string encodedQrCode = await EncodeQrCode(qrCodeContent, request.RequestContext).ConfigureAwait(false);

                if (!string.IsNullOrEmpty(encodedQrCode))
                {
                    // Wrapping QR Code string with L: tag to indicate that it is a Logo for the peripheral.
                    receiptFieldValue = $"<L:{encodedQrCode}>";
                }
            }

            return receiptFieldValue;
        }

        /// <summary>
        /// Encodes QR code.
        /// </summary>
        /// <param name="qrCodeContent">The QR code content.</param>
        /// <param name="requestContext">The request context.</param>
        /// <returns>The QR code in base64 format.</returns>
        private static async Task<string> EncodeQrCode(string qrCodeContent, RequestContext requestContext)
        {
            EncodeQrCodeServiceRequest qrCodeEncodeRequest = new EncodeQrCodeServiceRequest(qrCodeContent)
            {
                Width = DefaultQrCodeWidth,
                Height = DefaultQrCodeHeight,
            };
            EncodeQrCodeServiceResponse qrCodeEncodeResponse = await requestContext.ExecuteAsync<EncodeQrCodeServiceResponse>(qrCodeEncodeRequest).ConfigureAwait(false);

            return qrCodeEncodeResponse.QRCode;
        }
    }
}