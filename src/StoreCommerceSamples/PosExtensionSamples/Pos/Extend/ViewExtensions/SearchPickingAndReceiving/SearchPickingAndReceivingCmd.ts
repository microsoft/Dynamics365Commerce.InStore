/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities } from "PosApi/Entities";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as SearchPickingAndReceivingView from "PosApi/Extend/Views/SearchPickingAndReceivingView";
import MessageDialog from "../../../Create/Dialogs/DialogSample/MessageDialog";

export default class SearchPickingAndReceivingViewCommand extends SearchPickingAndReceivingView.SearchPickingAndReceivingExtensionCommandBase {

    private _order: ClientEntities.IPickingAndReceivingOrder;

    /**
     * Creates a new instance of the SearchPickingAndReceivingViewCommand class.
     * @param {IExtensionCommandContext<SearchPickingAndReceivingView.ISearchPickingAndReceivingToExtensionCommandMessageTypeMap>} context The command context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<SearchPickingAndReceivingView.ISearchPickingAndReceivingToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "sampleSearchPickingAndReceivingCommand";
        this.label = "Sample search picking and receiving command";
        this.extraClass = "iconLightningBolt";
    }

    /**
     * Initializes the command.
     * @param {SearchPickingAndReceivingView.ISearchPickingAndReceivingExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: SearchPickingAndReceivingView.ISearchPickingAndReceivingExtensionCommandState): void {
        this.isVisible = true;

        this.orderLineSelectedHandler = (data: SearchPickingAndReceivingView.OrderLineSelectedData): void => {
            this.canExecute = true;
            this._order = data.order;
        };

        this.orderLineSelectionClearedHandler = (): void => {
            this.canExecute = false;
            this._order = null;
        };
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        let message: string = this._order.orderId + " : " + this._order.orderType;
        MessageDialog.show(this.context, message);
    }
}