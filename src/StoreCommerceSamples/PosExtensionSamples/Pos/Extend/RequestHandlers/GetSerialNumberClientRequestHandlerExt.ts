/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { GetSerialNumberClientRequestHandler } from "PosApi/Extend/RequestHandlers/ProductsRequestHandlers";
import { GetSerialNumberClientRequest, GetSerialNumberClientResponse } from "PosApi/Consume/Products";
import { ClientEntities } from "PosApi/Entities";

/**
 * Override request handler class for getting serial number request.
 */
export default class GetSerialNumberClientRequestHandlerExt extends GetSerialNumberClientRequestHandler {

    /**
     * Executes the request handler asynchronously.
     * @param {GetSerialNumberClientRequest<GetSerialNumberClientResponse>} request The request containing the response.
     * @return {Promise<ICancelableDataResult<GetSerialNumberClientResponse>>} The cancelable promise containing the response.
     */
    public executeAsync(request: GetSerialNumberClientRequest<GetSerialNumberClientResponse>):
        Promise<ClientEntities.ICancelableDataResult<GetSerialNumberClientResponse>> {

        // User could implement new business logic here to process the serial number.
        // Following example sets serial number "112233" for product 82001.
        if (request.product.ItemId === "82001") {
            let response: GetSerialNumberClientResponse = new GetSerialNumberClientResponse("112233");
            return Promise.resolve(<ClientEntities.ICancelableDataResult<GetSerialNumberClientResponse>>{
                canceled: false,
                data: response
            });
        }

        return this.defaultExecuteAsync(request);
    }
}
