/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { PaymentTerminalExecuteTaskRequestHandler } from "PosApi/Extend/RequestHandlers/PeripheralsRequestHandlers";
import { PaymentTerminalExecuteTaskRequest, PaymentTerminalExecuteTaskResponse } from "PosApi/Consume/Peripherals";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { GetCurrentCartClientRequest, GetCurrentCartClientResponse } from "PosApi/Consume/Cart";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import PaymentTerminalExecuteTaskRequestFactory from "Create/Helpers/PaymentTerminalExecuteTaskRequestFactory";

/**
 * Override request handler class for the payment terminal ExecuteTask request.
 */
export default class PaymentTerminalExecuteTaskRequestHandlerExt extends PaymentTerminalExecuteTaskRequestHandler {
    /**
     * Executes the request handler asynchronously.
     * @param {PaymentTerminaExecuteTaskRequest<PaymentTerminalExecuteTaskResponse>} request The request.
     * @return {Promise<ICancelableDataResult<PaymentTerminalExecuteTaskResponse>>} 
     * The cancelable promise containing the response.
     */
    public executeAsync(request: PaymentTerminalExecuteTaskRequest<PaymentTerminalExecuteTaskResponse>):
        Promise<ClientEntities.ICancelableDataResult<PaymentTerminalExecuteTaskResponse>> {
        let cart: ProxyEntities.Cart = null;
        let cartRequest: GetCurrentCartClientRequest<GetCurrentCartClientResponse> = new GetCurrentCartClientRequest();

        // Get cart first and then build PaymentTerminalExecuteTaskRequest base on request task and cart info.
        return this.context.runtime.executeAsync(cartRequest)
            .then((result: ClientEntities.ICancelableDataResult<GetCurrentCartClientResponse>): void => {
                if (!(result.canceled || ObjectExtensions.isNullOrUndefined(result.data))) {
                    cart = result.data.result;
                }
            }).then((): Promise<ClientEntities.ICancelableDataResult<PaymentTerminalExecuteTaskResponse>> => {
                let newRequest: PaymentTerminalExecuteTaskRequest<PaymentTerminalExecuteTaskResponse> =
                PaymentTerminalExecuteTaskRequestFactory.createPaymentTerminalExecuteTaskRequest(request.task, cart);

                return this.defaultExecuteAsync(newRequest);
            });
    }
}