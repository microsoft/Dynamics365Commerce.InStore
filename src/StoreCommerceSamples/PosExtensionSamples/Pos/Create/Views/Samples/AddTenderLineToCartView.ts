/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    AddTenderLineToCartClientRequest,
    AddTenderLineToCartClientResponse,
    GetCurrentCartClientRequest,
    GetCurrentCartClientResponse
} from "PosApi/Consume/Cart";
import {
    GetDeviceConfigurationClientRequest,
    GetDeviceConfigurationClientResponse
} from "PosApi/Consume/Device";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { ArrayExtensions, StringExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import * as Views from "PosApi/Create/Views";
import ko from "knockout";

type ICancelableDataResult<TResult> = ClientEntities.ICancelableDataResult<TResult>;

/**
 * The controller for AppBarView.
 */
export default class AddTenderLineToCartView extends Views.CustomViewControllerBase {
    public readonly lastStatus: ko.Observable<string>;

    constructor(context: Views.ICustomViewControllerContext, options?: any) {
        super(context);

        this.state.title = "AddTenderLineToCartView sample";
        this.lastStatus = ko.observable("");
    }

    /**
     * Call add tender line to cart.
     */
    public onAddTenderLineToCartClick(): void {
        let getCartRequest: GetCurrentCartClientRequest<GetCurrentCartClientResponse> = new GetCurrentCartClientRequest<GetCurrentCartClientResponse>();
        this.context.runtime.executeAsync(getCartRequest)
            .then((getCurrentCartClientResponse: ICancelableDataResult<GetCurrentCartClientResponse>) => {
                if (!getCurrentCartClientResponse.canceled) {
                    let cart: ProxyEntities.Cart = getCurrentCartClientResponse.data.result;

                    if (!ObjectExtensions.isNullOrUndefined(cart) &&
                        ArrayExtensions.hasElements(cart.CartLines)) {
                        let getDeviceConfigurationClientRequest: GetDeviceConfigurationClientRequest<GetDeviceConfigurationClientResponse> =
                            new GetDeviceConfigurationClientRequest();

                        this.context.runtime.executeAsync(getDeviceConfigurationClientRequest)
                            .then((getDeviceConfigurationClientResponse: ICancelableDataResult<GetDeviceConfigurationClientResponse>) => {
                                if (!getDeviceConfigurationClientResponse.canceled) {
                                    // Get currency settings.
                                    let deviceConfiguration: GetDeviceConfigurationClientResponse = getDeviceConfigurationClientResponse.data;

                                    let cartTenderLine: ProxyEntities.CartTenderLine = {
                                        Amount: 1, // $1
                                        TenderTypeId: "1", // Cash
                                        Currency: deviceConfiguration.result.Currency
                                    };

                                    let addTenderLineToCartClientRequest: AddTenderLineToCartClientRequest<AddTenderLineToCartClientResponse> =
                                        new AddTenderLineToCartClientRequest<AddTenderLineToCartClientResponse>(cartTenderLine);

                                    this.context.runtime.executeAsync(addTenderLineToCartClientRequest)
                                        .then((addTenderLineToCartClientResponse: ICancelableDataResult<AddTenderLineToCartClientResponse>) => {
                                            if (!addTenderLineToCartClientResponse.canceled) {
                                                let cart: ProxyEntities.Cart = addTenderLineToCartClientResponse.data.result;
                                                let tenderLinesGridCount: number = 0;

                                                if (ArrayExtensions.hasElements(cart.TenderLines)) {
                                                    tenderLinesGridCount = cart.TenderLines.length;
                                                }

                                                let message: string = StringExtensions.format("Tender Lines Count: {0} \n Cart: \n {1}",
                                                    tenderLinesGridCount,
                                                    JSON.stringify(addTenderLineToCartClientResponse.data.result));

                                                this.lastStatus(message);
                                            } else {
                                                this.lastStatus("addTenderLineToCartClientRequest: cancelled");
                                            }
                                        }).catch((err: any) => {
                                            // Error will be thrown if total cart amount is negative already.
                                            this.lastStatus(JSON.stringify(err));
                                        });
                                }
                            }).catch((err: any) => {
                                this.lastStatus(JSON.stringify(err));
                            });
                    } else {
                        this.lastStatus("failed onAddTenderLineToCartClick - cart is not loaded or no lines in cart");
                    }
                } else {
                    this.lastStatus("onAddTenderLineToCartClick: cancelled");
                }
            }).catch((err: any) => {
                this.lastStatus(JSON.stringify(err));
            });
    }

    /**
     * Bind the html element with view controller.
     *
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}
