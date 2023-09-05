/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as ShowJournalView from "PosApi/Extend/Views/ShowJournalView";


export default class DownloadDocumentCommand extends ShowJournalView.ShowJournalExtensionCommandBase {

    private _selectedJournal: ProxyEntities.SalesOrder;
    private _products: ProxyEntities.SimpleProduct[];
    private _customer: ProxyEntities.Customer;
    private _mode: ClientEntities.ShowJournalMode;

    /**
     * Creates a new instance of the DownloadDocumentCommand class.
     * @param {IExtensionCommandContext<Extensibility.IShowJournalToExtensionCommandMessageTypeMap>} context The command context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<ShowJournalView.IShowJournalToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "downloadDocumentCommand";
        this.label = "Download document";
        this.extraClass = "iconInvoice";

        this.journalSelectionHandler = (data: ShowJournalView.ShowJournalJournalSelectedData): void => {
            this._journalChanged(data);
        };

        this.journalSelectionClearedHandler = (): void => {
            this._selectedJournal = undefined;
            this._products = [];
            this._customer = undefined;
            this.canExecute = false;
        };

        this.receiptSelectionHandler = (data: ShowJournalView.ShowJournalReceiptSelectedData): void => {
            this.isVisible = false;
        };

        this.receiptSelectionClearedHandler = (): void => {
            this.isVisible = true;
        };

        this.journalTransactionsLoadedHandler = (data: ShowJournalView.ShowJournalJournalTransactionsLoadedData): void => {
            this.isVisible = this._mode === ClientEntities.ShowJournalMode.ShowJournal;
            this.context.logger.logInformational("Executing journalTransactionsLoadedHandler for DownloadDocumentCommand: "
                + JSON.stringify(data) + ".");
        };
    }

    /**
     * Initializes the command.
     * @param {Extensibility.IShowJournalExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: ShowJournalView.IShowJournalExtensionCommandState): void {
        this._mode = state.mode;
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
     * Handles the journal changed message by sending a message by updating the command state.
     * @param {Extensibility.ShowJournalJournalSelectedData} data The information about the selected journal.
     */
    private _journalChanged(data: ShowJournalView.ShowJournalJournalSelectedData): void {
        this._selectedJournal = data.salesOrder;
        this._products = data.products;
        this._customer = data.customer;
        this.canExecute = true;
    }
}