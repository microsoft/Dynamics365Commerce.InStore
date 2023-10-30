/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { SelectZipCodeInfoClientRequestHandler } from "PosApi/Extend/RequestHandlers/StoreOperationsRequestHandlers";
import { SelectZipCodeInfoClientRequest, SelectZipCodeInfoClientResponse } from "PosApi/Consume/StoreOperations";
import { ClientEntities } from "PosApi/Entities";

/**
 * Override request handler class for select zip code info request.
 */
export default class SelectZipCodeInfoClientRequestHandlerExt extends SelectZipCodeInfoClientRequestHandler {

    /**
     * Executes the request handler asynchronously.
     * @param {SelectZipCodeInfoClientRequest<SelectZipCodeInfoClientResponse>} The request containing the response.
     * @return {Promise<ICancelableDataResult<SelectZipCodeInfoClientResponse>>} The cancelable promise containing the response.
     */
    public executeAsync(request: SelectZipCodeInfoClientRequest):
        Promise<ClientEntities.ICancelableDataResult<SelectZipCodeInfoClientResponse>> {

        this.context.logger.logInformational("Executing SelectZipCodeInfoClientRequestHandlerExt for request:  " + JSON.stringify(request) + ".");

        // Do the extension logic here in place of default handler.
         return this.defaultExecuteAsync(request);
    }
}
