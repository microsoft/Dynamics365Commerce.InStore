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
import * as SearchView from "PosApi/Extend/Views/SearchView";
import MessageDialog from "../../../Create/Dialogs/DialogSample/MessageDialog";


export default class QuickCompareProductsCommand extends SearchView.ProductSearchExtensionCommandBase {

    private _productSearchResults: ProxyEntities.ProductSearchResult[];

    /**
     * Creates a new instance of the QuickCompareProductsCommand class.
     * @param {IExtensionCommandContext<CustomerDetailsView.IProductSearchToExtensionCommandMessageTypeMap>} context The command context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<SearchView.IProductSearchToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "quickCompareProducts";
        this.label = context.resources.getString("string_0");
        this.extraClass = "iconLightningBolt";

        this.searchResultsSelectedHandler = (data: SearchView.ProductSearchSearchResultSelectedData): void => {
            this.canExecute = true;
            this._productSearchResults = data.productSearchResults;
        };

        this.searchResultSelectionClearedHandler = () => {
            this.canExecute = false;
            this._productSearchResults = [];
        };
    }

    /**
     * Initializes the command.
     * @param {CustomerDetailsView.ICustomerDetailsExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: SearchView.IProductSearchExtensionCommandState): void {
        this.isVisible = true;
        this._productSearchResults = state.productSearchResults;
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        let message: string = "";
        let productData: string[] = [];
        this._productSearchResults.forEach((result: ProxyEntities.ProductSearchResult): void => {
            let productMessage: string = " Product Name: " + result.Name + " - Item Id: " + result.ItemId + " - Price: " + result.Price;
            productData.push(productMessage);
        });

        message = productData.join("  |  ");
        MessageDialog.show(this.context, message);
    }
}