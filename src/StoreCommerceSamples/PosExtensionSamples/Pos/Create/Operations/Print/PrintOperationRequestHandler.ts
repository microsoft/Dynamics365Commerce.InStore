/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ExtensionOperationRequestType, ExtensionOperationRequestHandlerBase } from "PosApi/Create/Operations";
import PrintOperationResponse from "./PrintOperationResponse";
import PrintOperationRequest from "./PrintOperationRequest";
import { ClientEntities } from "PosApi/Entities";

/**
 * (Sample) Request handler for the PrintOperationRequest class.
 */
export default class PrintOperationRequestHandler extends ExtensionOperationRequestHandlerBase<PrintOperationResponse> {
    /**
     * Gets the supported request type.
     * @return {RequestType<TResponse>} The supported request type.
     */
    public supportedRequestType(): ExtensionOperationRequestType<PrintOperationResponse> {
        return PrintOperationRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {PrintOperationRequest<TResponse>} request The request.
     * @return {Promise<ICancelableDataResult<TResponse>>} The cancelable async result containing the response.
     */
    public executeAsync(request: PrintOperationRequest<PrintOperationResponse>): Promise<ClientEntities.ICancelableDataResult<PrintOperationResponse>> {

        this.context.logger.logInformational("Log message from PrintOperationRequestHandler executeAsync().", this.context.logger.getNewCorrelationId());
        let messageToPrint: string = "Message from PrintOperationRequestHandler: " + request.messageToPrint;

        let response: PrintOperationResponse = new PrintOperationResponse(messageToPrint);
        return new Promise((resolve: (value?: ClientEntities.ICancelableDataResult<PrintOperationResponse>) => void) => {

            // Simulating delay so that busy indicator is shown until timeout.
            setTimeout(resolve, 2000 /*milliseconds*/);
        }).then((): ClientEntities.ICancelableDataResult<PrintOperationResponse> => {

            // Printing the message to console.
            console.log(messageToPrint);
            return <ClientEntities.ICancelableDataResult<PrintOperationResponse>>{
                canceled: false,
                data: response
            };
        });
    }
}