/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    ShowNumericInputDialogClientRequest, ShowNumericInputDialogClientResponse,
    INumericInputDialogOptions, INumericInputDialogResult, ShowNumericInputDialogError
} from "PosApi/Consume/Dialogs";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ClientEntities } from "PosApi/Entities";

export default class NumericInputDialog {
    /**
     * Shows the numeric input dialog.
     * @param context The extension context.
     * @param message The message to display in the dialog.
     * @returns {Promise<string>} The promise.
     */
    public show(context: IExtensionContext, message: string): Promise<string> {
        let promise: Promise<string> = new Promise<string>((resolve: (num: string) => void, reject: (reason?: any) => void) => {
            let subTitleMsg: string = "Enter voice call verification code or void transaction.\n\n"
                + "The merchant is responsible for entering a valid Auth Code.\n\n"
                + "If an invalid auth code is sent to the bank, the batch cannot be settled and the merchant may get fined ($50 for each instance currently).";

            let numericInputDialogOptions: INumericInputDialogOptions = {
                title: "Voice Call",
                subTitle: subTitleMsg,
                numPadLabel: "Please enter code:",
                defaultNumber: "0000",
                onBeforeClose: this.onBeforeClose.bind(this)
            };

            let dialogRequest: ShowNumericInputDialogClientRequest<ShowNumericInputDialogClientResponse> =
                new ShowNumericInputDialogClientRequest<ShowNumericInputDialogClientResponse>(numericInputDialogOptions);

            context.runtime.executeAsync(dialogRequest)
                .then((result: ClientEntities.ICancelableDataResult<ShowNumericInputDialogClientResponse>) => {
                    if (!result.canceled) {
                        context.logger.logInformational("NumericInputDialog result: " + result.data.result.value);
                        resolve(result.data.result.value);
                    } else {
                        context.logger.logInformational("NumericInputDialog is canceled.");
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
     * @param {ClientEntities.ICancelableDataResult<INumericInputDialogResult>} result Input result of dialog.
     * @returns {Promise<void>} The returned promise.
     */
    private onBeforeClose(result: ClientEntities.ICancelableDataResult<INumericInputDialogResult>): Promise<void> {
        if (!result.canceled) {
            if (!ObjectExtensions.isNullOrUndefined(result.data)) {
                if (result.data.value === "111") {
                    let error: ShowNumericInputDialogError = new ShowNumericInputDialogError
                        ("Invalid input. Enter different value.", "2121" /* new default value */);
                    return Promise.reject(error);
                } else {
                    return Promise.resolve();
                }
            } else {
                // Should not reach this branch.
                let error: ShowNumericInputDialogError = new ShowNumericInputDialogError("Data result is null.");
                return Promise.reject(error);
            }
        } else {
            // Note that if result.cancelled is true, then result.data is null.
            let error: ShowNumericInputDialogError = new ShowNumericInputDialogError("Cannot close dialog. Must enter value");
            return Promise.reject(error);
        }
    }
}