/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { RecallOrderReplacementDeepLinkActionHandler } from "PosApi/Extend/DeepLink";
import { ShowMessageDialogClientRequest, ShowMessageDialogClientResponse } from "PosApi/Consume/Dialogs";
import { StringExtensions } from "PosApi/TypeExtensions";

/**
 * Sample replacement handler for D365.RecallOrder deep link action.
 *
 * This demonstrates the EXTEND/REPLACEMENT pattern - completely overrides the built-in RecallOrder action.
 *
 * IMPORTANT: Extend the specific replacement handler class exposed in PosApi/Extend/DeepLink
 * for the action you are replacing.
 *
 * Usage example (base64 encoded JSON):
 * {
 *   "salesId": "SO-12345"
 * }
 *
 * This sample adds custom validation and logging before recalling the order.
 */
export default class RecallOrderReplacementHandler extends RecallOrderReplacementDeepLinkActionHandler {
    /**
     * Executes the replacement handler for RecallOrder.
     * @param {Commerce.Framework.DeepLink.IRecallOrderActionParameters} parameters The deep link action parameters.
     * @returns {Promise<void>} A promise that resolves when the action is complete.
     */
    public execute(parameters: Commerce.Framework.DeepLink.IRecallOrderActionParameters): Promise<void> {
        this.context.logger.logInformational(
            "RecallOrderReplacementHandler: Overriding D365.RecallOrder action. Parameters: " + JSON.stringify(parameters)
        );

        if (StringExtensions.isNullOrWhitespace(parameters.salesId)) {
            const errorMessage: string = "RecallOrder requires 'salesId' parameter.\n\n" +
                "Example JSON (base64 encode this):\n" +
                "{\"salesId\": \"SO-12345\"}";
            this.context.logger.logError(errorMessage);

            const dialogRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse> =
                new ShowMessageDialogClientRequest({
                    title: "RecallOrder Replacement - Error",
                    message: errorMessage,
                    button1: { id: "ok", label: "OK", result: "ok" }
                });

            return this.context.runtime.executeAsync(dialogRequest).then(() => {
                return Promise.reject(new Error(errorMessage));
            });
        }

        const message: string =
            "🎯 REPLACEMENT HANDLER ACTIVE!\n\n" +
            "This completely replaces the built-in D365.RecallOrder action.\n\n" +
            "Parameters received:\n" +
            "• Sales ID: " + parameters.salesId + "\n" +
            "\nPress OK to recall the order.";

        const dialogRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse> =
            new ShowMessageDialogClientRequest({
                title: "RecallOrder Replacement Handler",
                message: message,
                button1: { id: "ok", label: "OK", result: "ok" }
            });

        return this.context.runtime.executeAsync(dialogRequest).then(() => {
            this.context.logger.logInformational(
                "RecallOrderReplacementHandler: User confirmed. Sales ID: " + parameters.salesId
            );

            const completeMessage: string =
                "✅ Order Recalled (Simulated)\n\n" +
                "Sales ID: " + parameters.salesId + "\n\n" +
                "This is where the real implementation would:\n" +
                "1. Search for sales order: " + parameters.salesId + "\n" +
                "2. Recall the order to cart\n" +
                "3. Navigate to transaction view\n" +
                "4. Apply any custom business rules";

            const completeRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse> =
                new ShowMessageDialogClientRequest({
                    title: "Order Recalled",
                    message: completeMessage,
                    button1: { id: "ok", label: "OK", result: "ok" }
                });

            return this.context.runtime.executeAsync(completeRequest).then(() => {
                return Promise.resolve();
            });
        }).catch((error: any) => {
            this.context.logger.logError(
                "RecallOrderReplacementHandler: Error: " + JSON.stringify(error)
            );
            return Promise.reject(error);
        });
    }
}
