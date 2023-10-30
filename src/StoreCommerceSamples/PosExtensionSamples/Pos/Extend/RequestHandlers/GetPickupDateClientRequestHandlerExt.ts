/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { GetPickupDateClientRequestHandler } from "PosApi/Extend/RequestHandlers/CartRequestHandlers";
import { GetPickupDateClientRequest, GetPickupDateClientResponse } from "PosApi/Consume/Cart";
import { ClientEntities } from "PosApi/Entities";

/**
 * Override request handler class for getting serial number request.
 */
export default class GetPickupDateClientRequestHandlerExt extends GetPickupDateClientRequestHandler {

    /**
     * Executes the request handler asynchronously.
     * @param {GetPickupDateClientRequest<GetPickupDateClientResponse>} The request containing the response.
     * @return {Promise<ICancelableDataResult<GetPickupDateClientResponse>>} The cancelable promise containing the response.
     */
    public executeAsync(request: GetPickupDateClientRequest<GetPickupDateClientResponse>):
        Promise<ClientEntities.ICancelableDataResult<GetPickupDateClientResponse>> {
        let response: Promise<ClientEntities.ICancelableDataResult<GetPickupDateClientResponse>> =
            new Promise<ClientEntities.ICancelableDataResult<GetPickupDateClientResponse>>(
                (resolve: (date: ClientEntities.ICancelableDataResult<GetPickupDateClientResponse>) => void, reject: (reason?: any) => void) => {
                    this.defaultExecuteAsync(request).then((value: ClientEntities.ICancelableDataResult<GetPickupDateClientResponse>) => {
                        if (value.canceled) {
                            resolve({ canceled: true, data: null });
                            /* Example of extra validation for delivery date
                            } else if (!DateExtensions.isTodayOrFutureDate(value.data.result)) {
                                let error: ClientEntities.ExtensionError = new ClientEntities.ExtensionError("The delivery date is not valid.");
                                reject(error); */
                        } else {
                            resolve({ canceled: false, data: new GetPickupDateClientResponse(value.data.result) });
                        }
                    }).catch((reason: any) => {
                        reject(reason);
                    });
                });

        return response;
    }
}
