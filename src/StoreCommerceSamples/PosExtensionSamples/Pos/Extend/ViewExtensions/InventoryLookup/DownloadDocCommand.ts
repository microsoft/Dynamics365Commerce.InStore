/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ProxyEntities } from "PosApi/Entities";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as InventoryLookupView from "PosApi/Extend/Views/InventoryLookupView";
import { ObjectExtensions } from "PosApi/TypeExtensions";

export default class DownloadDocCommand extends InventoryLookupView.InventoryLookupExtensionCommandBase {

    private _locationAvailability: ProxyEntities.OrgUnitAvailability;
    private _locationAvailabilities: ProxyEntities.OrgUnitAvailability[];

    /**
     * Creates a new instance of the DownloadDocCommand class.
     * @param {IExtensionCommandContext<Extensibility.IInventoryLookupToExtensionCommandMessageTypeMap>} context The command context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<InventoryLookupView.IInventoryLookupToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "DownloadDocCommand";
        this.label = "Download document";
        this.extraClass = "iconInvoice";

        this.productChangedHandler = (data: InventoryLookupView.InventoryLookupProductChangedData): void => {
            this._productChanged(data);
        };

        this.locationSelectionHandler = (data: InventoryLookupView.InventoryLookupLocationSelectedData): void => {
            this._locationAvailability = data.locationAvailability;
            this.isVisible = !ObjectExtensions.isNullOrUndefined(this._locationAvailability);
        };
    }

    /**
     * Initializes the command.
     * @param {Extensibility.IInventoryLookupExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: InventoryLookupView.IInventoryLookupExtensionCommandState): void {
        this._locationAvailabilities = state.locationAvailabilities;
        this.isVisible = true;
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        this.isProcessing = true;
        window.setTimeout((): void => {
            this.isProcessing = false;
        }, 2000);
    }

    /**
     * Handles the product changed message by sending a message by updating the command state.
     * @param {Extensibility.InventoryLookupProductChangedData} data The information about the selected product.
     */
    private _productChanged(data: InventoryLookupView.InventoryLookupProductChangedData): void {
        this._locationAvailabilities = data.locationAvailabilities;
        this.canExecute = true;
        this.isVisible = true;
    }
}