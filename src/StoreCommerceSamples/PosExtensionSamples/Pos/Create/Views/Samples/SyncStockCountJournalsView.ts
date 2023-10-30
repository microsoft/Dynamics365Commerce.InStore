/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as StockCountJournal from "PosApi/Consume/StockCountJournals";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import * as Views from "PosApi/Create/Views";
import { ArrayExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import ko from "knockout";

/**
 * The controller for SyncStockCountJournals.
 */
export default class SyncStockCountJournalsView extends Views.CustomViewControllerBase {
    public journals: ko.Observable<string>;

    /**
     * Creates a new instance of the SyncStockCountJournalsView class.
     * @param {Views.ICustomViewControllerContext} context The custom view controller context.
     * @param {any} [options] The options used to initialize the view state.
     */
    constructor(context: Views.ICustomViewControllerContext, options?: any) {
        super(context);
        this.state.title = "Sync Stock Count Journals";

        this.journals = ko.observable("");
    }

    /**
     * Bind the html element with view controller.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);
    }

    /**
     * Performs the sync operation.
     */
    public syncAllStockCountJournalsAsync(): void {
        let clientRequest: StockCountJournal.SyncAllStockCountJournalsClientRequest<StockCountJournal.SyncAllStockCountJournalsClientResponse> =
            new StockCountJournal.SyncAllStockCountJournalsClientRequest<StockCountJournal.SyncAllStockCountJournalsClientResponse>();
        this.context.runtime.executeAsync(clientRequest)
            .then((result: ClientEntities.ICancelableDataResult<StockCountJournal.SyncAllStockCountJournalsClientResponse>) => {
                let journalsList: string = "";
                if (!result.canceled && !ObjectExtensions.isNullOrUndefined(result.data) && ArrayExtensions.hasElements(result.data.result)) {
                    result.data.result.forEach((stockCountJournal: ProxyEntities.StockCountJournal) => {
                        journalsList = journalsList.concat(JSON.stringify(stockCountJournal));
                    });
                }
                this.journals(journalsList);
            }).catch((error: any) => {
                this.journals(JSON.stringify(error));
            });
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}
