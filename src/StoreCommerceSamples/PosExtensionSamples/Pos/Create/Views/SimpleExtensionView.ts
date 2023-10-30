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
import { ClientEntities } from "PosApi/Entities";
import { ISimpleExtensionViewModelOptions } from "./NavigationContracts";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import SimpleExtensionViewModel from "./SimpleExtensionViewModel";
import ko from "knockout";

/**
 * The controller for SimpleExtensionView.
 */
export default class SimpleExtensionView extends Views.CustomViewControllerBase implements Views.IBarcodeScannerEndpoint, Views.IMagneticStripeReaderEndpoint {
    public readonly viewModel: SimpleExtensionViewModel;
    public datePicker: Controls.IDatePicker;
    public timePicker: Controls.ITimePicker;
    public toggleSwitch: Controls.IToggle;
    public menuStatic: Controls.IMenu;
    public toggleMenuStatic: Controls.IMenu;
    public readonly implementsIBarcodeScannerEndpoint: true;
    public readonly implementsIMagneticStripeReaderEndpoint: true;

    constructor(context: Views.ICustomViewControllerContext, options?: ISimpleExtensionViewModelOptions) {
        let config: Views.ICustomViewControllerConfiguration = {
            title: "",
            commandBar: {
                commands: [
                    {
                        name: "navigateToNextPageCommand",
                        label: context.resources.getString("string_58"),
                        icon: Views.Icons.Add,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.viewModel.navigateNext();
                        }
                    }
                ]
            }
        };

        super(context, config);

        // Initialize the view model.
        this.viewModel = new SimpleExtensionViewModel(context, options);

        this.state.title = this.viewModel.title();
    }

    /**
    * Bind the html element with view controller.
    * @param {HTMLElement} element DOM element.
    */
    public onReady(element: HTMLElement): void {

        ko.applyBindings(this, element);

        const correlationId: string = this.context.logger.getNewCorrelationId();

        let datePickerOptions: Controls.IDatePickerOptions = {
            date: this.viewModel.date(),
            enabled: this.viewModel.permitDateAndTimeChanges()
        };

        let datePickerRootElem: HTMLDivElement = element.querySelector("#datePicker") as HTMLDivElement;
        this.datePicker = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "DatePicker", datePickerOptions, datePickerRootElem);
        this.datePicker.addEventListener("DateChanged", (eventData: { date: Date }) => {
            this.viewModel.date(eventData.date);
        });

        let timePickerOptions: Controls.ITimePickerOptions = {
            enabled: this.viewModel.permitDateAndTimeChanges(),
            minuteIncrement: 15,
            time: this.viewModel.time()
        };

        let timePickerRootElem: HTMLDivElement = element.querySelector("#timePicker") as HTMLDivElement;
        this.timePicker = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "TimePicker", timePickerOptions, timePickerRootElem);
        this.timePicker.addEventListener("TimeChanged", (eventData: { time: Date }) => {
            this.viewModel.time(eventData.time);
        });

        // Enable/disable based on toggle switch value.
        this.viewModel.permitDateAndTimeChanges.subscribe((toggleValue: boolean): void => {
            this.timePicker.enabled = toggleValue;
            this.datePicker.enabled = toggleValue;
        });

        // Initialize Toggle switch.
        let toggleOptions: Controls.IToggleOptions = {
            labelOn: this.context.resources.getString("string_59"),
            labelOff: this.context.resources.getString("string_60"),
            tabIndex: 0,
            checked: this.viewModel.permitDateAndTimeChanges(),
            enabled: true
        };

        let toggleRootElem: HTMLDivElement = element.querySelector("#SimpleViewToggleSwitch") as HTMLDivElement;
        this.toggleSwitch = this.context.controlFactory.create(correlationId, "Toggle", toggleOptions, toggleRootElem);
        this.toggleSwitch.addEventListener("CheckedChanged", (eventData: { checked: boolean }) => {
            this.viewModel.toggleChanged(eventData.checked);
        });

        // Initialize static Menu.
        let menuOptions: Controls.IMenuOptions = {
            commands: [{
                id: "MenuCommand1",
                label: this.context.resources.getString("string_61"),
            }, {
                    id: "MenuCommand2",
                    label: this.context.resources.getString("string_62"),
                    selected: true,
                }],
            directionalHint: Controls.DirectionalHint.BottomCenter,
            type: "button"
        };

        let menuRootElem: HTMLDivElement = element.querySelector("#menuStatic") as HTMLDivElement;
        this.menuStatic = this.context.controlFactory.create(correlationId, "Menu", menuOptions, menuRootElem);
        this.menuStatic.addEventListener("CommandInvoked", (eventData: { id: string }) => {
            if (eventData.id == "MenuCommand1") {
                this._menuCommandClick(eventData.id);
            }
            else {
                this._menuCommandClick2(eventData.id);
            }
        });

        // Initialize Toggle Menu.
        let toggleMenuOptions: Controls.IMenuOptions = {
            commands: [{
                id: "MenuCommand1",
                label: this.context.resources.getString("string_61"),
            }, {
                    id: "MenuCommand2",
                    label: this.context.resources.getString("string_62"),
                    selected: true,
                }],
            directionalHint: Controls.DirectionalHint.BottomCenter,
            type: "toggle"
        };

        let toggleMenuRootElem: HTMLDivElement = element.querySelector("#toggleMenu") as HTMLDivElement;
        this.toggleMenuStatic = this.context.controlFactory.create(correlationId, "Menu", toggleMenuOptions, toggleMenuRootElem);
        this.toggleMenuStatic.addEventListener("CommandInvoked", (eventData: { id: string }) => {
            if (eventData.id == "MenuCommand1") {
                this._menuCommandClick(eventData.id);
            }
            else {
                this._menuCommandClick2(eventData.id);
            }
        });
    }

    /**
     * Shows the toggle menu.
     * @param {any} data The data.
     * @param {Event} event The event.
     */
    public showToggleMenuStatic(data: any, event: Event): void {
        this.toggleMenuStatic.show(<HTMLElement>event.currentTarget);
    }

    /**
     * Shows the static menu.
     * @param {any} data The data.
     * @param {Event} event The event.
     */
    public showMenuStatic(data: any, event: Event): void {
        this.menuStatic.show(<HTMLElement>event.currentTarget);
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Handler for barcode scanned.
     * @param {string} barcode The barcode that was scanned.
     */
    public onBarcodeScanned(barcode: string): void {
        this.context.logger.logVerbose(barcode);
    }

    /**
     * Handler for card swiped on msr.
     * @param {ClientEntities.ICardInfo} card The card information.
     */
    public onMagneticStripeRead(card: ClientEntities.ICardInfo): void {
        this.context.logger.logVerbose(JSON.stringify(card));
    }

    /**
     * The click handler for the first menu command.
     * @param {string} id The id clicked.
     */
    private _menuCommandClick(id: string): void {
        this.context.logger.logVerbose("menuCommandClick clicked. Id : " + id);
    }

    /**
     * The click handler for the second menu command.
     * @param {string} id The id clicked.
     */
    private _menuCommandClick2(id: string): void {
        this.context.logger.logVerbose("menuCommandClick2 clicked. Id : " + id);
    }
}
