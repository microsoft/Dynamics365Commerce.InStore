/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Views from "PosApi/Create/Views";
import { IEventRequest, SimpleNextViewModel } from "./SimpleNextViewModel";
import { ISimpleNextViewModelOptions } from "./NavigationContracts";
import { ClientEntities } from "PosApi/Entities";
import { DateFormatter } from "PosApi/Consume/Formatters";
import { IDataList, IDataListOptions, DataListInteractionMode, IPivot } from "PosApi/Consume/Controls";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import ko from "knockout";

/**
 * The controller for SimpleNextView.
 */
export default class SimpleNextView extends Views.CustomViewControllerBase implements Views.IBarcodeScannerEndpoint, Views.IMagneticStripeReaderEndpoint {
    public readonly viewModel: SimpleNextViewModel;
    public dataList: IDataList<IEventRequest>;
    public pivot: IPivot;
    public readonly implementsIBarcodeScannerEndpoint: true;
    public readonly implementsIMagneticStripeReaderEndpoint: true;

    constructor(context: Views.ICustomViewControllerContext, state: Views.ICustomViewControllerBaseState,
        options: ISimpleNextViewModelOptions) {

        let config: Views.ICustomViewControllerConfiguration = {
            title: "",
            commandBar: {
                commands: [
                    {
                        name: "updateMessageCommand",
                        label: context.resources.getString("string_11"),
                        icon: Views.Icons.LightningBolt,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.viewModel.updateMessage();
                        }
                    }
                ]
            }
        };

        super(context, config);

        this.context.logger.logInformational("SimpleNextView loaded");

        // Initialize the view model.
        this.viewModel = new SimpleNextViewModel(context, this.state, options);

        this.state.title = this.context.resources.getString("string_10");
    }

    /**
     * Initializes the page state when the page is created.
     * @param {HTMLElement} element The view's DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        this.pivot = this.context.controlFactory.create(
            this.context.logger.getNewCorrelationId(),
            "Pivot",
            {
                items: [
                    {
                        id: "tab1",
                        header: this.context.resources.getString("string_8"),
                        onReady: (element: HTMLElement) => {
                            ko.applyBindingsToNode(element, {
                                template: {
                                    name: "PivotItem1",
                                    data: this
                                }
                            });
                        },
                        onShown: () => {
                            return;
                        }
                    },
                    {
                        id: "tab2",
                        header: this.context.resources.getString("string_9"),
                        onReady: (element: HTMLElement) => {
                            this._initDataList(element);
                        },
                        onShown: () => {
                            return;
                        }
                    }
                ]
            },
            element.querySelector("#SimpleViewPivot") as HTMLDivElement);

        this.pivot.addEventListener("SelectionChanged", (): void => {
            this.viewModel.tabChanged("SelectionChanged");
        });
    }

    private _initDataList(element: HTMLElement): void {
        // Initialize the POS SDK Controls.
        let dataListOptions: Readonly<IDataListOptions<IEventRequest>> = {
            interactionMode: DataListInteractionMode.MultiSelect,
            data: [],
            columns: [
                {
                    title: this.context.resources.getString("string_12"),
                    ratio: 20,
                    collapseOrder: 2,
                    minWidth: 100,
                    computeValue: (rowData: IEventRequest): string => { return DateFormatter.toShortDateAndTime(rowData.requestDateTime); }
                },
                {
                    title: this.context.resources.getString("string_13"),
                    ratio: 30,
                    collapseOrder: 4,
                    minWidth: 100,
                    computeValue: (rowData: IEventRequest): string => { return rowData.requestedWorkerName; }
                },
                {
                    title: this.context.resources.getString("string_14"),
                    ratio: 30,
                    collapseOrder: 1,
                    minWidth: 100,
                    computeValue: (rowData: IEventRequest): string => { return rowData.requestType; }
                },
                {
                    title: this.context.resources.getString("string_15"),
                    ratio: 20,
                    collapseOrder: 3,
                    minWidth: 100,
                    computeValue: (rowData: IEventRequest): string => { return rowData.requestStatus; }
                }
            ]
        };

        this.dataList = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "DataList", dataListOptions, element as HTMLDivElement);
        this.dataList.addEventListener("SelectionChanged", (eventData: { items: IEventRequest[] }): any => {
            this.viewModel.selectionChanged(eventData.items);
        });
        this.dataList.addEventListener("ItemInvoked", (eventData: { item: IEventRequest }): any => {
            this.viewModel.listItemInvoked(eventData.item);
        });

        this.dataList.data = this.viewModel.load();
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
        this.context.logger.logInformational(barcode);
    }

    /**
     * Handler for card swiped on msr.
     * @param {ClientEntities.ICardInfo} card The card information.
     */
    public onMagneticStripeRead(card: ClientEntities.ICardInfo): void {
        this.context.logger.logInformational(card.CardNumber);
    }
}