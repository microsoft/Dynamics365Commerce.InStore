/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Views from "PosApi/Create/Views";
import { GetCurrentCartClientRequest, GetCurrentCartClientResponse } from "PosApi/Consume/Cart";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { ObjectExtensions, ArrayExtensions } from "PosApi/TypeExtensions";
import { VoidCartLineOperationRequest, VoidCartLineOperationResponse } from "PosApi/Consume/Cart";
import ko from "knockout";
type ICancelableDataResult<TResult> = ClientEntities.ICancelableDataResult<TResult>;

/**
 * The controller for VoidCartLineView.
 */
export default class VoidCartLineView extends Views.CustomViewControllerBase {
    public currentCart: ko.Observable<string>;
    public cartLineId: string;

    /**
     * Creates a new instance of the VoidCartLineView class.
     * @param {Views.ICustomViewControllerContext} context The custom view controller context.
     * @param {any} [options] The options used to initialize the view state.
     */
    constructor(context: Views.ICustomViewControllerContext, options?: any) {
        // Do not save in history
        super(context);
        this.state.title = "Void cart line sample";
        this.currentCart = ko.observable("");
        this.cartLineId = "";
    }

    /**
     * Bind the html element with view controller.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);
    }

    /**
     * Gets the current cart.
     */
    public getCurrentCart(): void {
        let getCartRequest: GetCurrentCartClientRequest<GetCurrentCartClientResponse> = new GetCurrentCartClientRequest<GetCurrentCartClientResponse>();
        this.context.runtime.executeAsync(getCartRequest).then((value: ICancelableDataResult<GetCurrentCartClientResponse>) => {
            let cart: ProxyEntities.Cart = (<GetCurrentCartClientResponse>value.data).result;
            let nonVoidedCartLines: ProxyEntities.CartLine[] = cart.CartLines.filter((cartLine: ProxyEntities.CartLine) => {
                return !cartLine.IsVoided;
            });
            if (ArrayExtensions.hasElements(nonVoidedCartLines)) {
                this.cartLineId = nonVoidedCartLines[0].LineId;
            }

            this.currentCart(JSON.stringify(cart));
        }).catch((err: any) => {
            this.currentCart(JSON.stringify(err));
        });
    }

    /**
     * Voids a cart line.
     */
    public voidCartLine(): void {
        let voidCartLineOperationRequest: VoidCartLineOperationRequest<VoidCartLineOperationResponse> =
            new VoidCartLineOperationRequest<VoidCartLineOperationResponse>(this.cartLineId, this.context.logger.getNewCorrelationId());

        this.context.runtime.executeAsync(voidCartLineOperationRequest).then((value: ICancelableDataResult<VoidCartLineOperationResponse>) => {
            if (value.canceled) {
                this.currentCart("Void cart line is canceled");
            } else {
                this.currentCart(JSON.stringify(value.data.cart));
            }
        }).catch((err: any) => {
            this.currentCart(JSON.stringify(err));
        });
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}
