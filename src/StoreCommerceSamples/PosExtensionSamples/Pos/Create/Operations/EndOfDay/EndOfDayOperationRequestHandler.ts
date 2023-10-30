/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ExtensionOperationRequestType, ExtensionOperationRequestHandlerBase } from "PosApi/Create/Operations";
import { CloseShiftOperationRequest, CloseShiftOperationResponse } from "PosApi/Consume/Shifts";
import { SafeDropOperationRequest, SafeDropOperationResponse } from "PosApi/Consume/StoreOperations";
import { TenderDeclarationOperationRequest, TenderDeclarationOperationResponse } from "PosApi/Consume/StoreOperations";
import { TenderRemovalOperationRequest, TenderRemovalOperationResponse } from "PosApi/Consume/StoreOperations";
import { ClientEntities } from "PosApi/Entities";
import EndOfDayOperationResponse from "./EndOfDayOperationResponse";
import EndOfDayOperationRequest from "./EndOfDayOperationRequest";

/**
 * (Sample) Request handler for the EndOfDayOperationRequest class.
 */
export default class EndOfDayOperationRequestHandler extends ExtensionOperationRequestHandlerBase<EndOfDayOperationResponse> {
    /**
     * Gets the supported request type.
     * @return {RequestType<TResponse>} The supported request type.
     */
    public supportedRequestType(): ExtensionOperationRequestType<EndOfDayOperationResponse> {
        return EndOfDayOperationRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {EndOfDayOperationRequest<TResponse>} request The request.
     * @return {Promise<ICancelableDataResult<TResponse>>} The cancelable async result containing the response.
     */
    public executeAsync(printRequest: EndOfDayOperationRequest<EndOfDayOperationResponse>): Promise<ClientEntities.ICancelableDataResult<EndOfDayOperationResponse>> {

        this.context.logger.logInformational("Log message from PrintOperationRequestHandler executeAsync().", this.context.logger.getNewCorrelationId());

        // Tender Removal
        let tenderRemovalRequest: TenderRemovalOperationRequest<TenderRemovalOperationResponse> =
            new TenderRemovalOperationRequest(this.context.logger.getNewCorrelationId());
        return this.context.runtime.executeAsync(tenderRemovalRequest).then((result: ClientEntities.ICancelableDataResult<TenderRemovalOperationResponse>)
            : Promise<ClientEntities.ICancelableDataResult<SafeDropOperationResponse>> => {

            // Safe Drop
            if (!result.canceled) {
                let safeDropRequest: SafeDropOperationRequest<SafeDropOperationResponse> =
                    new SafeDropOperationRequest(this.context.logger.getNewCorrelationId());

                return this.context.runtime.executeAsync(safeDropRequest);
            } else {
                return Promise.resolve({
                    canceled: true,
                    data: null
                });
            }
        }).then((result: Commerce.Client.Entities.ICancelableDataResult<SafeDropOperationResponse>)
            : Promise<ClientEntities.ICancelableDataResult<TenderDeclarationOperationResponse>> => {

            // Tender Declaration
            if (!result.canceled) {
                let tenderDeclarationRequest: TenderDeclarationOperationRequest<TenderDeclarationOperationResponse> =
                    new TenderDeclarationOperationRequest(this.context.logger.getNewCorrelationId());

                return this.context.runtime.executeAsync(tenderDeclarationRequest);
            } else {
                return Promise.resolve({
                    canceled: true,
                    data: null
                });
            }
        }).then((result: ClientEntities.ICancelableDataResult<TenderDeclarationOperationResponse>)
            : Promise<ClientEntities.ICancelableDataResult<CloseShiftOperationResponse>> => {

            // Close Shift
            if (!result.canceled) {
                return new Promise(
                    (resolve: (value?: ClientEntities.ICancelableDataResult<CloseShiftOperationResponse>) => void, reject: (reason?: any) => void) => {
                    // A delay of ten seconds is added here as a work-around for issues with printing a second receipt to the windows driver
                    // printer before the first dialog is closed. A ten second delay gives the user a chance to close the first dialog before
                    // the issue occurs.
                    setTimeout(() => { resolve(null); }, 10000);
                }).then(() => {
                    let closeShiftOperationRequest: CloseShiftOperationRequest<CloseShiftOperationResponse> =
                        new CloseShiftOperationRequest(this.context.logger.getNewCorrelationId());
                    return this.context.runtime.executeAsync(closeShiftOperationRequest);
                });
            } else {
                return Promise.resolve({
                    canceled: true,
                    data: null
                });
            }
        }).then((result: ClientEntities.ICancelableDataResult<CloseShiftOperationResponse>)
            : ClientEntities.ICancelableDataResult<EndOfDayOperationResponse> => {

            return <ClientEntities.ICancelableDataResult<EndOfDayOperationResponse>>{
                canceled: result.canceled,
                data: result.canceled ? null : new EndOfDayOperationResponse()
            };
        });
    }
}