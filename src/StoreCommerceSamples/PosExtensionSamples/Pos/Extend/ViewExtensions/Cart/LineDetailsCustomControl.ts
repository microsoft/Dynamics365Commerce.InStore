/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    CartViewCustomControlBase,
    ICartViewCustomControlState,
    ICartViewCustomControlContext,
    CartLineSelectedData
} from "PosApi/Extend/Views/CartView";
import {
    ObjectExtensions,
    StringExtensions,
    ArrayExtensions
} from "PosApi/TypeExtensions";
import { ProxyEntities } from "PosApi/Entities";
import ko from "knockout";

export default class LineDetailsCustomControl extends CartViewCustomControlBase {
    public readonly cartLineItemId: ko.Computed<string>;
    public readonly cartLineDescription: ko.Computed<string>;
    public readonly isCartLineSelected: ko.Computed<boolean>;

    private static readonly TEMPLATE_ID: string = "Microsot_Pos_Extensibility_Samples_LineDetails";
    private readonly _cartLine: ko.Observable<ProxyEntities.CartLine>;
    private _state: ICartViewCustomControlState;

    constructor(id: string, context: ICartViewCustomControlContext) {
        super(id, context);

        this._cartLine = ko.observable(null);
        this.cartLineItemId = ko.computed(() => {
            let cartLine: ProxyEntities.CartLine = this._cartLine();
            if (!ObjectExtensions.isNullOrUndefined(cartLine)) {
                return cartLine.ItemId;
            }

            return StringExtensions.EMPTY;
        });

        this.cartLineDescription = ko.computed(() => {
            let cartLine: ProxyEntities.CartLine = this._cartLine();
            if (!ObjectExtensions.isNullOrUndefined(cartLine)) {
                return cartLine.Description;
            }

            return StringExtensions.EMPTY;
        });

        this.isCartLineSelected = ko.computed(() => !ObjectExtensions.isNullOrUndefined(this._cartLine()));

        this.cartLineSelectedHandler = (data: CartLineSelectedData) => {
            if (ArrayExtensions.hasElements(data.cartLines)) {
                this._cartLine(data.cartLines[0]);
            }
        };

        this.cartLineSelectionClearedHandler = () => {
            this._cartLine(null);
        };
    }

    /**
     * Binds the control to the specified element.
     * @param {HTMLElement} element The element to which the control should be bound.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindingsToNode(element, {
            template: {
                name: LineDetailsCustomControl.TEMPLATE_ID,
                data: this
            }
        });
    }

    /**
     * Initializes the control.
     * @param {ICartViewCustomControlState} state The initial state of the page used to initialize the control.
     */
    public init(state: ICartViewCustomControlState): void {
        this._state = state;
    }
}