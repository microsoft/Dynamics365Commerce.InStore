import { IMessageDialogOptions, ShowMessageDialogClientRequest, ShowMessageDialogClientResponse } from "PosApi/Consume/Dialogs";
import { ClientEntities } from "PosApi/Entities";
import { IPreSetQuantityTriggerOptions, PreSetQuantityTrigger } from "PosApi/Extend/Triggers/ProductTriggers";

/**
 * Example implementation of a PreSetQuantityTrigger trigger that shows a dialog asking the user to confirm the quantity change.
 */
export default class ConfirmChangeQuantityTrigger extends PreSetQuantityTrigger {
    private static dialogMessage: string = "Are you sure you want to change the quantity?\n\nChanging the quantity will require recalculation of the line charges.";
    private static yesButtonLabel: string = 'Yes';
    private static noButtonLabel: string = 'No';

    /**
     * Executes the trigger functionality.
     * @param {IPreSetQuantityTriggerOptions} options The options provided to the trigger.
     * @return {Promise<ICancelable>} The cancelable promise.
     */
    public execute(options: IPreSetQuantityTriggerOptions): Promise<ClientEntities.ICancelable> {
        this.context.logger.logInformational("Executing ConfirmChangeQuantityTrigger with options " + JSON.stringify(options) + ".");

        // Configure options for dialog that will confirm user wants to change quantity.
        let dialogOptions: IMessageDialogOptions = {
            message: ConfirmChangeQuantityTrigger.dialogMessage,
            showCloseX: false,
            button1: {
                id: 'yesButton',
                label: ConfirmChangeQuantityTrigger.yesButtonLabel,
                result: ConfirmChangeQuantityTrigger.yesButtonLabel,
                isPrimary: true
            },
            button2: {
                id: 'noButton',
                label: ConfirmChangeQuantityTrigger.noButtonLabel,
                result: ConfirmChangeQuantityTrigger.noButtonLabel,
                isPrimary: false
            }
        };

        // Construct show dialog request.
        let showMessageDialogClientRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse> =
            new ShowMessageDialogClientRequest(dialogOptions);

        // Show the confirmation dialog to the user and process the result.
        return this.context.runtime.executeAsync(showMessageDialogClientRequest).then((value) => {
            // If user clicks 'Yes', continue with the Set Quantity flow.
            if (!value.canceled && value.data.result.dialogResult == ConfirmChangeQuantityTrigger.yesButtonLabel) {
                return Promise.resolve({ canceled: false });
            // ... else if user clicks 'No', cancel the Set Quantity flow.
            } else {
                return Promise.resolve({ canceled: true })
            }
        // Continue with the Set Quantity flow if any errors occur with the confirmation dialog.
        }).catch((reason: any) => {
            return Promise.resolve({ canceled: false })
        });
    }
}
