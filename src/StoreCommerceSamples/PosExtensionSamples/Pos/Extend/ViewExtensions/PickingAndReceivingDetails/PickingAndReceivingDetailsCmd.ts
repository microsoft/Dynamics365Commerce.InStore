/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities } from "PosApi/Entities";
import { ProxyEntities } from "PosApi/Entities";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as PickingAndReceivingDetailsView from "PosApi/Extend/Views/PickingAndReceivingDetailsView";
import MessageDialog from "../../../Create/Dialogs/DialogSample/MessageDialog";

export default class PickingAndReceivingDetailsViewCommand extends PickingAndReceivingDetailsView.PickingAndReceivingDetailsExtensionCommandBase {

    private _selectedJournalLine: ClientEntities.IPickingAndReceivingOrderLine;
    private _journalLines: ClientEntities.IPickingAndReceivingOrderLine[];
    private _journal: ClientEntities.IPickingAndReceivingOrder;
    private _receipt: ProxyEntities.Receipt;

    /**
     * Creates a new instance of the PickingAndReceivingDetailsViewCommand class.
     * @param {IExtensionCommandContext<PickingAndReceivingDetailsView.IPickingAndReceivingDetailsToExtensionCommandMessageTypeMap>} context The context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<PickingAndReceivingDetailsView.IPickingAndReceivingDetailsToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "samplePickingAndReceivingDetailsCommand";
        this.label = "Sample picking and receiving details command";
        this.extraClass = "iconLightningBolt";
    }

    /**
     * Initializes the command.
     * @param {PickingAndReceivingDetailsView.IPickingAndReceivingDetailsExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: PickingAndReceivingDetailsView.IPickingAndReceivingDetailsExtensionCommandState): void {
        this.isVisible = true;
        this._journal = state.journal;

        this.journalLinesChangedHandler = (data: PickingAndReceivingDetailsView.JournalLinesChangedData): void => {
            this._journalLines = data.journalLines;
        };

        this.journalSavedHandler = (data: PickingAndReceivingDetailsView.JournalSavedData): void => {
            this._journal = data.journal;
        };

        this.journalLineSelectedHandler = (data: PickingAndReceivingDetailsView.JournalLineSelectedData): void => {
            this.canExecute = true;
            this._selectedJournalLine = data.journalLine;
        };

        this.journalLineSelectionClearedHandler = (): void => {
            this.canExecute = false;
            this._selectedJournalLine = null;
        };

        this.receiptSelectionHandler = (data: PickingAndReceivingDetailsView.PickingAndReceivingDetailsReceiptSelectedData): void => {
            this.isVisible = false;
            this._receipt = data.receipt;
        };

        this.receiptSelectionClearedHandler = (): void => {
            this.isVisible = true;
        };
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        let message: string = this._journal.lines + " : " + this._selectedJournalLine.productNumber + " : " + this._selectedJournalLine.quantityOrdered;
        MessageDialog.show(this.context, message);
    }
}