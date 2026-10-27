/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/ApplicationTriggers";
import { ClientEntities } from "PosApi/Entities";
import { ShowMessageDialogClientRequest, ShowMessageDialogClientResponse } from "PosApi/Consume/Dialogs";

/**
 * Shows a message from the second extension package after the user logs on.
 */
export default class PostLogOnMessageTrigger extends Triggers.PostLogOnTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPostLogOnTriggerOptions} options The options provided to the trigger.
     * @returns {Promise<void>} The promise that resolves after the user closes the message.
     */
    public execute(options: Triggers.IPostLogOnTriggerOptions): Promise<void> {
        let dialogOptions: ClientEntities.Dialogs.IMessageDialogOptions = {
            title: "Second extension package",
            message: "The Contoso.MyMobileAppSecondExtensions extension package is loaded.",
            button1: {
                id: "OK_BUTTON",
                label: "OK",
                isPrimary: true,
                result: "OK"
            }
        };

        let showMessageRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse> = new ShowMessageDialogClientRequest(dialogOptions);
        return this.context.runtime.executeAsync(showMessageRequest).then((): void => {
            return;
        });
    }
}
