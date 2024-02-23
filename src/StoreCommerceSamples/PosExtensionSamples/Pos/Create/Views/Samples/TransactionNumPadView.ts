/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Views from "PosApi/Create/Views";
import * as ScanResults from "PosApi/Consume/ScanResults";
import * as Products from "PosApi/Consume/Products";
import { ITransactionNumPad, ITransactionNumPadOptions } from "PosApi/Consume/Controls";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { INumPadInputBroker, INumPadInputSubscriber } from "PosApi/Consume/Peripherals";
import { CustomViewControllerBase, IBarcodeScannerEndpoint, IMagneticStripeReaderEndpoint, INumPadInputSubscriberEndpoint } from "PosApi/Create/Views";
import { ErrorHelper } from "../../../Helpers";
import ko from "knockout";

type ScanSource = "BarcodeScanner" | "MagneticStripeReader" | "NumberPad";

/**
 * The controller for TransactionNumPadView.
 * The view implements INumPadInputSubscriberEndpoint which allows it to receive global keyboard input for the numpad.
 * The view implements IBarcodeScannerEndpoint which allows it to receive barcode scanner events.
 * The view implements IMagneticStripeReaderEndpoint which allows it to receive magnetic stripe reader events.
 */
export default class TransactionNumPadView extends CustomViewControllerBase implements INumPadInputSubscriberEndpoint, IMagneticStripeReaderEndpoint, IBarcodeScannerEndpoint {
    public numPad: ITransactionNumPad;
    public numPadValue: ko.Observable<string>;
    public numPadQuantity: ko.Observable<string>;
    public scanResult: ko.Observable<string>;
    public scanResultSourceText: ko.Observable<string>;
    public readonly implementsINumPadInputSubscriberEndpoint: true;
    public readonly implementsIBarcodeScannerEndpoint: true; // Set the flag to true to indicate that the view implements IBarcodeScannerEndpoint.
    public readonly implementsIMagneticStripeReaderEndpoint: true;

    private _numPadInputSubscriber: INumPadInputSubscriber;

    constructor(context: Views.ICustomViewControllerContext) {
        // Do not save in history
        super(context);

        this.numPadValue = ko.observable("");
        this.numPadQuantity = ko.observable("");
        this.scanResult = ko.observable("");
        this.scanResultSourceText = ko.observable("");
        this._numPadInputSubscriber = undefined;
        this.implementsINumPadInputSubscriberEndpoint = true; // Set the flag to true to indicate that the view implements INumPadInputSubscriberEndpoint.
        this.implementsIBarcodeScannerEndpoint = true; // Set the flag to true to indicate that the view implements IBarcodeScannerEndpoint.
        this.implementsIMagneticStripeReaderEndpoint = true; // Set the flag to true to indicate that the view implements IMagneticStripeReaderEndpoint.
    }

    /**
     * Bind the html element with view controller.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        // Customized binding
        ko.applyBindings(this, element);

        //Initialize numpad
        let numPadOptions: ITransactionNumPadOptions = {
            globalInputBroker: this._numPadInputSubscriber as INumPadInputBroker,
            label: "NumPad label",
            value: this.numPadValue()
        };

        let numPadRootElem: HTMLDivElement = element.querySelector("#TransactionNumPad") as HTMLDivElement;
        this.numPad = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "TransactionNumPad", numPadOptions, numPadRootElem);
        this.numPad.addEventListener("EnterPressed", (eventData: { quantity?: number; value: string }) => {
            this.numPadValue(eventData.value);
            if (eventData.quantity) {
                this.numPadQuantity(eventData.quantity.toString());
            } else {
                this.numPadQuantity("");
            }
            this._getScanResult(eventData.value, "NumberPad");
        });
    }

    /**
     * Sets the numpad input subscriber for the custom view.
     * @param numPadInputSubscriber The numpad input subscriber.
     */
    public setNumPadInputSubscriber(numPadInputSubscriber: INumPadInputSubscriber): void {
        this._numPadInputSubscriber = numPadInputSubscriber;
    }

    /**
     * The callback for barcode scanner events.
     * @param barcode The scanned barcode.
     */
    public onBarcodeScanned(barcode: string): void {
        this._getScanResult(barcode, "BarcodeScanner");
    }

    /**
     * The callback for magnetic stripe reader events.
     * @param cardInfo The card information.
     */
    public onMagneticStripeRead(cardInfo: ClientEntities.ICardInfo): void {
        this._getScanResult(cardInfo.CardNumber, "MagneticStripeReader");
    }

    /**
     * Callback for numpad.
     * @param {string} scanText Numpad current value.
     */
    private _getScanResult(scanText: string, scanSource: ScanSource): void {
        this.numPad.value = "";
        this.scanResult("");
        this.scanResultSourceText("Scan text source: " + scanSource);
        if (scanSource !== "NumberPad") {
            this.numPadQuantity("");
            this.numPadValue("");
        }

        this.state.isProcessing = true; // Setting this flag to true will show the processing indicator (spinner) on the view.
        let getScanResultClientRequest: ScanResults.GetScanResultClientRequest<ScanResults.GetScanResultClientResponse> =
            new ScanResults.GetScanResultClientRequest(scanText);

        this.context.runtime.executeAsync(getScanResultClientRequest)
            .then((response: ClientEntities.ICancelableDataResult<ScanResults.GetScanResultClientResponse>): void => {
                this.state.isProcessing = false; // Setting this flag to false will hide the processing indicator.
                if (ObjectExtensions.isNullOrUndefined(response.data)
                    || ObjectExtensions.isNullOrUndefined(response.data.result)) {
                    this.scanResult("Error");
                } else {
                    let scanResult: ProxyEntities.ScanResult = response.data.result;
                    let barcodeMaskType: ProxyEntities.BarcodeMaskType = scanResult.MaskTypeValue;
                    switch (barcodeMaskType) {
                        case ProxyEntities.BarcodeMaskType.Item:
                            // If the scanned text maps to a product bar code based on the bar code mask,
                            // but the product associated with the bar code is not found, the Product field
                            // on the scanResult won't be set.
                            let product: ProxyEntities.SimpleProduct = scanResult.Product;
                            if (ObjectExtensions.isNullOrUndefined(product)) {
                                this.scanResult("Product error: The product associated with the bar code was not found.");
                            } else {
                                // If a KitMaster product is passed on the request below, its default configuration will be loaded.
                                if (product.ProductTypeValue === ProxyEntities.ProductType.Master) {
                                    let selectPVClientRequest: Products.SelectProductVariantClientRequest<Products.SelectProductVariantClientResponse> =
                                        new Products.SelectProductVariantClientRequest(product);
                                    this.context.runtime.executeAsync(selectPVClientRequest)
                                        .then((response: ClientEntities.ICancelableDataResult<Products.SelectProductVariantClientResponse>): void => {
                                            if (response.canceled) {
                                                this.scanResult("Product variant selection canceled.");
                                            } else {
                                                this.scanResult("Product variant: " + response.data.result.Name);
                                            }
                                        }).catch((reason: any) => {
                                            this.context.logger.logError("Select product variant error: " + JSON.stringify(reason));
                                        });
                                } else {
                                    this.scanResult("Product: " + product.Name);
                                }
                            }
                            break;
                        case ProxyEntities.BarcodeMaskType.Customer:
                            // If the scanned text maps to a customer bar code based on the bar code mask,
                            // but the customer associated with the bar code is not found, the Customer field
                            // on the scanResult won't be set.
                            if (ObjectExtensions.isNullOrUndefined(scanResult.Customer)) {
                                this.scanResult("Customer error: The customer associated with the bar code was not found.");
                            } else {
                                this.scanResult("Customer: " + scanResult.Customer.Name);
                            }
                            break;
                        case ProxyEntities.BarcodeMaskType.LoyaltyCard:
                            // If the scanned text maps to a loyalty card bar code based on the bar code mask,
                            // but the loyalty card associated with the bar code is not found, the Loyalty card field
                            // on the scanResult won't be set.
                            if (ObjectExtensions.isNullOrUndefined(scanResult.LoyaltyCard)) {
                                this.scanResult("Customer error: The customer associated with the bar code was not found.");
                            } else {
                                this.scanResult("LoyaltyCard: " + scanResult.LoyaltyCard.CardNumber);
                            }
                            break;
                        case ProxyEntities.BarcodeMaskType.DiscountCode:
                            this.scanResult("Discount code: " + scanResult.Barcode.DiscountCode);
                            break;
                        case ProxyEntities.BarcodeMaskType.Coupon:
                            this.scanResult("Coupon code: " + scanResult.Barcode.CouponId);
                            break;
                        case ProxyEntities.BarcodeMaskType.None:
                            this.scanResult("Nothing was found");
                            break;
                        default:
                            this.scanResult("The bar code type that was scanned is not supported.");
                            break;
                    }
                }
            }).catch((reason: any) => {
                this.state.isProcessing = false; // Setting this flag to false will hide the processing indicator.
                ErrorHelper.displayErrorAsync(this.context, reason);
            });
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}
