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
 * The controller for ToggleSwitchView.
 */
export default class ToggleSwitchView extends Views.CustomViewControllerBase {
    public toggleSwitch: Controls.IToggle;

    constructor(context: Views.ICustomViewControllerContext) {
        super(context);
        this.state.title = "ToggleSwitch sample";
    }

    /**
     * Bind the html element with view controller.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        let toggleOptions: Controls.IToggleOptions = {
            tabIndex: 0,
            enabled: true,
            checked: false,
            labelOn: "On",
            labelOff: "Off",
        };

        let toggleRootElem: HTMLDivElement = element.querySelector("#toggleSwitch") as HTMLDivElement;
        this.toggleSwitch = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "Toggle", toggleOptions, toggleRootElem);
        this.toggleSwitch.addEventListener("CheckedChanged", (eventData: { checked: boolean }) => {
            this.toggleSwitchChanged(eventData.checked);
        });
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Callback for toggle switch.
     * @param {boolean} checked True if checked, otherwise false.
     */
    private toggleSwitchChanged(checked: boolean): void {
        this.context.logger.logInformational("toggleSwitchChanged: " + checked);
    }
}
