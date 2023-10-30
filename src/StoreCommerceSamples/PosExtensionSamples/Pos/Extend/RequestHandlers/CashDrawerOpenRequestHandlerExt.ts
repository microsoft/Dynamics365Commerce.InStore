/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { CashDrawerOpenRequestHandler } from "PosApi/Extend/RequestHandlers/PeripheralsRequestHandlers";
import { CashDrawerOpenRequest, CashDrawerOpenResponse } from "PosApi/Consume/Peripherals";
import { ClientEntities } from "PosApi/Entities";

/**
 * Override request handler class for open cash drawer operation.
 */
export default class CashDrawerOpenRequestHandlerExt extends CashDrawerOpenRequestHandler {

    /**
     * Executes the request handler asynchronously.
     * @param {CashDrawerOpenRequest<CashDrawerOpenResponse>} The request containing the response.
     * @return {Promise<ICancelableDataResult<CashDrawerOpenResponse>>} The cancelable promise containing the response.
     */
    public executeAsync(request: CashDrawerOpenRequest<CashDrawerOpenResponse>):
        Promise<ClientEntities.ICancelableDataResult<CashDrawerOpenResponse>> {

        // User could implement new business logic here to to override the open cash drawer operation.

        return this.defaultExecuteAsync(request);
    }
}
