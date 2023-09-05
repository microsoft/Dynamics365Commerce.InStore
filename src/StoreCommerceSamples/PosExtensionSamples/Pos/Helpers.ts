/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ShowMessageDialogClientRequest, ShowMessageDialogClientResponse, IMessageDialogOptions } from "PosApi/Consume/Dialogs";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { ClientEntities } from "PosApi/Entities";

/**
 * A class containing helper functions for error handling.
 */
export class ErrorHelper {
    /**
     * Displays an error message corresponding to the provided reason.
     * @param {IExtensionContext} context The extension context.
     * @param {any} reason The error/reason to display.
     * @returns {Promise<ClientEntities.ICancelable>} The promise representing the completion of displaying the error message.
     */
    public static displayErrorAsync(context: IExtensionContext, reason: any): Promise<ClientEntities.ICancelable> {
        let messageDialogOptions: IMessageDialogOptions;
        if (reason instanceof ClientEntities.ExtensionError) {
            messageDialogOptions = {
                message: reason.localizedMessage
            };
        } else if (reason instanceof Error) {
            messageDialogOptions = {
                message: reason.message
            };
        } else if (typeof reason === "string") {
            messageDialogOptions = {
                message: reason
            };
        } else {
            messageDialogOptions = {
                message: "An unexpected error occurred."
            };
        }

        let errorMessageRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse>
            = new ShowMessageDialogClientRequest(messageDialogOptions);

        return context.runtime.executeAsync(errorMessageRequest);
    }
}