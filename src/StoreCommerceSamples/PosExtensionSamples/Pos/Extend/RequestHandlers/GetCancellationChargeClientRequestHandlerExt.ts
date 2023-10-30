/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { GetCancellationChargeClientRequestHandler } from "PosApi/Extend/RequestHandlers/SalesOrdersRequestHandlers";
import { ClientEntities } from "PosApi/Entities";
import { GetCancellationChargeClientRequest, GetCancellationChargeClientResponse } from "PosApi/Consume/SalesOrders";

/**
 * Override request handler class for get cancellation charge client request.
 */
export default class GetCancellationChargeClientRequestHandlerExt extends GetCancellationChargeClientRequestHandler {

    /**
     * Executes the request handler asynchronously.
     * @param {GetCancellationChargeClientRequest<GetCancellationChargeClientResponse>} request The request containing the response.
     * @return {Promise<ICancelableDataResult<GetCancellationChargeClientResponse>>} The cancelable promise containing the response.
     */
    public executeAsync(request: GetCancellationChargeClientRequest<GetCancellationChargeClientResponse>):
        Promise<ClientEntities.ICancelableDataResult<GetCancellationChargeClientResponse>> {

        // May skip a dialog directly and set here the amount for cancellation charge
        let cancelationChargeAmount: number = request.cart.CancellationChargeAmount > 5 ? 5 : request.cart.CancellationChargeAmount;
        let response: GetCancellationChargeClientResponse = new GetCancellationChargeClientResponse(cancelationChargeAmount);
        return Promise.resolve(<ClientEntities.ICancelableDataResult<GetCancellationChargeClientResponse>>{ canceled: false, data: response });
    }
}
