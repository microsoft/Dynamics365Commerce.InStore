/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { DeepLinkActionHandlerBase, IDeepLinkActionContext, IDeepLinkActionParameters } from "PosApi/Create/DeepLink";
import { ShowMessageDialogClientRequest, ShowMessageDialogClientResponse } from "PosApi/Consume/Dialogs";
import { ClientEntities } from "PosApi/Entities";

/**
 * Parameters for LogInventoryCheck action
 */
interface ILogInventoryCheckParameters extends IDeepLinkActionParameters {
    itemNumber: string;
    storeId?: string;
}

/**
 * Deep link action handler demonstrating CREATE pattern
 * Shows a message dialog without requiring custom views
 *
 * Example deep link:
 * ms-d365sc://executeAction?actionName=Contoso.PosExtensions.LogInventoryCheck&param=eyJpdGVtTnVtYmVyIjoiMDAwMSIsInN0b3JlSWQiOiJTRUFUVExFIn0=
 *
 * Decoded parameters:
 * {
 *   "itemNumber": "0001",
 *   "storeId": "SEATTLE"
 * }
 */
export default class LogInventoryCheckActionHandler extends DeepLinkActionHandlerBase {
    public readonly actionName = "LogInventoryCheck";

    /**
     * Executes the LogInventoryCheck action
     * @param {IDeepLinkActionParameters} parameters Parameters from the deep link
     * @returns {Promise<void>} Promise that resolves when action completes
     */
    public async execute(parameters: IDeepLinkActionParameters): Promise<void> {
        const params = parameters as ILogInventoryCheckParameters;

        // Validate required parameters
        if (!params.itemNumber) {
            throw new Error("Missing required parameter: itemNumber");
        }

        const itemNumber = params.itemNumber;
        const storeId = params.storeId || "Current Store";

        // Log to console for diagnostics
        this.context.logger.logInformational(
            `Deep Link Sample: Inventory check requested for item ${itemNumber} at store ${storeId}`
        );

        // Show message dialog to user
        const message = `Inventory check: Item ${itemNumber} at ${storeId}`;
        const request = new ShowMessageDialogClientRequest<ShowMessageDialogClientResponse>({
            title: "Deep Link Action Executed",
            message: message,
            showCloseX: true
        });

        await this.context.runtime.executeAsync(request);

        this.context.logger.logInformational(
            `Deep Link Sample: LogInventoryCheck action completed successfully`
        );
    }
}
