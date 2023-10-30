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
    CartChangedData
} from "PosApi/Extend/Views/CartView";
import {
    ObjectExtensions,
    StringExtensions
} from "PosApi/TypeExtensions";
import { ProxyEntities } from "PosApi/Entities";
import ko from "knockout";

/**
 * The controller for CustomerDetailsCustomControl.
 */
export default class CustomerDetailsCustomControl extends CartViewCustomControlBase {
    public readonly isCustomerSelected: ko.Computed<boolean>;
    public readonly accountHolder: ko.Computed<string>;
    public readonly accountNumber: ko.Computed<string>;
    public readonly phone: ko.Computed<string>;
    public readonly email: ko.Computed<string>;

    public readonly accountHolderLabel: string;
    public readonly accountNumberLabel: string;
    public readonly phoneLabel: string;
    public readonly emailLabel: string;

    private static readonly TEMPLATE_ID: string = "Microsot_Pos_Extensibility_Samples_CustomerDetails";
    private readonly _customer: ko.Observable<ProxyEntities.Customer>;

    constructor(id: string, context: ICartViewCustomControlContext) {
        super(id, context);

        this.accountHolderLabel = this.context.resources.getString("string_63");
        this.accountNumberLabel = this.context.resources.getString("string_64");
        this.phoneLabel = this.context.resources.getString("string_65");
        this.emailLabel = this.context.resources.getString("string_66");

        this._customer = ko.observable(null);

        this.isCustomerSelected = ko.computed(() => !ObjectExtensions.isNullOrUndefined(this._customer()));

        this.accountHolder = ko.computed(() => {
            if (this.isCustomerSelected()) {
                return this._customer().Name;
            }

            return StringExtensions.EMPTY;
        });

        this.accountNumber = ko.computed(() => {
            if (this.isCustomerSelected()) {
                return this._customer().AccountNumber;
            }

            return StringExtensions.EMPTY;
        });

        this.phone = ko.computed(() => {
            if (this.isCustomerSelected()) {
                return this._customer().Phone;
            }

            return StringExtensions.EMPTY;
        });

        this.email = ko.computed(() => {
            if (this.isCustomerSelected()) {
                return this._customer().Email;
            }

            return StringExtensions.EMPTY;
        });

        this.cartChangedHandler = (data: CartChangedData) => {
            this._customer(data.customer);
        };
    }

    /**
     * Binds the control to the specified element.
     * @param {HTMLElement} element The element to which the control should be bound.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindingsToNode(element, {
            template: {
                name: CustomerDetailsCustomControl.TEMPLATE_ID,
                data: this
            }
        });
    }

    /**
     * Initializes the control.
     * @param {ICartViewCustomControlState} state The initial state of the page used to initialize the control.
     */
    public init(state: ICartViewCustomControlState): void {
        this._customer(state.customer);
    }
}