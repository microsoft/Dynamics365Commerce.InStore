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
 * The controller for AlphanumericNumPadView.
 */
export default class AlphanumericNumPadView extends Views.CustomViewControllerBase implements Views.INumPadInputSubscriberEndpoint {
    public numPad: Controls.IAlphanumericNumPad;
    public numPadValue: ko.Observable<string>;
    public implementsINumPadInputSubscriberEndpoint: true;
    private _numpadInputSubscriber: INumPadInputSubscriber;

    constructor(context: Views.ICustomViewControllerContext) {
        super(context);
        this.state.title = "AlphanumericNumPad sample";

        this.numPadValue = ko.observable("");
        this.implementsINumPadInputSubscriberEndpoint = true; // Set the flag to true to indicate that the view implements INumPadInputSubscriberEndpoint.
    }

    /**
     * Bind the html element with view controller.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        //Initialize numpad
        let numPadOptions: Controls.IAlphanumericNumPadOptions = {
            globalInputBroker: this._numpadInputSubscriber as Commerce.Peripherals.INumPadInputBroker,
            label: "NumPad Label",
            value: this.numPadValue()
        };

        let numPadRootElem: HTMLDivElement = element.querySelector("#AlphanumericNumPad") as HTMLDivElement;
        this.numPad = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "AlphanumericNumPad", numPadOptions, numPadRootElem);
        this.numPad.addEventListener("EnterPressed", (eventData: { value: Commerce.Extensibility.NumPadValue }) => {
            this.onNumPadEnter(eventData.value);
        });
    }

    /**
     * Sets the num pad input subscriber for the custom view.
     * @param numPadInputSubscriber The numpad input subscriber.
     */
    public setNumPadInputSubscriber(numPadInputSubscriber: INumPadInputSubscriber): void {
        this._numpadInputSubscriber = numPadInputSubscriber;
    }

    /**
     * Callback for numpad.
     * @param {number} value Numpad current value.
     */
    private onNumPadEnter(result: Commerce.Extensibility.NumPadValue): void {
        this.numPadValue(result.toString());
        this.numPad.value = "";
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}
