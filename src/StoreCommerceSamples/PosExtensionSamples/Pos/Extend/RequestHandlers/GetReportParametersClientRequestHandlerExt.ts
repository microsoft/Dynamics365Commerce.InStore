/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { GetReportParametersClientRequestHandler } from "PosApi/Extend/RequestHandlers/StoreOperationsRequestHandlers";
import { ClientEntities } from "PosApi/Entities";
import { GetReportParametersClientRequest, GetReportParametersClientResponse } from "PosApi/Consume/StoreOperations";

/**
 * Override request handler class for get report parameters client request.
 */
export default class GetReportParametersClientRequestHandlerExt extends GetReportParametersClientRequestHandler {

    /**
     * Executes the request handler asynchronously.
     * @param {GetReportParametersClientRequest<GetReportParametersClientResponse>} request The request containing the response.
     * @return {Promise<ICancelableDataResult<GetReportParametersClientResponse>>} The cancelable promise containing the response.
     */
    public executeAsync(request: GetReportParametersClientRequest<GetReportParametersClientResponse>):
        Promise<ClientEntities.ICancelableDataResult<GetReportParametersClientResponse>> {
        let parameters: ClientEntities.IReportParameter[] = request.reportParameters;

        // The original parameters may be modified here before sending them to the response.
        let response: GetReportParametersClientResponse = new GetReportParametersClientResponse(parameters);
        return Promise.resolve(<ClientEntities.ICancelableDataResult<GetReportParametersClientResponse>>{ canceled: false, data: response });
    }
}
