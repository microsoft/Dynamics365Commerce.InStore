/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    CustomPackingItem, ICustomPackingItemContext, CustomPackingItemPosition, ICustomPackingItemState, CartChangedData
} from "PosApi/Extend/Header";
import { CurrencyFormatter } from "PosApi/Consume/Formatters";
import { ClientEntities } from "PosApi/Entities";
import { StringExtensions } from "PosApi/TypeExtensions";
import ko from "knockout";

/**
 * (Sample) Custom packing item that shows the cart's amount due and navigates to the cart on click.
 */
export default class CartAmountDuePackingItem extends CustomPackingItem {
    /**
     * The position of the custom packing item relative to the out-of-the-box items.
     */
    public readonly position: CustomPackingItemPosition = CustomPackingItemPosition.After;

    /**
     * Label displayed in the custom packing item with the current amount due.
     */
    public amountDueLabel: ko.Observable<string>;

    private _currentAmountDue: ko.Observable<number>;
    private _amountDueSubscription: Commerce.IDisposable;

    /**
     * Initializes a new instance of the CartAmountDuePackingItem class.
     * @param {string} id The item identifier.
     * @param {ICustomPackingItemContext} context The custom packing item context.
     */
    constructor(id: string, context: ICustomPackingItemContext) {
        super(id, context);

        this.amountDueLabel = ko.observable(StringExtensions.EMPTY);

        this._currentAmountDue = ko.observable(0);
        this._amountDueSubscription = this._currentAmountDue.subscribe((newValue: number) => {
            if (newValue > 0) {
                this.amountDueLabel(CurrencyFormatter.toCurrency(newValue));
                this.visible = true;
            } else {
                this.visible = false;
            }
        });

        this.cartChangedHandler = this._cartChangedHandler.bind(this);
    }

    /**
     * Called when the control element is ready.
     * @param {HTMLElement} packedElement The DOM element of the packed element.
     * @param {HTMLElement} unpackedElement The DOM element of the unpacked element.
     */
    public onReady(packedElement: HTMLElement, unpackedElement: HTMLElement): void {
        this.context.logger.logInformational("Executing onReady!");
        ko.applyBindingsToNode(unpackedElement, {
            template: {
                name: "Microsoft_Pos_Extensibility_Samples_UnpackedCartAmountDueItem",
                data: this
            }
        });

        ko.applyBindingsToNode(packedElement, {
            template: {
                name: "Microsoft_Pos_Extensibility_Samples_PackedCartAmountDueItem",
                data: this
            }
        });
    }

    /**
     * Initializes the control.
     * @param {ICustomPackingItemState} state The custom control state.
     */
    public init(state: ICustomPackingItemState): void {
        return;
    }

    /**
     * Disposes the control releasing its resources.
     */
    public dispose(): void {
        this._amountDueSubscription.dispose();
        super.dispose();
    }

    /**
     * Method used to handle the onClick of the custom packing item.
     */
    public onItemClickedHandler(): void {
        const correlationId: string = this.context.logger.getNewCorrelationId();
        let cartViewOptions: ClientEntities.CartViewNavigationParameters = new ClientEntities.CartViewNavigationParameters(correlationId);

        this.context.logger.logInformational("Cart amount due packing item clicked.", correlationId);

        this.context.navigator.navigateToPOSView("CartView", cartViewOptions);
    }

    /**
     * Handler for the cart changed event.
     * @param {CartChangedData} data The data sent with the event.
     */
    private _cartChangedHandler(data: CartChangedData): void {
        this.context.logger.logInformational("CartChanged received.");
        this._currentAmountDue(data.cart.AmountDue);
    }
}