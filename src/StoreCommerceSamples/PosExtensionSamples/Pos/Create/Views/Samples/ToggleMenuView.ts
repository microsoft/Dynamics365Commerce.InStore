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
 * The controller for ToggleMenuView.
 */
export default class ToggleMenuView extends Views.CustomViewControllerBase {
    public toggleMenu: Controls.IMenu;

    constructor(context: Views.ICustomViewControllerContext) {
        super(context);
        this.state.title = "ToggleMenuView sample";
    }

    /**
     * Bind the html element with view controller.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        let toggleMenuOptions: Controls.IMenuOptions = {
            commands: [
                {
                    id: "MenuCommand1",
                    label: "Menu command 1",
                },
                {
                    id: "MenuCommand2",
                    label: "Menu command 2",
                    selected: true,
                }
            ],
            directionalHint: Controls.DirectionalHint.BottomCenter,
            type: "toggle"
        };

        let toggleMenuRootElem: HTMLDivElement = element.querySelector("#toggleMenu") as HTMLDivElement;
        this.toggleMenu = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "Menu", toggleMenuOptions, toggleMenuRootElem);
            this.toggleMenu.addEventListener("CommandInvoked", (eventData: { id: string }) => {
             this.menuCommandClick(eventData.id);
        });
    }

    /**
     * Callback for toggle menu.
     * @param {ToggleMenuView} controller View controller.
     * @param {Event} event Html event object.
     */
    public showToggleMenu(controller: ToggleMenuView, event: Event): void {
        this.toggleMenu.show(<HTMLElement>event.currentTarget);
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Callback for toggle menu command.
     * @param {string} args Arguments.
     */
    private menuCommandClick(args: string): void {
        this.context.logger.logInformational(JSON.stringify(args));
    }
}
