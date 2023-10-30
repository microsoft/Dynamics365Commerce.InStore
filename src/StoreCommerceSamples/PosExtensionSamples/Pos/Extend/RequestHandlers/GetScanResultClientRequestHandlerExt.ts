/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { GetScanResultClientRequestHandler } from "PosApi/Extend/RequestHandlers/ScanResultsRequestHandlers";
import { ClientEntities } from "PosApi/Entities";
import { GetScanResultClientRequest, GetScanResultClientResponse } from "PosApi/Consume/ScanResults";

/**
 * Override request handler class for getting scan result request.
 */
export default class GetScanResultClientRequestHandlerExt extends GetScanResultClientRequestHandler {

    /**
     * Executes the request handler asynchronously.
     * @param {GetScanResultClientRequest<GetScanResultClientResponse>} The request containing the response.
     * @return {Promise<ICancelableDataResult<GetScanResultClientResponse>>} The cancelable promise containing the response.
     */
    public executeAsync(request: GetScanResultClientRequest<GetScanResultClientResponse>):
        Promise<ClientEntities.ICancelableDataResult<GetScanResultClientResponse>> {
        let newBarCode: string = request.scanText;
        // User could implement new business logic here to process the bar code.
        // Following example take the first 13 characters as the new bar code.
        // newBarCode = newBarCode.substr(0, 13);

        let newRequest: GetScanResultClientRequest<GetScanResultClientResponse> =
            new GetScanResultClientRequest<GetScanResultClientResponse>(newBarCode);

        return this.defaultExecuteAsync(newRequest);
    }
}
