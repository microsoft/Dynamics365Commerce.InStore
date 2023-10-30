/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ShowChangeDueClientRequestHandler } from "PosApi/Extend/RequestHandlers/CartRequestHandlers";
import { ShowChangeDueClientRequest, ShowChangeDueClientResponse } from "PosApi/Consume/Cart";
import { ClientEntities } from "PosApi/Entities";

/**
 * Override request handler class for showing change due.
 */
export default class ShowChangeDueClientRequestHandlerExt extends ShowChangeDueClientRequestHandler {

    /**
     * Executes the request handler asynchronously.
     * @param {ShowChangeDueClientRequest<ShowChangeDueClientResponse>} The request containing the response.
     * @return {Promise<ICancelableDataResult<ShowChangeDueClientResponse>>} The cancelable promise containing the response.
     */
    public executeAsync(request: ShowChangeDueClientRequest): Promise<ClientEntities.ICancelableDataResult<ShowChangeDueClientResponse>> {

        // User could implement new business logic here to override the dialog.

        return this.defaultExecuteAsync(request);
    }
}
