/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as StockCountDetailsView from "PosApi/Extend/Views/StockCountDetailsView";
import { ProxyEntities, ClientEntities } from "PosApi/Entities";
import MessageDialog from "../../../Create/Dialogs/DialogSample/MessageDialog";
import { ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";

export default class StockCountDetailsCommand extends StockCountDetailsView.StockCountDetailsExtensionCommandBase {
    private _isNewJournal: Boolean = false;
    private _isAdvancedWarehousingEnabled: Boolean = false;
    private _journal: ProxyEntities.StockCountJournal = null;
    private _journalLines: ClientEntities.IStockCountLine[] = [];
    private _selectedJournalLines: ClientEntities.IStockCountLine[] = [];

    /**
     * Creates a new instance of the StockCountDetailsCommand class.
     * @param {IExtensionCommandContext<StockCountDetailsView.IStockCountDetailsToExtensionCommandMessageTypeMap>} context The context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<StockCountDetailsView.IStockCountDetailsToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "sampleStockCountDetailsCommand";
        this.label = "Sample StockCountDetails Command";
        this.extraClass = "iconLightningBolt";

        this.journalLineSelectedHandler = (data: StockCountDetailsView.StockCountDetailsJournalLineSelectedData): void => {
            this._selectedJournalLines = data.journalLines;
        };

        this.journalLineSelectionClearedHandler = () => {
            this._selectedJournalLines = [];
        };

        this.journalLinesUpdatedHandler = (data: StockCountDetailsView.StockCountDetailsJournalLinesUpdatedData): void => {
            this._journalLines = data.journalLines;
        };

        this.journalSavedHandler = (data: StockCountDetailsView.StockCountDetailsJournalSavedData): void => {
            this._journalLines = data.journalLines;
        };
    }

    /**
     * Initializes the command.
     * @param {StockCountDetailsView.IStockCountDetailsExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: StockCountDetailsView.IStockCountDetailsExtensionCommandState): void {
        this.isVisible = true;
        this.canExecute = true;

        this._isNewJournal = state.isNewJournal;
        this._isAdvancedWarehousingEnabled = state.isAdvancedWarehousingEnabled;
        this._journal = state.journal;
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        let journalId: string = ObjectExtensions.isNullOrUndefined(this._journal) ? StringExtensions.EMPTY : this._journal.JournalId;
        let message: string = `JournalId: ${journalId}; IsNewJournal: ${this._isNewJournal}; `
            + `IsAdvancedWarehousingEnabled: ${this._isAdvancedWarehousingEnabled}; StockCountLine:`
            + this._journalLines.map((value: ClientEntities.IStockCountLine) => { return ` ${ value.itemId}`; })
            + " SelectedJournalLines:" + this._selectedJournalLines.map((value: ClientEntities.IStockCountLine) => { return ` ${value.itemId}`; });
        MessageDialog.show(this.context, message);
    }
}