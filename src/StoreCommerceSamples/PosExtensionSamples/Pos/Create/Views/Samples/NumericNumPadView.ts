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
import { INumPadInputSubscriber } from "PosApi/Consume/Peripherals";
import ko from "knockout";

/**
 * The controller for NumericNumPadView.
 */
export default class NumericNumPadView extends Views.CustomViewControllerBase implements Views.INumPadInputSubscriberEndpoint {
    public numPad: Controls.INumericNumPad;
    public numPadValue: ko.Observable<string>;
    public readonly implementsINumPadInputSubscriberEndpoint: true;
    private readonly _numPadOptions: Controls.INumericNumPadOptions;

    constructor(context: Views.ICustomViewControllerContext) {
        super(context);
        this.state.title = "NumericNumPad sample";

        this.numPadValue = ko.observable("");
        this.implementsINumPadInputSubscriberEndpoint = true; // Set the flag to true to indicate that the view implements INumPadInputSubscriberEndpoint.
        this._numPadOptions = {
            decimalPrecision: 1,
            globalInputBroker: undefined,
            label: "NumPad label",
            value: 0
        };
    }

    /**
     * Bind the html element with view controller.
     *
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        //Initialize numpad
        let numPadRootElem: HTMLDivElement = element.querySelector("#NumericNumPad") as HTMLDivElement;
        this.numPad = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "NumericNumPad", this._numPadOptions, numPadRootElem);
        this.numPad.addEventListener("EnterPressed", (eventData: { value: Commerce.Extensibility.NumPadValue }) => {
            this.onNumPadEnter(eventData.value);
        });
    }

    /**
     * Sets the numpad input subscriber for the custom view.
     * @param numPadInputSubscriber The numpad input subscriber.
     */
    public setNumPadInputSubscriber(numPadInputSubscriber: INumPadInputSubscriber): void {
        this._numPadOptions.globalInputBroker = numPadInputSubscriber;
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
