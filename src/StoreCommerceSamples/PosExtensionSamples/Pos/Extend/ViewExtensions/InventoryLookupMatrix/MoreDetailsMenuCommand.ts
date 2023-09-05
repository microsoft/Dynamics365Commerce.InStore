/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    InventoryLookupMatrixExtensionMenuCommandBase,
    IInventoryLookupMatrixExtensionMenuCommandState,
    IInventoryLookupMatrixExtensionMenuCommandContext,
    InventoryLookupMatrixItemAvailabilitySelectedData,
    InventoryLookupMatrixStoreChangedData
} from "PosApi/Extend/Views/InventoryLookupMatrixView";
import { ProxyEntities } from "PosApi/Entities";
import { IMessageDialogOptions, ShowMessageDialogClientRequest, ShowMessageDialogClientResponse } from "PosApi/Consume/Dialogs";


/**
 * A sample extension menu command for the the InventoryLookupMatrixView that shows additional information about the selected item availability.
 */
export default class MoreDetailsMenuCommand extends InventoryLookupMatrixExtensionMenuCommandBase {
    public readonly label: string;
    public readonly id: string;

    private _selectedAvailability: ProxyEntities.ItemAvailability;
    private _store: ProxyEntities.OrgUnit;

    /**
     * Creates a new instance of the MoreDetailsMenuCommand class.
     * @param {IInventoryLookupMatrixExtensionCommandContext} context The extension context.
     */
    constructor(context: IInventoryLookupMatrixExtensionMenuCommandContext) {
        super(context);

        // Initialize the label that represents the command in the POS menu.
        this.label = "More details";

        // Initialize the menu command identifier. This is used as the command's element id.
        this.id = "moreDetailsMenuCommand";

        // Add a handler for the ItemAvailabilitySelected message in order to be notified when the user selects an item availability.
        this.itemAvailabilitySelectedHandler = (data: InventoryLookupMatrixItemAvailabilitySelectedData): void => {
            this._selectedAvailability = data.itemAvailability;
            this.canExecute = !this.canExecute;
        };

        // Add a handler for the StoreChanged message in order to be notified when the store context is changed.
        this.storeChangedHandler = (data: InventoryLookupMatrixStoreChangedData): void => {
            this._store = data.store;
        };
    }

    /**
     * Initializes the menu command state with the initial state of the InventoryLookupMatrix page.
     * @param {IInventoryLookupMatrixExtensionMenuCommandState} state The initial state.
     */
    protected init(state: IInventoryLookupMatrixExtensionMenuCommandState): void {
        this.context.logger.logInformational("MoreDetailsMenuCommand.init was called.");
        this._store = state.store;
    }

    /**
     * Executes the menu command logic.
     * @remarks This is the function that gets executed when the user clicks the menu command.
     */
    protected execute(): void {
        const CORRELATION_ID: string = this.context.logger.getNewCorrelationId();
        this.context.logger.logInformational("MoreDetailsMenuCommand.execute was called.", CORRELATION_ID);

        // Set isProcessing to true to notify POS that the command execution is processing.
        this.isProcessing = true;
        let options: IMessageDialogOptions = {
            title: "More details",
            subTitle: "Item availability details",
            message: JSON.stringify(this._selectedAvailability),
            button1: {
                id: "OKButtonId",
                label: "OK",
                isPrimary: true,
                result: "OKButtonResult"
            }
        };

        let request: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse> = new ShowMessageDialogClientRequest(options, CORRELATION_ID);
        this.context.runtime.executeAsync(request).then((result): void => {
            // Set isProcessing to false to notify POS that the command execution has completed.
            this.isProcessing = false;
            this.context.logger.logInformational("MoreDetailsMenuCommand.execute show message dialog request completed successfully.", CORRELATION_ID);
        }).catch((reason: any): void => {
            // Set isProcessing to false to notify POS that the command execution has completed.
            this.isProcessing = false;
            this.context.logger.logError("MoreDetailsMenuCommand.execute show message dialog request execution failed.", CORRELATION_ID);
        });
    }
}