/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Views from "PosApi/Create/Views";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import * as Controls from "PosApi/Consume/Controls";
import ko from "knockout";

/**
 * The controller for TimePickerView.
 */
export default class TimePickerView extends Views.CustomViewControllerBase {
    public timePicker: Controls.ITimePicker;

    constructor(context: Views.ICustomViewControllerContext) {
        super(context);
        this.state.title = "TimePicker sample";
    }

    /**
     * Bind the html element with view controller.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        let timePickerOptions: Controls.ITimePickerOptions = {
            enabled: true,
            minuteIncrement: 15,
            time: new Date()
        };

        let timePickerRootElem: HTMLDivElement = element.querySelector("#timePicker") as HTMLDivElement;
        this.timePicker = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "TimePicker", timePickerOptions, timePickerRootElem);
        this.timePicker.addEventListener("TimeChanged", (eventData: { time: Date }) => {
            this.timePickerChanged(eventData.time)
        });
    }

    /**
     * Callback for time picker.
     * @param {Date} newDate New date.
     */
    private timePickerChanged(newDate: Date): void {
        this.context.logger.logInformational(newDate.getHours() + ":" + newDate.getMinutes());
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}
