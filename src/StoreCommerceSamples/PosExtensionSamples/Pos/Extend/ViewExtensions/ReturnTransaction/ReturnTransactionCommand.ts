/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as ReturnTransactionView from "PosApi/Extend/Views/ReturnTransactionView";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import { ProxyEntities } from "PosApi/Entities";
import { StringExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import MessageDialog from "../../../Create/Dialogs/DialogSample/MessageDialog";

export default class ReturnTransactionCommand extends ReturnTransactionView.ReturnTransactionExtensionCommandBase {

    private _salesLines: ProxyEntities.SalesLine[] = [];
    private _receiptNumber: string = StringExtensions.EMPTY;
    private _salesOrder: ProxyEntities.SalesOrder = null;

    /**
     * Creates a new instance of the ReturnTransactionCommand class.
     * @param {IExtensionCommandContext<ReturnTransactionView.IReturnTransactionToExtensionCommandMessageTypeMap>} context The context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<ReturnTransactionView.IReturnTransactionToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "sampleReturnTransactionCommand";
        this.label = "Sample return transaction command";
        this.extraClass = "iconLightningBolt";
    }

    /**
     * Initializes the command.
     * @param {ReturnTransactionView.IReturnTransactionExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: ReturnTransactionView.IReturnTransactionExtensionCommandState): void {
        this.isVisible = true;
        this.canExecute = true;

        this._receiptNumber = state.receiptNumber;
        this._salesOrder = state.salesOrder;

        this.transactionLineSelectedHandler = (data: ReturnTransactionView.ReturnTransactionTransactionLineSelectedData): void => {
            this._salesLines = data.salesLines;
        };

        this.transactionLineSelectionClearedHandler = () => {
            this._salesLines = [];
        };

        this.transactionSelectedHandler = (data: ReturnTransactionView.ReturnTransactionTransactionSelectedData): void => {
            this._salesOrder = data.salesOrder;
        };

        this.transactionSelectionClearedHandler = () => {
            this._salesOrder = null;
        };
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        let salesOrderId: string = !ObjectExtensions.isNullOrUndefined(this._salesOrder) ? this._salesOrder.Id : StringExtensions.EMPTY;
        let message: string = `Receipt number: ${this._receiptNumber}; Selected sales order: ${salesOrderId}; Return transaction selected data:`
            + this._salesLines.map((value: ProxyEntities.SalesLine) => { return ` ItemId: ${value.ItemId}`; });
        MessageDialog.show(this.context, message);
    }
}