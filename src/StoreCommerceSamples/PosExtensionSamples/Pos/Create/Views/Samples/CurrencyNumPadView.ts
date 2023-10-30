/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Views from "PosApi/Create/Views";
import * as Controls from "PosApi/Consume/Controls";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import ko from "knockout";

/**
 * The controller for CurrencyNumPadView.
 */
export default class CurrencyNumPadView extends Views.CustomViewControllerBase {
    public numPad: Controls.ICurrencyNumPad;
    public numPadValue: ko.Observable<string>;

    constructor(context: Views.ICustomViewControllerContext) {
        super(context);
        this.state.title = "CurrencyNumPad sample";

        this.numPadValue = ko.observable("");
    }

    /**
     * Bind the html element with view controller.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);


        //Initialize numpad
        let inputBroker: Commerce.Peripherals.INumPadInputBroker = null;
        let numPadOptions: Controls.ICurrencyNumPadOptions = {
            currencyCode: "USD",
            globalInputBroker: inputBroker,
            label: "NumPad label",
            value: 0
        };

        let numPadRootElem: HTMLDivElement = element.querySelector("#CurrencyNumPad") as HTMLDivElement;
        this.numPad = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "CurrencyNumPad", numPadOptions, numPadRootElem);
        this.numPad.addEventListener("EnterPressed", (eventData: { value: Commerce.Extensibility.NumPadValue }) => {
            this.onNumPadEnter(eventData.value);
        });
    }

    /**
     * Callback for numpad.
     * @param {number} value Numpad current value.
     */
    private onNumPadEnter(value: Commerce.Extensibility.NumPadValue): void {
        this.numPadValue(value.toString());
        this.numPad.value = 0;
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}
