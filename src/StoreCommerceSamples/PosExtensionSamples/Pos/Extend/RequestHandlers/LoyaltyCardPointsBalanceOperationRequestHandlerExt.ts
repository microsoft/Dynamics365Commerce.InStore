/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { LoyaltyCardPointsBalanceOperationRequestHandler } from "PosApi/Extend/RequestHandlers/StoreOperationsRequestHandlers";
import { LoyaltyCardPointsBalanceOperationRequest, LoyaltyCardPointsBalanceOperationResponse } from "PosApi/Consume/StoreOperations";
import { ClientEntities } from "PosApi/Entities";

/**
 * Override request handler class for the loyalty card balance operation.
 */
export default class LoyaltyCardPointsBalanceOperationRequestHandlerExt extends LoyaltyCardPointsBalanceOperationRequestHandler {

    /**
     * Executes the request handler asynchronously.
     * @param {LoyaltyCardPointsBalanceOperationRequest<LoyaltyCardPointsBalanceOperationResponse>} request The request containing the response.
     * @return {Promise<ICancelableDataResult<LoyaltyCardPointsBalanceOperationResponse>>} The cancelable promise containing the response.
     */
    public executeAsync(request: LoyaltyCardPointsBalanceOperationRequest<LoyaltyCardPointsBalanceOperationResponse>):
        Promise<ClientEntities.ICancelableDataResult<LoyaltyCardPointsBalanceOperationResponse>> {

        // User could implement new business logic here to override deposit override flow.
        return this.defaultExecuteAsync(request);
    }
}
