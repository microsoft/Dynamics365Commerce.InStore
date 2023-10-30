/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ExtensionRequestHandlerBase, ExtensionRequestType } from "PosApi/Create/RequestHandlers";
import { ClientEntities } from "PosApi/Entities";
import MessageDialog from "../../Create/Dialogs/DialogSample/MessageDialog";
import SendEmailRequest from "./SendEmailRequest";
import SendEmailResponse from "./SendEmailResponse";

/**
 * The request handler for SendEmailRequestHandler.
 */
export default class SendEmailRequestHandler<TResponse extends SendEmailResponse> extends ExtensionRequestHandlerBase<TResponse> {
    /**
     * Gets the supported request type.
     * @return {ExtensionRequestType<TResponse>} The supported abstract or concrete request type.
     */
    public supportedRequestType(): ExtensionRequestType<TResponse> {
        return SendEmailRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {SendEmailRequest<TResponse>} request The SendEmail request.
     * @return {Promise<ClientEntities.ICancelableDataResult<TResponse>>} The promise with a cancelable result containing the response.
     */
    public executeAsync(request: SendEmailRequest<TResponse>): Promise<ClientEntities.ICancelableDataResult<TResponse>> {
        let message: string = "Sending email to: " + request.emailAddress + "\nMessage: " + request.message;
        return MessageDialog.show(this.context, message).then((): Promise<ClientEntities.ICancelableDataResult<TResponse>> => {
            let response: SendEmailResponse = new SendEmailResponse();
            return Promise.resolve(<ClientEntities.ICancelableDataResult<TResponse>>{ canceled: false, data: response });
        });
    }
}