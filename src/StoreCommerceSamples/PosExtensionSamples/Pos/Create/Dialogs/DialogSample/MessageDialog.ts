/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS. MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED. YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ShowMessageDialogClientRequest, ShowMessageDialogClientResponse, IMessageDialogOptions } from "PosApi/Consume/Dialogs";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { ClientEntities } from "PosApi/Entities";

export default class MessageDialog {
    /**
     * Shows the message dialog.
     * @param context The extension context.
     * @param message The message to display in the dialog.
     * @returns {Promise<string>} The promise.
     */
    public static show(context: IExtensionContext, message: string): Promise<string> {
        let promise: Promise<string> = new Promise<string>((resolve: (value: string) => void, reject: (reason?: any) => void) => {
                    let messageDialogOptions: IMessageDialogOptions = {
                        title: "Extension Message Dialog",
                        message: message,
                        showCloseX: true, // Result for dialog will be return as canceled when "X" is clicked to close dialog.
                        button1: {
                            id: "button1OK",
                            label: "OK",
                            result: "OKResult"
                        },
                        button2: {
                            id: "Button2Cancel",
                            label: "Cancel",
                            result: "CancelResult"
                        }
                    };

                    let dialogRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse> =
                        new ShowMessageDialogClientRequest<ShowMessageDialogClientResponse>(messageDialogOptions);

                    context.runtime.executeAsync(dialogRequest).then((result: ClientEntities.ICancelableDataResult<ShowMessageDialogClientResponse>) => {
                        if (!result.canceled) {
                            context.logger.logInformational("MessageDialog result: " + result.data.result.dialogResult);
                            resolve(result.data.result.dialogResult);
                        } else {
                            context.logger.logInformational("Request for MessageDialog is canceled.");
                            resolve(null);
                        }

                    }).catch((reason: any) => {
                        context.logger.logError(JSON.stringify(reason));
                        reject(reason);
                    });
                });

        return promise;
    }
}