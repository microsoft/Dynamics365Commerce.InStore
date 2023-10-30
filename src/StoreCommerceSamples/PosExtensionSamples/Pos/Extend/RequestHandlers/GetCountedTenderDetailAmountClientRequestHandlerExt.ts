/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as TenderCountingRequestHandlers from "PosApi/Extend/RequestHandlers/TenderCountingRequestHandlers";
import { GetCountedTenderDetailAmountClientRequest, GetCountedTenderDetailAmountClientResponse } from "PosApi/Consume/StoreOperations";
import { AbstractRequestType } from "PosApi/Create/RequestHandlers";
import { ClientEntities } from "PosApi/Entities";
import { StringExtensions } from "PosApi/TypeExtensions";
import MessageDialog from "../../Create/Dialogs/DialogSample/MessageDialog";

/**
 * Example implementation of an GetCountedTenderDetailAmountClientRequestHandler request handler that shown a message on the screen
 * and returns a fixed value of counted tender (without showing a dialog).
 */
export default class GetCountedTenderDetailAmountClientRequestHandlerExt extends TenderCountingRequestHandlers.GetCountedTenderDetailAmountClientRequestHandler {
    /**
     * Gets the supported request type.
     * @return {AbstractRequestType<GetCountedTenderDetailAmountClientResponse>} The supported abstract or concrete request type.
     */
    public supportedRequestType(): AbstractRequestType<GetCountedTenderDetailAmountClientResponse> {
        return GetCountedTenderDetailAmountClientRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {GetCountedTenderDetailAmountClientRequest<GetCountedTenderDetailAmountClientResponse>} request The GetCountedTenderDetailAmountClientRequest request.
     * @return {Promise<ClientEntities.ICancelableDataResult<GetCountedTenderDetailAmountClientResponse>>} The promise with a cancelable result containing the response.
     */
    public executeAsync(request: GetCountedTenderDetailAmountClientRequest<GetCountedTenderDetailAmountClientResponse>)
        : Promise<ClientEntities.ICancelableDataResult<GetCountedTenderDetailAmountClientResponse>> {
        const value: number = 20;
        let message: string = StringExtensions.format("Using GetCountedTenderDetailAmountClientRequestHandler extension. Response value: {0}.", value);

        return MessageDialog.show(this.context, message).then((): Promise<ClientEntities.ICancelableDataResult<GetCountedTenderDetailAmountClientResponse>> => {
            let response: GetCountedTenderDetailAmountClientResponse = new GetCountedTenderDetailAmountClientResponse(value);
            return Promise.resolve(<ClientEntities.ICancelableDataResult<GetCountedTenderDetailAmountClientResponse>>{ canceled: false, data: response });
        });
    }
}