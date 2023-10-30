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
 * The controller for MenuView.
 */
export default class MenuView extends Views.CustomViewControllerBase {
    public menu: Controls.IMenu;

    constructor(context: Views.ICustomViewControllerContext) {
        super(context);
        this.state.title = "Menu sample";
    }

    /**
     * Bind the html element with view controller.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        let menuOptions: Controls.IMenuOptions = {
            commands: [
                {
                    id: "MenuCommand1",
                    label: "Menu command 1",
                },
                {
                    id: "MenuCommand2",
                    label: "Menu command 2",
                }
            ],
            directionalHint: Controls.DirectionalHint.BottomCenter,
            type: "button"
        };

        let menuRootElem: HTMLDivElement = element.querySelector("#menu") as HTMLDivElement;
        this.menu = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "Menu", menuOptions, menuRootElem);
        this.menu.addEventListener("CommandInvoked", (eventData: { id: string }) => {
            this.menuCommandClick(eventData.id);
        });
    }

    /**
     * Callback for menu.
     * @param {MenuView} controller View controller.
     * @param {Event} eventArgs Html event.
     */
    public showMenu(controller: MenuView, eventArgs: Event): void {
        this.menu.show(<HTMLElement>eventArgs.currentTarget);
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Callback for menu command.
     * @param {string} args Menu command arguments.
     */
    private menuCommandClick(args: string): void {
        this.context.logger.logInformational("menuCommandClick: " + args);
    }
}