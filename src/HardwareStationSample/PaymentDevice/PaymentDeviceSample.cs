/*
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
*/

/*
 IMPORTANT!!!
 THIS IS SAMPLE CODE ONLY.
 THE CODE SHOULD BE UPDATED TO WORK WITH THE APPROPRIATE PAYMENT PROVIDERS.
 PROPER MEASURES SHOULD BE TAKEN TO ENSURE THAT THE PA-DSS AND PCI DSS REQUIREMENTS ARE MET.
*/

namespace Contoso.Commerce.HardwareStation.PaymentSample
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Dynamics.Commerce.HardwareStation;
    using Microsoft.Dynamics.Commerce.HardwareStation.CardPayment;
    using Microsoft.Dynamics.Commerce.HardwareStation.PeripheralRequests;
    using Microsoft.Dynamics.Commerce.HardwareStation.Peripherals;
    using Microsoft.Dynamics.Commerce.HardwareStation.Peripherals.Entities;
    using PaySdk = Microsoft.Dynamics.Retail.PaymentSDK.Portable;
    using Microsoft.Dynamics.Commerce.Runtime.Handlers;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;
    using Microsoft.Dynamics.Commerce.Runtime.DataModel;

    /// <summary>
    /// A sample class that handles all messages that a Payment Device is responsible for.
    /// </summary>
    /// <remarks>
    /// This class intentionally implements a no-op Payment device handler as a way to demonstrate the capabilities that this handler provides
    /// and also the information that it requires to work with the hardware station infrastructure.
    /// The functionalities supported by this handler are the following:
    /// - Device management:
    ///   LockPaymentTerminalDeviceRequest, ReleasePaymentTerminalDeviceRequest, OpenPaymentTerminalDeviceRequest,
    ///   ClosePaymentTerminalDeviceRequest, BeginTransactionPaymentTerminalDeviceRequest, EndTransactionPaymentTerminalDeviceRequest,
    ///   CancelOperationPaymentTerminalDeviceRequestCancel Operation and UpdateLineItemsPaymentTerminalDeviceRequest
    /// - Payment operations:
    ///   AuthorizePaymentTerminalDeviceRequest, CapturePaymentTerminalDeviceRequest, VoidPaymentTerminalDeviceRequest, RefundPaymentTerminalDeviceRequest
    /// - Gift operations:
    ///   GetGiftCardBalancePaymentTerminalRequest, AddBalanceToGiftCardPaymentTerminalRequest, ActivateGiftCardPaymentTerminalRequest
    /// - Duplicated Payment Protection:
    ///   GetTransactionReferencePaymentTerminalDeviceRequest, GetTransactionByTransactionReferencePaymentTerminalDeviceRequest
    /// - Misc operations:
    ///   GetPrivateTenderPaymentTerminalDeviceRequest, ExecuteTaskPaymentTerminalDeviceRequest, FetchTokenPaymentTerminalDeviceRequest
    /// In the case of unsupported operations by the Payment Device, the request must still be supported, but an exception should be thrown.
    /// A real implementation should replace all mock and hard-coded information with properties retrieved from the actual device.
    /// </remarks>
    public class PaymentDeviceSample : INamedRequestHandler, IDisposable
    {
        private PaySdk.PaymentProperty[] merchantProperties;      
        private string paymentConnectorName;
        private SettingsInfo terminalSettings;
        private CancellationTokenSource timeoutTask;

        /// <summary>
        /// Gets the collection of supported request types by this handler.
        /// </summary>
        public IEnumerable<Type> SupportedRequestTypes
        {
            get
            {
                return new[]
                {
                    typeof(LockPaymentTerminalDeviceRequest),
                    typeof(ReleasePaymentTerminalDeviceRequest),
                    typeof(OpenPaymentTerminalDeviceRequest),
                    typeof(ClosePaymentTerminalDeviceRequest),
                    typeof(BeginTransactionPaymentTerminalDeviceRequest),
                    typeof(EndTransactionPaymentTerminalDeviceRequest),
                    typeof(CancelOperationPaymentTerminalDeviceRequest),
                    typeof(UpdateLineItemsPaymentTerminalDeviceRequest),
                    typeof(AuthorizePaymentTerminalDeviceRequest),
                    typeof(CapturePaymentTerminalDeviceRequest),
                    typeof(VoidPaymentTerminalDeviceRequest),
                    typeof(RefundPaymentTerminalDeviceRequest),
                    typeof(GetPrivateTenderPaymentTerminalDeviceRequest),
                    typeof(ExecuteTaskPaymentTerminalDeviceRequest),
                    typeof(FetchTokenPaymentTerminalDeviceRequest),
                    typeof(ActivateGiftCardPaymentTerminalRequest),
                    typeof(AddBalanceToGiftCardPaymentTerminalRequest),
                    typeof(GetGiftCardBalancePaymentTerminalRequest),
                    typeof(GetTransactionReferencePaymentTerminalDeviceRequest),
                    typeof(GetTransactionByTransactionReferencePaymentTerminalDeviceRequest)
                };
            }
        }

        /// <summary>
        /// Gets the unique name for this request handler.
        /// </summary>
        public string HandlerName => "SAMPLEDEVICE";

        /// <summary>
        /// Represents the entry point of the request handler.
        /// </summary>
        /// <param name="request">The incoming request message.</param>
        /// <returns>The outgoing response message.</returns>
        public Response Execute(Request request)
        {
             ThrowIf.Null(request, nameof(request));

            switch (request)
            {
                case OpenPaymentTerminalDeviceRequest openPaymentTerminalDeviceRequest:
                    return this.Open(openPaymentTerminalDeviceRequest);

                case ClosePaymentTerminalDeviceRequest closePaymentTerminalDeviceRequest:
                    return this.Close();

                case BeginTransactionPaymentTerminalDeviceRequest beginTransactionPaymentTerminalDeviceRequest:
                    return this.BeginTransaction(beginTransactionPaymentTerminalDeviceRequest);

                case EndTransactionPaymentTerminalDeviceRequest endTransactionPaymentTerminalDeviceRequest:
                    return this.EndTransaction();

                case CancelOperationPaymentTerminalDeviceRequest cancelOperationPaymentTerminalDeviceRequest:
                    return this.CancelOperation();

                case UpdateLineItemsPaymentTerminalDeviceRequest updateLineItemsPaymentTerminalDeviceRequest:
                    return this.UpdateLineItems(updateLineItemsPaymentTerminalDeviceRequest);

                case AuthorizePaymentTerminalDeviceRequest authorizePaymentTerminalDeviceRequest:
                    return this.AuthorizePayment(authorizePaymentTerminalDeviceRequest);

                case CapturePaymentTerminalDeviceRequest capturePaymentTerminalDeviceRequest:
                    return this.CapturePayment(capturePaymentTerminalDeviceRequest);

                case VoidPaymentTerminalDeviceRequest voidPaymentTerminalDeviceRequest:
                    return this.VoidPayment(voidPaymentTerminalDeviceRequest);

                case RefundPaymentTerminalDeviceRequest refundPaymentTerminalDeviceRequest:
                    return this.RefundPayment(refundPaymentTerminalDeviceRequest);

                case GetPrivateTenderPaymentTerminalDeviceRequest getPrivateTenderPaymentTerminalDeviceRequest:
                    return this.GetPrivateTender(getPrivateTenderPaymentTerminalDeviceRequest);

                case ExecuteTaskPaymentTerminalDeviceRequest executeTaskPaymentTerminalDeviceRequest:
                    return this.ExecuteTask(executeTaskPaymentTerminalDeviceRequest);

                case FetchTokenPaymentTerminalDeviceRequest fetchTokenPaymentTerminalDeviceRequest:
                    return this.FetchToken(fetchTokenPaymentTerminalDeviceRequest);

                case ActivateGiftCardPaymentTerminalRequest activateGiftCardPaymentTerminalRequest:
                    return this.ActivateGiftCard(activateGiftCardPaymentTerminalRequest);

                case AddBalanceToGiftCardPaymentTerminalRequest addBalanceToGiftCardPaymentTerminalRequest:
                    return this.AddBalanceToGiftCard(addBalanceToGiftCardPaymentTerminalRequest);

                case GetGiftCardBalancePaymentTerminalRequest getGiftCardBalancePaymentTerminalRequest:
                    return this.GetGiftCardBalance(getGiftCardBalancePaymentTerminalRequest);

                case GetTransactionReferencePaymentTerminalDeviceRequest getTransactionReferencePaymentTerminalDeviceRequest:
                    return this.GetTransactionReferenceId(getTransactionReferencePaymentTerminalDeviceRequest);

                case GetTransactionByTransactionReferencePaymentTerminalDeviceRequest getTransactionByTransactionReferencePaymentTerminalDeviceRequest:
                    return this.GetTransactionByTransactionReference(getTransactionByTransactionReferencePaymentTerminalDeviceRequest);

                default:
                    throw new NotSupportedException($"Request '{request.GetType().FullName}' is not supported.");
            }
        }

        /// <summary>
        /// The dispose implementation.
        /// </summary>
        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Dispose the Native and Managed resources.
        /// </summary>
        /// <param name="disposeAll">Whether to dispose both Native and Managed resources.</param>
        protected virtual void Dispose(bool disposeAll)
        {
        }

        /// <summary>
        /// Initialize settings.
        /// </summary>
        /// <param name="paymentConnectorName">The payment connector name.</param>
        /// <param name="merchantPaymentPropertiesXml">The merchant properties.</param>
        /// <param name="terminalSettings">The terminal settings.</param>
        private void InitializeSettings(string paymentConnectorName, string merchantPaymentPropertiesXml, SettingsInfo terminalSettings)
        {
            this.terminalSettings = terminalSettings;
            this.paymentConnectorName = paymentConnectorName;

            // Convert the connector properties to local
            this.merchantProperties = !string.IsNullOrWhiteSpace(merchantPaymentPropertiesXml)
                ? PaySdk.PaymentProperty.ConvertXMLToPropertyArray(merchantPaymentPropertiesXml)
                : null;
        }

        /// <summary>
        /// Resets the card payment info.
        /// </summary>
        private void ResetCardPaymentInfo()
        {
            this.merchantProperties = null;
            this.paymentConnectorName = null;
            this.terminalSettings = null;
            this.timeoutTask = null;
        }

        /// <summary>
        /// Gets an array of payment properties using an initial list.
        /// </summary>
        /// <param name="paymentConnectorName">The payment connector name to use.</param>
        /// <param name="initialPropertyList">The initial list of properties to add to the array.</param>
        /// <returns></returns>
        private static PaySdk.PaymentProperty[] GetPaymentPropertiesWithInitialList(string paymentConnectorName, PaySdk.PaymentProperty[] initialPropertyList)
        {
            // Several below values are hardcoded, real implementations should take this data from real device.
            List<PaySdk.PaymentProperty> properties = new List<PaySdk.PaymentProperty>(initialPropertyList);
            properties.AddRange(GetPaymentProperties(paymentConnectorName));

            return properties.ToArray();
        }

        /// <summary>
        /// Gets an array of payment properties.
        /// </summary>
        /// <param name="paymentConnectorName">The payment connector name to use.</param>
        /// <returns></returns>
        private static PaySdk.PaymentProperty[] GetPaymentProperties(string paymentConnectorName)
        {
            // Several below values are hardcoded, real implementations should take this data from real device.
            PaySdk.PaymentProperty assemblyNameProperty = new PaySdk.PaymentProperty();
            assemblyNameProperty.Namespace = PaySdk.Constants.GenericNamespace.MerchantAccount;
            assemblyNameProperty.Name = PaySdk.Constants.MerchantAccountProperties.AssemblyName;
            assemblyNameProperty.ValueType = PaySdk.DataType.String;
            assemblyNameProperty.StoredStringValue = typeof(PaymentDeviceSample).Assembly.GetName().Name;

            PaySdk.PaymentProperty connectorNameProperty = new PaySdk.PaymentProperty();
            connectorNameProperty.Namespace = PaySdk.Constants.GenericNamespace.Connector;
            connectorNameProperty.Name = PaySdk.Constants.ConnectorProperties.ConnectorName;
            connectorNameProperty.StoredStringValue = paymentConnectorName;

            PaySdk.PaymentProperty[] properties = new PaySdk.PaymentProperty[] { assemblyNameProperty, connectorNameProperty };

            return properties;
        }

        /// <summary>
        /// Creates a mocked success authorization payment info with the approved amount.
        /// </summary>
        /// <param name="amount">The approved amount to add to the authorization.</param>
        /// <returns>The mocked payment info.</returns>
        private PaymentInfo CreateAuthorizationSuccessPaymentInfo(decimal amount)
        {
            // Several below values are hardcoded, real implementations should take this data from real device.
            PaySdk.PaymentProperty[] properties = GetPaymentProperties(this.paymentConnectorName);
            var paymentInfo = new PaymentInfo()
            {
                CardNumberMasked = "411111******1111",
                CardType = Microsoft.Dynamics.Commerce.HardwareStation.CardPayment.CardType.InternationalCreditCard,
                SignatureData = "AAgEAAQALP4hvpJrK/UfKvlX7ABkIfJFnxoZbaXC2vmnzYB8ItM1rBYwzRrw0IdLF3Qv89lwBfgGn5gBwKkFSoguAft6w8ZAJATwSYNMGJTlqmorxYYyN2BZvtGmroCuKygDAJoBkAyDAr46bUZ4kOFG7P9GmjcA",
                PaymentSdkData = PaySdk.PaymentProperty.ConvertPropertyArrayToXML(properties),
                CashbackAmount = 0.0m,
                ApprovedAmount = amount,
                IsApproved = true,
                Errors = null
            };
            return paymentInfo;
        }

        /// <summary>
        /// Construct the Payment Device class and open the connection from it.
        /// </summary>
        /// <returns>The response.</returns>
        /// <param name="request">Open payment terminal device request.</param>
        private NullResponse Open(OpenPaymentTerminalDeviceRequest request)
        {
            ThrowIf.Null(request, nameof(request));

            // Open the device for payments
            Utilities.WaitAsyncTask(() => Task.Run(async () =>
            {
                await this.OpenAsync(request.DeviceName, request.TerminalSettings, request.DeviceConfig).ConfigureAwait(false);
            }));

            return NullResponse.Instance;
        }

        /// <summary>
        /// Close the connection to the payment terminal.
        /// </summary>
        /// <returns>The response.</returns>
        private NullResponse Close()
        {
            // Close the device for payments
            Utilities.WaitAsyncTask(() => Task.Run(async () =>
            {
                await this.CloseAsync().ConfigureAwait(false);
            }));

            return NullResponse.Instance;
        }

        /// <summary>
        ///  Begins the transaction.
        /// </summary>
        /// <param name="request">The begin transaction request.</param>
        /// <returns>The response.</returns>
        private NullResponse BeginTransaction(BeginTransactionPaymentTerminalDeviceRequest request)
        {
            ThrowIf.Null(request, nameof(request));
            Utilities.WaitAsyncTask(() => Task.Run(async () =>
            {
                await this.BeginTransactionAsync(request.PaymentConnectorName, request.MerchantInformation).ConfigureAwait(false);
            }));

            return NullResponse.Instance;
        }

        /// <summary>
        /// Ends the transaction.
        /// </summary>
        /// <returns>The response.</returns>
        private NullResponse EndTransaction()
        {
            Utilities.WaitAsyncTask(() => this.EndTransactionAsync());

            if (this.timeoutTask != null)
            {
                this.timeoutTask.Cancel();
            }

            this.ResetCardPaymentInfo();

            return NullResponse.Instance;
        }

        /// <summary>
        /// Cancel current operation on payment terminal.
        /// </summary>
        /// <returns>The response.</returns>
        private NullResponse CancelOperation()
        {
            // Cancel current operation on payment terminal
            Utilities.WaitAsyncTask(() => Task.Run(async () =>
            {
                await this.CancelOperationAsync().ConfigureAwait(false);
            }));

            return NullResponse.Instance;
        }

        /// <summary>
        /// Update the line items.
        /// </summary>
        /// <param name="request">The update line items request.</param>
        /// <returns>The response.</returns>
        private NullResponse UpdateLineItems(UpdateLineItemsPaymentTerminalDeviceRequest request)
        {
            ThrowIf.Null(request, nameof(request));

            Utilities.WaitAsyncTask(() => this.UpdateLineItemsAsync(request));

            return NullResponse.Instance;
        }

        /// <summary>
        /// Authorize payment.
        /// </summary>
        /// <param name="request">The authorize payment request.</param>
        /// <returns>The authorize payment response.</returns>
        private AuthorizePaymentTerminalDeviceResponse AuthorizePayment(AuthorizePaymentTerminalDeviceRequest request)
        {
            ThrowIf.Null(request, nameof(request));

            PaymentInfo paymentInfo = Utilities.WaitAsyncTask(() => this.AuthorizePaymentAsync(request.PaymentConnectorName, request.Amount, request.Currency, request.TenderInfo, request.ExtensionTransactionProperties));

            return new AuthorizePaymentTerminalDeviceResponse(paymentInfo);
        }

        /// <summary>
        /// Capture payment.
        /// </summary>
        /// <param name="request">The capture payment request.</param>
        /// <returns>The capture payment response.</returns>
        private CapturePaymentTerminalDeviceResponse CapturePayment(CapturePaymentTerminalDeviceRequest request)
        {
            ThrowIf.Null(request, nameof(request));
            PaymentInfo paymentInfo = Utilities.WaitAsyncTask(() => this.CapturePaymentAsync(request.Amount, request.Currency, request.PaymentPropertiesXml, request.ExtensionTransactionProperties));

            return new CapturePaymentTerminalDeviceResponse(paymentInfo);
        }

        /// <summary>
        /// Void payment.
        /// </summary>
        /// <param name="request">The void payment request.</param>
        /// <returns>The void payment response.</returns>
        private VoidPaymentTerminalDeviceResponse VoidPayment(VoidPaymentTerminalDeviceRequest request)
        {
            ThrowIf.Null(request, nameof(request));
            PaymentInfo paymentInfo = Utilities.WaitAsyncTask(() => this.VoidPaymentAsync(request.PaymentConnectorName, request.Amount, request.Currency, request.TenderInfo, request.PaymentPropertiesXml, request.ExtensionTransactionProperties));

            return new VoidPaymentTerminalDeviceResponse(paymentInfo);
        }

        /// <summary>
        /// Make refund payment.
        /// </summary>
        /// <param name="request">Request for refund.</param>
        /// <returns>A task that can await until the refund has completed.</returns>
        private RefundPaymentTerminalDeviceResponse RefundPayment(RefundPaymentTerminalDeviceRequest request)
        {
            ThrowIf.Null(request, nameof(request));

            PaymentInfo paymentInfo = Utilities.WaitAsyncTask(() => this.RefundPaymentAsync(request.Amount, request.Currency, request.IsManualEntry, request.ExtensionTransactionProperties));

            return new RefundPaymentTerminalDeviceResponse(paymentInfo);
        }

        /// <summary>
        /// Executes Task.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns>The response.</returns>
        private ExecuteTaskPaymentTerminalDeviceResponse ExecuteTask(ExecuteTaskPaymentTerminalDeviceRequest request)
        {
            ThrowIf.Null(request, nameof(request));

            List<CommerceProperty> commerceProperties = new List<CommerceProperty>();

            ExtensionTransaction transaction;

            // Add/substitute 'case' matching your task and put there the business logic you need for your specific task.
            switch (request.Task)
            {
                case "Echo":
                    // 1. Copying original properties into the response.
                    commerceProperties.AddRange(request.ExtensionTransactionProperties.ExtensionProperties);

                    // 2. Adding some new properties
                    commerceProperties.AddRange(new CommerceProperty[]
                    {
                        new CommerceProperty("Key" + Guid.NewGuid(), "Value1"),
                        new CommerceProperty("Key" + Guid.NewGuid(), "Value2")
                    });

                    transaction = new ExtensionTransaction
                    {
                        EntityName = request.ExtensionTransactionProperties.EntityName,
                        ExtensionProperties = commerceProperties
                    };
                    break;
                default:
                    throw new NotSupportedException($"The task{request.Task} is not supported");
            }

            return new ExecuteTaskPaymentTerminalDeviceResponse(transaction);
        }

        /// <summary>
        /// Gets the private tender.
        /// </summary>
        /// <param name="request">The get private tender request.</param>
        /// <returns>Returns the private tender response.</returns>
        private GetPrivateTenderPaymentTerminalDeviceResponse GetPrivateTender(GetPrivateTenderPaymentTerminalDeviceRequest request)
        {
            ThrowIf.Null(request, nameof(request));

            TenderInfo tenderInfo = Utilities.WaitAsyncTask(() => this.GetPrivateTenderAsync(request.Amount, request.Declined, request.IsSwipe));

            return new GetPrivateTenderPaymentTerminalDeviceResponse(tenderInfo);
        }

        /// <summary>
        /// Fetch token.
        /// </summary>
        /// <param name="request">The fetch token request.</param>
        /// <returns>The fetch token response.</returns>
        private FetchTokenPaymentTerminalDeviceResponse FetchToken(FetchTokenPaymentTerminalDeviceRequest request)
        {
            ThrowIf.Null(request, nameof(request));

            PaymentInfo paymentInfo = Utilities.WaitAsyncTask(() => this.FetchTokenAsync(request.IsManualEntry, request.ExtensionTransactionProperties));

            return new FetchTokenPaymentTerminalDeviceResponse(paymentInfo);
        }

        /// <summary>
        /// Activate gift card.
        /// </summary>
        /// <param name="request">The activate gift card payment request.</param>
        /// <returns>The gift card payment response.</returns>
        private GiftCardPaymentResponse ActivateGiftCard(ActivateGiftCardPaymentTerminalRequest request)
        {
            ThrowIf.Null(request, nameof(request));

            PaymentInfo paymentInfo = Utilities.WaitAsyncTask(() => this.ActivateGiftCardAsync(request.PaymentConnectorName, request.Amount, request.Currency, request.TenderInfo, request.ExtensionTransactionProperties));

            return new GiftCardPaymentResponse(paymentInfo);
        }

        /// <summary>
        /// Add balance to gift card.
        /// </summary>
        /// <param name="request">The add balance to gift card payment request.</param>
        /// <returns>The add balance to gift card payment response.</returns>
        private GiftCardPaymentResponse AddBalanceToGiftCard(AddBalanceToGiftCardPaymentTerminalRequest request)
        {
            ThrowIf.Null(request, nameof(request));

            PaymentInfo paymentInfo = Utilities.WaitAsyncTask(() => this.AddBalanceToGiftCardAsync(request.PaymentConnectorName, request.Amount, request.Currency, request.TenderInfo, request.ExtensionTransactionProperties));

            return new GiftCardPaymentResponse(paymentInfo);
        }

        /// <summary>
        /// Get gift card balance.
        /// </summary>
        /// <param name="request">The get gift card balance payment request.</param>
        /// <returns>The get gift card balance payment response.</returns>
        private GiftCardPaymentResponse GetGiftCardBalance(GetGiftCardBalancePaymentTerminalRequest request)
        {
            ThrowIf.Null(request, nameof(request));

            PaymentInfo paymentInfo = Utilities.WaitAsyncTask(() => this.GetGiftCardBalanceAsync(request.PaymentConnectorName, request.Currency, request.TenderInfo, request.ExtensionTransactionProperties));

            return new GiftCardPaymentResponse(paymentInfo);
        }

        /// <summary>
        /// Gets Transaction Reference ID.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns>The response.</returns>
        private GetTransactionReferencePaymentTerminalDeviceResponse GetTransactionReferenceId(GetTransactionReferencePaymentTerminalDeviceRequest request)
        {
            ThrowIf.Null(request, nameof(request));

            string id = $"{request.PosTerminalId}_{request.EftTerminalId}_{Guid.NewGuid()}";
            return new GetTransactionReferencePaymentTerminalDeviceResponse(id);
        }

        /// <summary>
        /// Gets payment transaction by the Transaction Reference ID.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns>The response.</returns>
        private GetTransactionByTransactionReferencePaymentTerminalDeviceResponse GetTransactionByTransactionReference(GetTransactionByTransactionReferencePaymentTerminalDeviceRequest request)
        {
            ThrowIf.Null(request, nameof(request));

            return new GetTransactionByTransactionReferencePaymentTerminalDeviceResponse(CreateAuthorizationSuccessPaymentInfo(5));
        }

        /// <summary>
        /// Construct the Payment Device class and open the connection from it.
        /// </summary>
        /// <param name="peripheralName">Name of peripheral device.</param>
        /// <param name="terminalSettings">The terminal settings for the peripheral device.</param>
        /// <param name="deviceConfig">Device Configuration parameters.</param>
        /// <returns>A task that can be awaited until the connection is opened.</returns>
        [SuppressMessage("Microsoft.Usage", "CA1801", Justification = "Suppressed on adding CA for backward compatibility")]
        private async Task OpenAsync(string peripheralName, SettingsInfo terminalSettings, PeripheralConfiguration deviceConfig)
        {
            // Open the device for payments
            await Task.Delay(500).ConfigureAwait(false);
        }

        /// <summary>
        /// Close the connection to the payment terminal.
        /// </summary>
        /// <returns>A task that can be awaited until the connection is closed.</returns>
        private async Task CloseAsync()
        {
            // Close the device for payments
            await Task.Delay(500).ConfigureAwait(false);
        }

        /// <summary>
        ///  Begins the transaction.
        /// </summary>
        /// <param name="paymentConnectorName">The payment connector name for payment.</param>
        /// <param name="merchantPaymentPropertiesXml">The merchant provider payment properties.</param>
        /// <returns>A task that can be awaited until the operation is completed.</returns>
        private async Task BeginTransactionAsync(string paymentConnectorName, string merchantPaymentPropertiesXml)
        {
            await Task.Run(() => this.InitializeSettings(paymentConnectorName, merchantPaymentPropertiesXml, this.terminalSettings)).ConfigureAwait(false);
        }

        /// <summary>
        ///  Ends the transaction.
        /// </summary>
        /// <returns>A task that can be awaited until the operation has completed.</returns>
        private async Task EndTransactionAsync()
        {
            // Close the device for payments
            await Task.Delay(500).ConfigureAwait(false);
        }

        /// <summary>
        /// Cancel current operation on payment terminal.
        /// </summary>
        /// <returns>A task that can be awaited until the cancel operation has completed.</returns>
        private async Task CancelOperationAsync()
        {
            // Cancel current operation on the payment device
            await Task.Delay(500).ConfigureAwait(false);
        }

        /// <summary>
        /// Update the line items on the current open session.  This method will compare against previous lines specified and make the appropriate device calls.
        /// </summary>
        /// <param name="request">The update line items request.</param>
        /// <returns>A task that can be awaited until the text is displayed on the screen.</returns>
        [SuppressMessage("Microsoft.Usage", "CA1801", Justification = "Suppressed on adding CA for backward compatibility")]
        private async Task UpdateLineItemsAsync(UpdateLineItemsPaymentTerminalDeviceRequest request)
        {
            // Display item to the payment terminal
            await Task.Delay(500).ConfigureAwait(false);
        }

        /// <summary>
        /// Authorize payment.
        /// </summary>
        /// <param name="paymentConnectorName">The payment connector name.</param>
        /// <param name="amount">The amount.</param>
        /// <param name="currency">The currency.</param>
        /// <param name="tenderInfo">Tender information.</param>
        /// <param name="extensionTransactionProperties">Optional extension transaction properties.</param>
        /// <returns>A task that can await until the authorization has completed.</returns>
        [SuppressMessage("Microsoft.Usage", "CA1801", Justification = "Suppressed on adding CA for backward compatibility")]
        private async Task<PaymentInfo> AuthorizePaymentAsync(string paymentConnectorName, decimal amount, string currency, TenderInfo tenderInfo, ExtensionTransaction extensionTransactionProperties)
        {
            // Several below values are hardcoded, real implementations should take this data from real device.
            var paymentInfo = CreateAuthorizationSuccessPaymentInfo(amount);

            return await Task.FromResult(paymentInfo).ConfigureAwait(false);
        }

        /// <summary>
        /// Make settlement of a payment.
        /// </summary>
        /// <param name="amount">The amount.</param>
        /// <param name="currency">The currency.</param>
        /// <param name="paymentPropertiesXml">The payment properties of the authorization response.</param>
        /// <param name="extensionTransactionProperties">Optional extension transaction properties.</param>
        /// <returns>A task that can await until the settlement has completed.</returns>
        [SuppressMessage("Microsoft.Usage", "CA1801", Justification = "Suppressed on adding CA for backward compatibility")]
        private async Task<PaymentInfo> CapturePaymentAsync(decimal amount, string currency, string paymentPropertiesXml, ExtensionTransaction extensionTransactionProperties)
        {
            ThrowIf.Null(this.merchantProperties, nameof(this.merchantProperties));

            PaySdk.PaymentProperty[] properties = GetPaymentPropertiesWithInitialList(this.paymentConnectorName, this.merchantProperties);

            // Several below values are hardcoded, real implementations should take this data from real device.
            return await Task.FromResult(new PaymentInfo()
            {
                CardNumberMasked = string.Empty,
                CardType = Microsoft.Dynamics.Commerce.HardwareStation.CardPayment.CardType.Unknown,
                SignatureData = string.Empty,
                PaymentSdkData = PaySdk.PaymentProperty.ConvertPropertyArrayToXML(properties),
                CashbackAmount = 0.0m,
                ApprovedAmount = amount,
                IsApproved = true,
                Errors = null
            }).ConfigureAwait(false);
        }

        /// <summary>
        /// Make reversal/void a payment.
        /// </summary>
        /// <param name="paymentConnectorName">The payment connector name.</param>
        /// <param name="amount">The amount.</param>
        /// <param name="currency">The currency.</param>
        /// <param name="tenderInfo">The tender information.</param>
        /// <param name="paymentPropertiesXml">The payment properties of the authorization response.</param>
        /// <param name="extensionTransactionProperties">Optional extension transaction properties.</param>
        /// <returns>A task that can await until the void has completed.</returns>
        [SuppressMessage("Microsoft.Usage", "CA1801", Justification = "Suppressed on adding CA for backward compatibility")]
        private async Task<PaymentInfo> VoidPaymentAsync(string paymentConnectorName, decimal amount, string currency, TenderInfo tenderInfo, string paymentPropertiesXml, ExtensionTransaction extensionTransactionProperties)
        {
            ThrowIf.Null(this.merchantProperties, nameof(this.merchantProperties));

            PaySdk.PaymentProperty[] properties = GetPaymentPropertiesWithInitialList(paymentConnectorName, this.merchantProperties);

            // Several below values are hardcoded, real implementations should take this data from real device.
            return await Task.FromResult(new PaymentInfo()
            {
                CardNumberMasked = string.Empty,
                CardType = Microsoft.Dynamics.Commerce.HardwareStation.CardPayment.CardType.Unknown,
                SignatureData = string.Empty,
                PaymentSdkData = PaySdk.PaymentProperty.ConvertPropertyArrayToXML(properties),
                CashbackAmount = 0.0m,
                ApprovedAmount = amount,
                IsApproved = false,
                Errors = null
            }).ConfigureAwait(false);
        }

        /// <summary>
        /// Make refund payment.
        /// </summary>
        /// <param name="amount">The amount.</param>
        /// <param name="currency">The currency.</param>
        /// <param name="isManualEntry">If manual credit card entry is required.</param>
        /// <param name="extensionTransactionProperties">Optional extension transaction properties.</param>
        /// <returns>A task that can await until the refund has completed.</returns>
        [SuppressMessage("Microsoft.Usage", "CA1801", Justification = "Suppressed on adding CA for backward compatibility")]
        private async Task<PaymentInfo> RefundPaymentAsync(decimal amount, string currency, bool isManualEntry, ExtensionTransaction extensionTransactionProperties)
        {
            return await Task.FromResult(CreateAuthorizationSuccessPaymentInfo(amount)).ConfigureAwait(false);
        }

        /// <summary>
        /// Get private tender async.
        /// </summary>
        /// <param name="amount">The amount field.</param>
        /// <param name="declined">Specify the boolean flag whether previous card is declined.</param>
        /// <param name="isSwipe">Specify the boolean flag whether it is swipe / manual.</param>
        /// <returns>Returns the tender information.</returns>
        [SuppressMessage("Microsoft.Usage", "CA1801", Justification = "Suppressed on adding CA for backward compatibility")]
        private async Task<TenderInfo> GetPrivateTenderAsync(decimal amount, bool declined, bool isSwipe)
        {
            // Several below values are hardcoded, real implementations should take this data from real device.
            return await Task.FromResult(new TenderInfo()
            {
                CardNumber = "9123456",
                Track2 = "%B9123456^FDCSGift/Gift^10110001111A123456789012?;9123456=1011000001234567?",
                CardTypeId = (int)Microsoft.Dynamics.Commerce.HardwareStation.CardPayment.CardType.GiftCard,
                IsSwipe = false
            }).ConfigureAwait(false);
        }

        /// <summary>
        /// Fetch token for credit card.
        /// </summary>
        /// <param name="isManualEntry">The value indicating whether credit card should be entered manually.</param>
        /// <param name="extensionTransactionProperties">Optional extension transaction properties.</param>
        /// <returns>A task that can await until the token generation has completed.</returns>
        [SuppressMessage("Microsoft.Usage", "CA1801", Justification = "Suppressed on adding CA for backward compatibility")]
        private async Task<PaymentInfo> FetchTokenAsync(bool isManualEntry, ExtensionTransaction extensionTransactionProperties)
        {
            await Task.Delay(10).ConfigureAwait(false);
            throw new PeripheralException(PeripheralException.PaymentTerminalError, "Operation is not supported by payment terminal.", inner: null);
        }

        /// <summary>
        /// Activate gift card.
        /// </summary>
        /// <param name="paymentConnectorName">The payment connector name.</param>
        /// <param name="amount">The amount.</param>
        /// <param name="currencyCode">The currency.</param>
        /// <param name="tenderInfo">The tender information.</param>
        /// <param name="extensionTransactionProperties">Optional extension transaction properties.</param>
        /// <returns>A task that can await until the void has completed.</returns>
        [SuppressMessage("Microsoft.Usage", "CA1801", Justification = "Suppressed on adding CA for backward compatibility")]
        private async Task<PaymentInfo> ActivateGiftCardAsync(string paymentConnectorName, decimal? amount, string currencyCode, TenderInfo tenderInfo, ExtensionTransaction extensionTransactionProperties)
        {
            await Task.Delay(10).ConfigureAwait(false);
            throw new PeripheralException(PeripheralException.PaymentTerminalError, "Operation is not supported by payment terminal.", inner: null);
        }

        /// <summary>
        /// Add balance to gift card.
        /// </summary>
        /// <param name="paymentConnectorName">The payment connector name.</param>
        /// <param name="amount">The amount.</param>
        /// <param name="currencyCode">The currency.</param>
        /// <param name="tenderInfo">The tender information.</param>
        /// <param name="extensionTransactionProperties">Optional extension transaction properties.</param>
        /// <returns>A task that can await until the void has completed.</returns>
        [SuppressMessage("Microsoft.Usage", "CA1801", Justification = "Suppressed on adding CA for backward compatibility")]
        private async Task<PaymentInfo> AddBalanceToGiftCardAsync(string paymentConnectorName, decimal? amount, string currencyCode, TenderInfo tenderInfo, ExtensionTransaction extensionTransactionProperties)
        {
            await Task.Delay(10).ConfigureAwait(false);
            throw new PeripheralException(PeripheralException.PaymentTerminalError, "Operation is not supported by payment terminal.", inner: null);
        }

        /// <summary>
        /// Get gift card balance.
        /// </summary>
        /// <param name="paymentConnectorName">The payment connector name.</param>
        /// <param name="currencyCode">The currency.</param>
        /// <param name="tenderInfo">The tender information.</param>
        /// <param name="extensionTransactionProperties">Optional extension transaction properties.</param>
        /// <returns>A task that can await until the void has completed.</returns>
        [SuppressMessage("Microsoft.Using", "CA1801", Justification = "Suppressed on adding CA for backward compatibility")]
        private async Task<PaymentInfo> GetGiftCardBalanceAsync(string paymentConnectorName, string currencyCode, TenderInfo tenderInfo, ExtensionTransaction extensionTransactionProperties)
        {
            await Task.Delay(10).ConfigureAwait(false);
            throw new PeripheralException(PeripheralException.PaymentTerminalError, "Operation is not supported by payment terminal.", inner: null);
        }
    }
}
