/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { DirectionalHint, IMenu, IMenuOptions } from "PosApi/Consume/Controls";
import * as Views from "PosApi/Create/Views";
import { ArrayExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import ko from "knockout";

/**
 * The controller for AppBarView.
 * This view demonstrates how to use the AppBar control including adding commands, enabling/disabling commands, and showing/hiding commands.
 */
export default class AppBarView extends Views.CustomViewControllerBase {
    private static readonly APP_BAR_COMMAND_NAME: string = "AppBarView_appBarCommand";
    private _menu: IMenu;
    private _commandElement: HTMLElement;
    constructor(context: Views.ICustomViewControllerContext) {
        let config: Views.ICustomViewControllerConfiguration = {
            title: "AppBar sample",
            commandBar: {
                commands: [
                    {
                        name: AppBarView.APP_BAR_COMMAND_NAME,
                        label: "Show menu",
                        icon: Views.Icons.Add,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            if (ObjectExtensions.isNullOrUndefined(this._commandElement)) {
                                this._commandElement = document.getElementById(args.commandId);
                            }

                            this._menu.show(this._commandElement); // Show the menu when the command is executed (i.e. when the button is clicked)
                        }
                    },
                    {
                        name: "AppBarView_toggleEnableCommand",
                        label: "Enable/Disable show menu command",
                        icon: Views.Icons.Go,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this._appBarCommand.canExecute = !this._appBarCommand.canExecute; // Toggle the enabled state of the command by setting the canExecute property.
                        }
                    },
                    {
                        name: "AppBarView_toggleVisibilityCommand",
                        label: "Show/Hide show menu command",
                        icon: Views.Icons.TwoPage,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this._appBarCommand.isVisible = !this._appBarCommand.isVisible; // Toggle the visibility of the command by setting the isVisible property.
                        }
                    }
                ]
            }
        };

        super(context, config);
    }

    private get _appBarCommand(): Views.ICommand {
        return ArrayExtensions.firstOrUndefined(this.state.commandBar.commands, (command: Views.ICommand) => {
            return command.name === AppBarView.APP_BAR_COMMAND_NAME;
        });
    }

    /**
     * Bind the html element with view controller.
     *
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        let menuCommands: Commerce.Extensibility.IMenuCommand[] = [
            {
                id: "AppBarView_menuCommand1",
                label: "Execute action",
                canExecute: true,
                isVisible: true
            }
        ];

        let menuOptions: IMenuOptions = {
            directionalHint: DirectionalHint.TopLeftEdge,
            type: "button",
            commands: menuCommands
        };

        let menuHostElement: HTMLDivElement = document.createElement("div");
        element.appendChild(menuHostElement);
        this._menu = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "Menu", menuOptions, menuHostElement);
        this._menu.addEventListener("CommandInvoked", (data: { id: string; }) => {
            this._appBarCommandExecute();
        });
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Callback for appBar command.
     */
    private _appBarCommandExecute(): void {
        this.state.isProcessing = true; // Show the spinner on the view while it is processing.
        setTimeout(() => {
            this.state.isProcessing = false; // Hide the spinner on the view after processing is complete.
        }, 2000);
    }
}
