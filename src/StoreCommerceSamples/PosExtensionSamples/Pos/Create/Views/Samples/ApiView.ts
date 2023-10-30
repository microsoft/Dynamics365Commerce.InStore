/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    RefreshCartClientRequest, RefreshCartClientResponse, GetCurrentCartClientRequest, GetCurrentCartClientResponse,
    PriceOverrideOperationRequest, PriceOverrideOperationResponse, SetTransactionCommentOperationRequest, SetTransactionCommentOperationResponse,
    SetCartLineCommentOperationRequest, SetCartLineCommentOperationResponse
} from "PosApi/Consume/Cart";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { ArrayExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import * as Views from "PosApi/Create/Views";
import ko from "knockout";

type ICancelableDataResult<TResult> = ClientEntities.ICancelableDataResult<TResult>;

/**
 * The controller for AppBarView.
 */
export default class ApiView extends Views.CustomViewControllerBase {

    public lastStatus: ko.Observable<string>;
    public transactionComment: ko.Observable<string>;
    public cartLineComment: ko.Observable<string>;

    constructor(context: Views.ICustomViewControllerContext, options?: any) {
        super(context);

        this.state.title = "Api sample"
        this.lastStatus = ko.observable("");
        this.transactionComment = ko.observable("");
        this.cartLineComment = ko.observable("");
    }

    /**
     * Callback for Refresh cart API button
     */
    public onRefreshCart(): void {
        let correlationId: string = this.context.logger.logInformational("ApiView.onRefreshCart - Refreshing the cart...");
        let request: RefreshCartClientRequest<RefreshCartClientResponse> = new RefreshCartClientRequest<RefreshCartClientResponse>();
        this.context.runtime.executeAsync(request).then((result: ClientEntities.ICancelableDataResult<RefreshCartClientResponse>): void => {
            this.onRequestSuccess(result, correlationId);
        }).catch((error: any): void => {
            this.onRequestFailed(error, correlationId);
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
     * Callback for Override price for cart line API button
     */
    public onPriceOverride(percent: number): void {
        let correlationId: string = this.context.logger.getNewCorrelationId();
        this.getFirstCartLine(correlationId).then((line: ProxyEntities.CartLine) => {

            let priceOverrideRequest: PriceOverrideOperationRequest<PriceOverrideOperationResponse> =
                new PriceOverrideOperationRequest<PriceOverrideOperationResponse>(line.LineId, line.Price * (1 - (percent / 100)), correlationId);

            this.context.runtime.executeAsync(priceOverrideRequest)
                .then((result: ClientEntities.ICancelableDataResult<PriceOverrideOperationResponse>): void => {
                    this.onRequestSuccess(result, correlationId);
                }).catch((error: any): void => {
                    this.onRequestFailed(error, correlationId);
                });
        }).catch((error: any): void => {
            this.onRequestFailed(error, correlationId);
        });
    }

    /**
     * Callback for transaction comment API button
     */
    public onTransactionComment(): void {
        let correlationId: string = this.context.logger.getNewCorrelationId();
        let request: SetTransactionCommentOperationRequest<SetTransactionCommentOperationResponse> =
            new SetTransactionCommentOperationRequest<SetTransactionCommentOperationResponse>(correlationId, this.transactionComment());
        this.context.runtime.executeAsync(request).then((result: ClientEntities.ICancelableDataResult<SetTransactionCommentOperationResponse>): void => {
            this.onRequestSuccess(result, correlationId);
        }).catch((error: any): void => {
            this.onRequestFailed(error, correlationId);
        });
    }

    /**
     * Callback for cart line comment API button
     */
    public onCartLineComment(): void {
        let correlationId: string = this.context.logger.getNewCorrelationId();
        this.getFirstCartLine(correlationId).then((line: ProxyEntities.CartLine) => {
            let request: SetCartLineCommentOperationRequest<SetCartLineCommentOperationResponse> =
                new SetCartLineCommentOperationRequest<SetCartLineCommentOperationResponse>(line.LineId, this.cartLineComment(), correlationId);
            this.context.runtime.executeAsync(request).then((result: ClientEntities.ICancelableDataResult<SetCartLineCommentOperationResponse>): void => {
                this.onRequestSuccess(result, correlationId);
            }).catch((error: any): void => {
                this.onRequestFailed(error, correlationId);
            });
        }).catch((error: any): void => {
            this.onRequestFailed(error, correlationId);
        });
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Executes function on the first line in the current cart
     * @param {string} correlationId The correlation identifier.
     */
    private getFirstCartLine(correlationId: string): Promise<ProxyEntities.CartLine> {
        this.context.logger.logInformational("ApiView.getFirstCartLine - Getting the current cart...", correlationId);
        let getCartRequest: GetCurrentCartClientRequest<GetCurrentCartClientResponse> = new GetCurrentCartClientRequest<GetCurrentCartClientResponse>();
        return this.context.runtime.executeAsync(getCartRequest).then((value: ICancelableDataResult<GetCurrentCartClientResponse>) => {
            if (!value.canceled) {
                let cart: ProxyEntities.Cart = (<GetCurrentCartClientResponse>value.data).result;
                if (!ObjectExtensions.isNullOrUndefined(cart) &&
                    ArrayExtensions.hasElements(cart.CartLines)) {
                    this.context.logger.logInformational("ApiView.getFirstCartLine - get current cart completed successfully.", correlationId);
                    return cart.CartLines[0];
                } else {
                    throw new Error("failed - cart is not loaded or no lines in cart");
                }
            } else {
                throw new Error("cancelled");
            }
        });
    }

    /**
     * Callback for API request success.
     * @param value The result of the API request.
     * @param correlationId The correlation identifier.
     */
    private onRequestSuccess(value: ICancelableDataResult<any>, correlationId: string): void {
        if (!value.canceled) {
            this.lastStatus(JSON.stringify(value.data, null, 2));
            this.context.logger.logVerbose("ApiView.onRequestSuccess - last status updated.", correlationId);
        } else {
            this.lastStatus("cancelled");
            this.context.logger.logVerbose("ApiView.onRequestSuccess - Request cancelled and last status updated.", correlationId);
        }
    }

    /**
     * Callback for API request failure.
     * @param err The error object.
     * @param correlationId The correlation identifier.
     */
    private onRequestFailed(err: any, correlationId: string): void {
        this.lastStatus(JSON.stringify(err, null, 2));
        this.context.logger.logError("ApiView.onRequestFailed Error: " + this.lastStatus(), correlationId);
    }

}
