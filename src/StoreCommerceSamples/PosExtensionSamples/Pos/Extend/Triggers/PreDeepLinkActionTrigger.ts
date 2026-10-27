/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    PreDeepLinkActionTrigger as PreDeepLinkActionTriggerBase,
    IPreDeepLinkActionTriggerOptions
} from "PosApi/Extend/Triggers/DeepLinkActionTriggers";
import { ClientEntities } from "PosApi/Entities";
import { TriggerToastNotificationClientRequest, TriggerToastNotificationClientResponse } from "PosApi/Consume/Device";

/**
 * Mock configuration for item minimum quantities
 * In real scenario, this would come from product configuration, custom attributes, or external service
 */
const ITEM_MIN_QUANTITY_CONFIG: { [productId: number]: number } = {
    22565421963: 5,  // Product 22565421963 requires minimum 5 units
    22565421964: 2,  // Product 22565421964 requires minimum 2 units
    81655: 3         // Product 81655 requires minimum 3 units
};

/**
 * Generic PreDeepLinkAction trigger that handles multiple deep link actions
 * Demonstrates EXTEND pattern with routing to specific action handlers
 *
 * This trigger fires BEFORE any deep link action executes.
 * Use a switch statement to route different actions to specific handler methods.
 * This pattern allows one trigger to handle validation/modification for multiple actions.
 *
 * **Example**: Validates item minimum quantities for D365.CreateTransaction
 */
export default class PreDeepLinkActionTrigger extends PreDeepLinkActionTriggerBase {

    /**
     * Executes before any deep link action
     * Routes to specific handlers based on action name
     * @param {IPreDeepLinkActionTriggerOptions} options Trigger options containing action name and parameters
     * @returns {Promise<ClientEntities.ICancelable>} Cancelable result - can modify parameters or cancel action
     */
    public async execute(options: IPreDeepLinkActionTriggerOptions): Promise<ClientEntities.ICancelable> {
        this.context.logger.logInformational(
            `Deep Link Sample: PreDeepLinkAction trigger fired for action: ${options.actionName}`
        );

        // Route to specific action handlers using switch statement
        switch (options.actionName) {
            case "D365.CreateTransaction":
                return await this._handleCreateTransaction(options);

            default:
                // For actions we don't handle, allow them to proceed
                return { canceled: false };
        }
    }

    /**
     * Handles D365.CreateTransaction action
     * Validates and adjusts item quantities based on minimum requirements
     *
     * **Business Scenario**:
     * Some products have minimum order quantities configured.
     * This handler validates quantities before creating the transaction and:
     * - Automatically adjusts quantity to minimum if item has min-qty requirement
     * - Shows a toast notification to inform the user about the adjustment
     * - Allows the transaction to proceed with corrected quantities
     *
     * @param {IPreDeepLinkActionTriggerOptions} options Trigger options with CreateTransaction parameters
     * @returns {Promise<ClientEntities.ICancelable>} Cancelable result - action proceeds with potentially modified parameters
     */
    private async _handleCreateTransaction(options: IPreDeepLinkActionTriggerOptions): Promise<ClientEntities.ICancelable> {
        this.context.logger.logInformational(
            "Deep Link Sample: Validating item minimum quantities for CreateTransaction"
        );

        // Type-cast parameters to CreateTransaction interface
        const params = options.parameters as Commerce.Framework.DeepLink.ICreateTransactionActionParameters;

        // Validate items if present
        if (!params.items || params.items.length === 0) {
            // No items to validate
            return { canceled: false };
        }

        // Track items that were adjusted
        const adjustedItems: string[] = [];

        // Validate and adjust quantities for each item
        for (const item of params.items) {
            const minQuantity = ITEM_MIN_QUANTITY_CONFIG[item.productId];

            if (minQuantity) {
                const requestedQty = item.quantity || 1;

                if (requestedQty < minQuantity) {
                    // Adjust quantity to minimum
                    item.quantity = minQuantity;
                    adjustedItems.push(`Product ${item.productId}: ${requestedQty} → ${minQuantity}`);

                    this.context.logger.logInformational(
                        `Deep Link Sample: Adjusted quantity for product ${item.productId} from ${requestedQty} to ${minQuantity} (minimum required)`
                    );
                }
            }
        }

        // Show toast notification if any items were adjusted
        if (adjustedItems.length > 0) {
            await this._showMinQuantityToast(adjustedItems);
        }

        // Allow the action to proceed with adjusted quantities
        return { canceled: false };
    }

    /**
     * Shows a toast notification informing user about quantity adjustments
     * @param {string[]} adjustedItems List of items that had quantity adjustments
     * @returns {Promise<void>}
     */
    private async _showMinQuantityToast(adjustedItems: string[]): Promise<void> {
        const message = adjustedItems.length === 1
            ? `Quantity adjusted to meet minimum requirement:\n${adjustedItems[0]}`
            : `${adjustedItems.length} items adjusted to meet minimum requirements:\n${adjustedItems.join('\n')}`;

        const toastContent: ClientEntities.IToastNotificationComponentContent = {
            notificationTitle: "Minimum Quantity Applied",
            notificationBody: message,
            notificationMessageType: ClientEntities.ToastMessageType.INFO
        };

        const correlationId = this.context.logger.getNewCorrelationId();
        const request = new TriggerToastNotificationClientRequest<TriggerToastNotificationClientResponse>(correlationId, toastContent);

        await this.context.runtime.executeAsync(request);
    }
}
