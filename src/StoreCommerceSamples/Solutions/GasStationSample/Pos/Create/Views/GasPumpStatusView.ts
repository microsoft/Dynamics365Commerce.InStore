import ko from "knockout";
import { CustomViewControllerBase, CustomViewControllerExecuteCommandArgs, ICommand, Icons, ICustomViewControllerConfiguration, ICustomViewControllerContext } from "PosApi/Create/Views";
import { ArrayExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import { IDataList, DataListInteractionMode } from "PosApi/Consume/Controls";
import { CurrencyFormatter, DateFormatter } from "PosApi/Consume/Formatters";
import { AddItemToCartOperationRequest, AddItemToCartOperationResponse, SaveExtensionPropertiesOnCartClientRequest, SaveExtensionPropertiesOnCartClientResponse } from "PosApi/Consume/Cart";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { IMessageDialogOptions, ShowMessageDialogClientRequest, ShowMessageDialogClientResponse } from "PosApi/Consume/Dialogs";
import { Entities } from "../../DataService/DataServiceEntities.g";
import { GasPumpStatus } from "../../GasStationTypes";
import { GasStationDataStore } from "../../GasStationDataStore";
import { NumberFormattingHelper } from "../../NumberFormattingHelper";
import GasStationDetailsDialog from "../Dialogs/GasStationDetailsDialog";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { GASOLINE_QUANTITY_EXTENSION_PROPERTY_NAME } from "../../GlobalConstants";

import ICancelableDataResult = ClientEntities.ICancelableDataResult
import { GetScanResultClientRequest, GetScanResultClientResponse } from "PosApi/Consume/ScanResults";

/**
 * The gas pump status view class.
 */
export default class GasPumpStatusView extends CustomViewControllerBase {
    public readonly isDetailsPanelVisible: ko.Observable<boolean>;
    public readonly isGasPumpSelected: ko.Computed<boolean>;
    public readonly selectedPumpDescription: ko.Computed<string>;
    public readonly selectedPumpStatus: ko.Computed<string>;
    public readonly selectedGasPump: ko.Observable<Entities.GasPump>;
    public readonly isSelectedGasPumpPumping: ko.Computed<boolean>;
    public readonly selectedGasPumpTotal: ko.Computed<string>;
    public readonly selectedGasPumpVolume: ko.Computed<string>;

    private static readonly DATA_LIST_QUERY_SELECTOR: string = "#contoso_gasPumpStatusView_DataList";
    private static readonly STOP_ALL_COMMAND_NAME: string = "StopAllPumps";
    private static readonly START_ALL_COMMAND_NAME: string = "StartAllPumps";
    private static readonly CHECKOUT_COMMAND_NAME: string = "Checkout";
    private static readonly START_STOP_COMMAND_NAME: string = "StartStopPumpCommand";

    private _dataList: IDataList<Entities.GasPump>;
    private _gasPumpChangedHandlerId: number;

    /**
     * Creates a new instance of the GasPumpStatusView class.
     * @param {ICustomViewControllerContext} context The view controller context.
     */
    constructor(context: ICustomViewControllerContext) {
        let config: ICustomViewControllerConfiguration = {
            title: "Pump Status View",
            commandBar: {
                commands: [
                    {
                        name: GasPumpStatusView.CHECKOUT_COMMAND_NAME,
                        label: "Checkout",
                        icon: Icons.Add,
                        isVisible: true,
                        canExecute: false,
                        execute: (args: CustomViewControllerExecuteCommandArgs): void => {
                            this._addGasolineToCartAsync();
                        }
                    },
                    {
                        name: GasPumpStatusView.START_STOP_COMMAND_NAME,
                        label: "Enable/Disable",
                        icon: Icons.LightningBolt,
                        isVisible: true,
                        canExecute: false,
                        execute: (args: CustomViewControllerExecuteCommandArgs): void => {
                            this._enableDisablePumpAsync();
                        }
                    },
                    {
                        name: GasPumpStatusView.STOP_ALL_COMMAND_NAME,
                        label: "Disable all pumps",
                        icon: Icons.Cancel,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: CustomViewControllerExecuteCommandArgs): void => {
                            this.state.isProcessing = true;
                            GasStationDataStore.instance.stopAllPumpsAsync(this.context).then((updatedPumps): void => {
                                this.state.isProcessing = false;
                            }).catch((reason: any) => {
                                this.state.isProcessing = false;
                                GasPumpStatusView._displayErrorAsync(this.context, reason);
                            });
                        }
                    },
                    {
                        name: GasPumpStatusView.START_ALL_COMMAND_NAME,
                        label: "Enable all pumps",
                        icon: Icons.Go,
                        isVisible: true,
                        canExecute: false,
                        execute: (args: CustomViewControllerExecuteCommandArgs): void => {
                            this.state.isProcessing = true;
                            GasStationDataStore.instance.startAllPumpsAsync(this.context).then((updatedPumps): void => {
                                this.state.isProcessing = false;
                            }).catch((reason: any) => {
                                this.state.isProcessing = false;
                                GasPumpStatusView._displayErrorAsync(this.context, reason);
                            });
                        }
                    },
                    {
                        name: "ShowGasStationDetails",
                        label: "Show station information",
                        icon: Icons.DeliveryTruck,
                        canExecute: true,
                        isVisible: true,
                        execute: (args: CustomViewControllerExecuteCommandArgs): void => {
                            let dialog = new GasStationDetailsDialog();
                            dialog.open();
                        }
                    }
                ]
            }
        };
        super(context, config);

        this.isDetailsPanelVisible = ko.observable(true);
        this.selectedGasPump = ko.observable(undefined);
        this.isGasPumpSelected = ko.computed((): boolean => {
            return !ObjectExtensions.isNullOrUndefined(this.selectedGasPump())
        }, this);
        this.selectedPumpDescription = ko.computed((): string => {
            return ObjectExtensions.isNullOrUndefined(this.selectedGasPump()) ? "" : this.selectedGasPump().Description;
        }, this);
        this.selectedPumpStatus = ko.computed((): string => {
            if (ObjectExtensions.isNullOrUndefined(this.selectedGasPump())) {
                return "";
            }

            let status: GasPumpStatus = this.selectedGasPump().State.GasPumpStatusValue;
            switch (status) {
                case GasPumpStatus.Idle:
                    return "Idle";
                case GasPumpStatus.Stopped:
                    return "Pump Disabled";
                case GasPumpStatus.Pumping:
                    return "Pumping Gas";
                case GasPumpStatus.PumpingComplete:
                    return "Pumping complete";
                case GasPumpStatus.Emergency:
                    return "Pump Emergency";
                default:
                    return "Unknown status";
            }
        }, this);

        this.isSelectedGasPumpPumping = ko.computed((): boolean => {
            if (!this.isGasPumpSelected()) {
                return false;
            }

            return this.selectedGasPump().State.GasPumpStatusValue === GasPumpStatus.Pumping || this.selectedGasPump().State.GasPumpStatusValue === GasPumpStatus.PumpingComplete;
        }, this)

        this.selectedGasPumpTotal = ko.computed((): string => {
            if (ObjectExtensions.isNullOrUndefined(this.selectedGasPump())) {
                return CurrencyFormatter.toCurrency(0);
            }

            let total: number = this.selectedGasPump().State.SaleTotal;
            if (ObjectExtensions.isNullOrUndefined(total) || isNaN(total)) {
                total = 0;
            }

            return CurrencyFormatter.toCurrency(total);
        }, this);

        this.selectedGasPumpVolume = ko.computed((): string => {
            if (ObjectExtensions.isNullOrUndefined(this.selectedGasPump())) {
                return "0.000";
            }

            let volume: number = this.selectedGasPump().State.SaleVolume;
            if (ObjectExtensions.isNullOrUndefined(volume) || isNaN(volume)) {
                volume = 0;
            }

            return NumberFormattingHelper.getRoundedStringValue(volume, 3);
        }, this);
    }

    /**
     * Gets the stop all pumps command.
     * @returns {ICommand} The stop all pumps command.
     */
    private get _stopAllCommand(): ICommand {
        return ArrayExtensions.firstOrUndefined(this.state.commandBar.commands, (c) => c.name === GasPumpStatusView.STOP_ALL_COMMAND_NAME);
    }

    /**
     * Gets the start all pumps command.
     * @returns {ICommand} The start all pumps command.
     */
    private get _startAllCommand(): ICommand {
        return ArrayExtensions.firstOrUndefined(this.state.commandBar.commands, (c) => c.name === GasPumpStatusView.START_ALL_COMMAND_NAME);
    }

    /**
     * Gets the checkout pump command.
     * @returns {ICommand} The checkout command.
     */
    private get _checkoutCommand(): ICommand {
        return ArrayExtensions.firstOrUndefined(this.state.commandBar.commands, (c) => c.name === GasPumpStatusView.CHECKOUT_COMMAND_NAME);
    }

    /**
     * Gets the start/stop pump command.
     * @returns {ICommand} The start/stop command.
     */
    private get _toggleStartStopCommand(): ICommand {
        return ArrayExtensions.firstOrUndefined(this.state.commandBar.commands, (c) => c.name === GasPumpStatusView.START_STOP_COMMAND_NAME);
    }

    /**
     * The onReady function is called when the page element has been added to the DOM. It is responsible for binding the view controller to the element.
     * @param {HTMLElement} element The root element for the view.
     */
    public onReady(element: HTMLElement): void {
        let dataListElement: HTMLDivElement = element.querySelector(GasPumpStatusView.DATA_LIST_QUERY_SELECTOR) as HTMLDivElement;

        // Use the control factory from the context to create a datalist control showing all of the gas pumps.
        this._dataList = this.context.controlFactory.create<Entities.GasPump>(
            this.context.logger.getNewCorrelationId(),
            "DataList",
            {
                columns: [
                    {
                        collapseOrder: 3,
                        computeValue: (row: Entities.GasPump): string => {
                            return row.Name;
                        },
                        isRightAligned: false,
                        minWidth: 100,
                        ratio: 40,
                        title: "Name"
                    },
                    {
                        collapseOrder: 2,
                        computeValue: (row: Entities.GasPump): string => {
                            return GasPumpStatus[row.State.GasPumpStatusValue];
                        },
                        isRightAligned: false,
                        minWidth: 100,
                        ratio: 30,
                        title: "Status"
                    },
                    {
                        collapseOrder: 1,
                        computeValue: (row: Entities.GasPump): string => {
                            return ObjectExtensions.isNullOrUndefined(row.State.LastUpdateTime)
                                ? "Unknown"
                                : DateFormatter.toShortDateAndTime(row.State.LastUpdateTime);
                        },
                        isRightAligned: false,
                        minWidth: 50,
                        ratio: 30,
                        title: "Last Updated"
                    }
                ],
                data: GasStationDataStore.instance.pumps,
                interactionMode: DataListInteractionMode.SingleSelect,
                equalityComparer: (left: Entities.GasPump, right: Entities.GasPump): boolean => {
                    return left.Id === right.Id;
                }
            },
            dataListElement);

        // Add an event listener for the "SelectionChanged" event to update the view controller state when the user interacts with the data list.
        this._dataList.addEventListener("SelectionChanged", (selectionData: { items: Entities.GasPump[] }): void => {
            if (ArrayExtensions.hasElements(selectionData.items)) {
                this.selectedGasPump(selectionData.items[0]);
                this._checkoutCommand.canExecute = selectionData.items[0].State.GasPumpStatusValue === GasPumpStatus.PumpingComplete;
                this._toggleStartStopCommand.canExecute = true; // Setting the canExecute property to true enables the command on the UI.
            } else {
                this.selectedGasPump(undefined);
                this._checkoutCommand.canExecute = false; // Setting the canExecute property to false disables the command on the UI.
                this._toggleStartStopCommand.canExecute = false;
            }
        });

        this._refreshPumps(GasStationDataStore.instance.pumps);
        ko.applyBindings(this, element);
    }

    /**
     * The onShown method is called by the view framework every time the view is displayed.
     */
    public onShown(): void {
        this._gasPumpChangedHandlerId = GasStationDataStore.instance.addPumpStatusChangedHandler(() => { this._refreshPumps(GasStationDataStore.instance.pumps); })
    }

    /**
     * The onHidden method is called by the view framework every time the view is hidden.
     */
    public onHidden(): void {
        if (typeof this._gasPumpChangedHandlerId === "number") {
            let id: number = this._gasPumpChangedHandlerId;
            this._gasPumpChangedHandlerId = undefined;
            GasStationDataStore.instance.removePumpStatusChangedHandler(id);
        }
    }

    /**
     * The dispose method is called by the POS framework when the view is removed from the DOM and the navigation history.
     * It is important to release the view controller resources when it is disposed to prevent memory leaks.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    public toggleDetailsPanel(): void {
        this.isDetailsPanelVisible(!this.isDetailsPanelVisible());
    }

    /**
     * Updates the view controller state with the provided gas pumps.
     * @param {ReadonlyArray<Entities.GasPump>} pumps The gas pumps.
     */
    private _refreshPumps(pumps: ReadonlyArray<Entities.GasPump>): void {
        this._dataList.data = pumps;
        let pumpInEmergency: Entities.GasPump = ArrayExtensions.firstOrUndefined(pumps, (p) => p.State.GasPumpStatusValue === GasPumpStatus.Emergency);
        if (!ObjectExtensions.isNullOrUndefined(pumpInEmergency)) {
            this._dataList.selectItems([pumpInEmergency])
        }

        // Allow stop all if some pumps are pumping.
        this._stopAllCommand.canExecute
            = pumps.some((p) => p.State.GasPumpStatusValue !== GasPumpStatus.Stopped && p.State.GasPumpStatusValue !== GasPumpStatus.Unknown);

        // Allow start all if some pumps are not pumping.
        this._startAllCommand.canExecute
            = pumps.some((p) => p.State.GasPumpStatusValue === GasPumpStatus.Stopped || p.State.GasPumpStatusValue === GasPumpStatus.Unknown);
    }

    /**
     * Adds the gas for the selected pump to the cart.
     * @returns {Promise<void>} The promise representing the async execution of adding the gas to the transaction.
     */
    private _addGasolineToCartAsync(): Promise<void> {
        this.state.isProcessing = true; // Setting isProcessing value to true will show the processing indicator/spinner to the user.
        let extensionProperty: ProxyEntities.CommerceProperty = {
            Key: GASOLINE_QUANTITY_EXTENSION_PROPERTY_NAME,
            Value: {
                StringValue: this.selectedGasPumpVolume()
            }
        };
        const correlationId: string = this.context.logger.getNewCorrelationId();
        let extensionPropertyRequest: SaveExtensionPropertiesOnCartClientRequest<SaveExtensionPropertiesOnCartClientResponse>
            = new SaveExtensionPropertiesOnCartClientRequest([extensionProperty], correlationId);

        return this.context.runtime.executeAsync(extensionPropertyRequest).then((result): Promise<ICancelableDataResult<GetScanResultClientResponse>> => {
            if (result.canceled) {
                return Promise.resolve({ canceled: true, data: null });
            }

            let getScanResult: GetScanResultClientRequest<GetScanResultClientResponse>
                = new GetScanResultClientRequest(GasStationDataStore.instance.gasStationDetails.GasolineItemId);
            return this.context.runtime.executeAsync(getScanResult);
        }).then((result): Promise<ICancelableDataResult<AddItemToCartOperationResponse>> => {
            if (result.canceled) {
                return Promise.resolve({ canceled: true, data: null });
            }

            let details: ClientEntities.IProductSaleReturnDetails[] = [
                {
                    product: result.data.result.Product,
                    quantity: 0
                }
            ];
            let addCartLineRequest: AddItemToCartOperationRequest<AddItemToCartOperationResponse> = new AddItemToCartOperationRequest(details, correlationId);
            return this.context.runtime.executeAsync(addCartLineRequest);
        }).then((result) => {
            if (result.canceled) {
                return;
            }

            this.context.navigator.navigateToPOSView("CartView", new ClientEntities.CartViewNavigationParameters(correlationId));
        }).catch((reason: any): void => {
            GasPumpStatusView._displayErrorAsync(this.context, reason);
        }).then((): void => {
            this.state.isProcessing = false; // Setting isProcessing value to false will hide the processing indicator/spinner.
        });
    }

    /**
     * Enables or disables the selected gas pump.
     * @returns {Promise<void>} The promise representing the completion of the async execution to toggle the pump state.
     */
    private _enableDisablePumpAsync(): Promise<void> {
        this.state.isProcessing = true; // Setting isProcessing value to true will show the processing indicator/spinner to the user.
        let oldState: Entities.GasPumpState = this.selectedGasPump().State;
        let newState: Entities.GasPumpState = new Entities.GasPumpState();
        newState.LastUpdateTime = new Date();
        newState.SaleTotal = 0;
        newState.SaleVolume = 0;
        if (oldState.GasPumpStatusValue === GasPumpStatus.Stopped || oldState.GasPumpStatusValue === GasPumpStatus.Unknown) {
            newState.GasPumpStatusValue = GasPumpStatus.Idle;
        } else {
            newState.GasPumpStatusValue = GasPumpStatus.Stopped;
        }

        return GasStationDataStore.instance.updatePumpStatusAsync(this.context, this.selectedGasPump().Id, newState).then((updatedPump: Entities.GasPump): void => {
            this.state.isProcessing = false; // Setting isProcessing value to false will hide the processing indicator/spinner.
        }).catch((reason: any): void => {
            this.state.isProcessing = false; // Setting isProcessing value to false will hide the processing indicator/spinner.
            GasPumpStatusView._displayErrorAsync(this.context, reason);
        });
    }

    /**
     * Displays an error message corresponding to the provided reason.
     * @param {IExtensionContext} context The extension context.
     * @param {any} reason The error/reason to display.
     * @returns {Promise<ClientEntities.ICancelable>} The promise representing the completion of displaying the error message.
     */
    private static _displayErrorAsync(context: IExtensionContext, reason: any): Promise<ClientEntities.ICancelable> {
        let messageDialogOptions: IMessageDialogOptions;
        if (reason instanceof ClientEntities.ExtensionError) {
            messageDialogOptions = {
                message: reason.localizedMessage
            };
        } else if (reason instanceof Error) {
            messageDialogOptions = {
                message: reason.message
            };
        } else if (typeof reason === "string") {
            messageDialogOptions = {
                message: reason
            };
        } else {
            messageDialogOptions = {
                message: "An unexpected error occurred."
            };
        }

        let errorMessageRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse>
            = new ShowMessageDialogClientRequest(messageDialogOptions);

        return context.runtime.executeAsync(errorMessageRequest);
    }
}