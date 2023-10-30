/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    ShowTextInputDialogClientRequest, ShowTextInputDialogClientResponse, ITextInputDialogOptions,
    ShowTextInputDialogError, ITextInputDialogResult
} from "PosApi/Consume/Dialogs";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ClientEntities } from "PosApi/Entities";

export default class TextInputDialog {
    /**
     * Shows the text input dialog.
     * @param context The extension context.
     * @param message The message to display in the dialog.
     * @returns {Promise<string>} The promise.
     */
    public show(context: IExtensionContext, message: string): Promise<string> {
        let promise: Promise<string> = new Promise<string>((resolve: (num: string) => void, reject: (reason?: any) => void) => {

            let textInputDialogOptions: ITextInputDialogOptions = {
                title: context.resources.getString("string_55"), // string that denotes the optional title on the text dialog
                subTitle: context.resources.getString("string_55"), // string that denotes the optional subtitle under the title
                label: "Enter Text",
                defaultText: "Hello World",
                onBeforeClose: this.onBeforeClose.bind(this)
            };

            let dialogRequest: ShowTextInputDialogClientRequest<ShowTextInputDialogClientResponse> =
                new ShowTextInputDialogClientRequest<ShowTextInputDialogClientResponse>(textInputDialogOptions);

            context.runtime.executeAsync(dialogRequest)
                .then((result: ClientEntities.ICancelableDataResult<ShowTextInputDialogClientResponse>) => {
                    if (!result.canceled) {
                        context.logger.logInformational("Text Entered in Box: " + result.data.result.value);
                        resolve(result.data.result.value);
                    } else {
                        context.logger.logInformational("Text Dialog is canceled.");
                        resolve(null);
                    }
                }).catch((reason: any) => {
                    context.logger.logError(JSON.stringify(reason));
                    reject(reason);
                });
        });

        return promise;
    }
    /**
     * Decides what to do with the dialog based on the button pressed and input.
     * @param {ClientEntities.ICancelableDataResult<ITextInputDialogResult>} result Input result of dialog.
     * @returns {Promise<void>} The returned promise.
     */
    private onBeforeClose(result: ClientEntities.ICancelableDataResult<ITextInputDialogResult>): Promise<void> {
        if (!result.canceled) {
            if (!ObjectExtensions.isNullOrUndefined(result.data)) {
                if (result.data.value === "Hello World") {
                    let error: ShowTextInputDialogError = new ShowTextInputDialogError("Invalid input. Enter different value.",
                        "New Hello World" /* new default value */);
                    return Promise.reject(error);
                } else {
                    return Promise.resolve();
                }
            } else {
                // Should not reach this branch
                let error: ShowTextInputDialogError = new ShowTextInputDialogError("Data result is null.");
                return Promise.reject(error);
            }
        } else {
            // Note that if result.cancelled is true, then result.data is null
            let error: ShowTextInputDialogError = new ShowTextInputDialogError("Cannot close dialog. Must enter value");
            return Promise.reject(error);
        }
    }
}