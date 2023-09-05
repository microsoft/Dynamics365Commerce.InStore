/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ProxyEntities } from "PosApi/Entities";
import { IExtensionCartViewControllerContext } from "PosApi/Extend/Views/CartView";
import * as CartView from "PosApi/Extend/Views/CartView";
import { ArrayExtensions, StringExtensions } from "PosApi/TypeExtensions";

export default class CartViewController extends CartView.CartExtensionViewControllerBase {

    public static selectedCartLineId: string = StringExtensions.EMPTY;

    private _selectedCartLines: ProxyEntities.CartLine[];
    private _selectedTenderLines: ProxyEntities.TenderLine[];
    private _isProcessingAddItemOrCustomer: boolean;

    /**
     * Creates a new instance of the CartViewController class.
     * @param {IExtensionCartViewControllerContext} context The events Handler context.
     * @remarks The events handler context contains APIs through which a handler can communicate with POS.
     */
    constructor(context: IExtensionCartViewControllerContext) {
        super(context);

        this.cartLineSelectedHandler = (data: CartView.CartLineSelectedData): void => {
            this._selectedCartLines = data.cartLines;

            if (ArrayExtensions.hasElements(this._selectedCartLines)) {
                CartViewController.selectedCartLineId = this._selectedCartLines[0].LineId;
            }
        };

        this.cartLineSelectionClearedHandler = (): void => {
            this._selectedCartLines = undefined;
            CartViewController.selectedCartLineId = null;
        };

        this.tenderLineSelectedHandler = (data: CartView.TenderLineSelectedData): void => {
            this._selectedTenderLines = data.tenderLines;
        };

        this.tenderLineSelectionClearedHandler = (): void => {
            this._selectedCartLines = undefined;
        };

        this.processingAddItemOrCustomerChangedHandler = (processing: boolean): void => {
            this._isProcessingAddItemOrCustomer = processing;
        };
    }
}