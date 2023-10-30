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
import ko from "knockout";

/**
 * The interface for shift data.
 */
export interface IShiftData {
    requestId: number;
    requestDateTime: Date;
    requestedWorkerName: string;
    requestType: string;
    requestStatus: string;
}

/**
 * The controller for DataListView.
 */
export default class DataListView extends Views.CustomViewControllerBase {
    public dataList: Controls.IDataList<IShiftData>;

    constructor(context: Views.ICustomViewControllerContext) {
        super(context);

        this.state.title = "DataList sample";
    }

    /**
     * Bind the html element with view controller.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        document.getElementById("selectRandomItemButton").addEventListener('click', () => {
            this.selectRandomItem();
        });
        document.getElementById("selectItemsByNameButton").addEventListener('click', () => {
            this.selectItemsByName();
        });

        let dataListDataSource: Readonly<IShiftData[]> = [
            {
                requestId: 1,
                requestDateTime: new Date(),
                requestedWorkerName: "Allison Berker",
                requestType: "Leave request",
                requestStatus: "Approved"
            },
            {
                requestId: 2,
                requestDateTime: new Date(),
                requestedWorkerName: "Bert Miner",
                requestType: "Shift Swap",
                requestStatus: "Pending"
            },
            {
                requestId: 3,
                requestDateTime: new Date(),
                requestedWorkerName: "Greg Marchievsky",
                requestType: "Shift Offer",
                requestStatus: "Rejected"
            },
            {
                requestId: 4,
                requestDateTime: new Date(),
                requestedWorkerName: "Bohdan Yevchenko",
                requestType: "Vacation request",
                requestStatus: "Approved"
            }
        ];

        let dataListOptions: Readonly<Controls.IDataListOptions<IShiftData>> = {
            columns: [
                {
                    title: "Name",
                    ratio: 30,
                    collapseOrder: 3,
                    minWidth: 100,
                    computeValue: (value: IShiftData): string => {
                        return value.requestedWorkerName;
                    }
                },
                {
                    title: "Type",
                    ratio: 30,
                    collapseOrder: 1,
                    minWidth: 100,
                    computeValue: (value: IShiftData): string => {
                        return value.requestType;
                    }
                },
                {
                    title: "Status",
                    ratio: 40,
                    collapseOrder: 2,
                    minWidth: 100,
                    computeValue: (value: IShiftData): string => {
                        return value.requestStatus;
                    }
                }
            ],
            data: dataListDataSource,
            interactionMode: Controls.DataListInteractionMode.MultiSelect,
            equalityComparer: (left: IShiftData, right: IShiftData): boolean => left.requestId === right.requestId
        };

        let dataListRootElem: HTMLDivElement = element.querySelector("#dataListSample") as HTMLDivElement;
        this.dataList = this.context.controlFactory.create("", "DataList", dataListOptions, dataListRootElem);
        this.dataList.addEventListener("SelectionChanged", (eventData: { items: IShiftData[] }) => {
            this._dataListSelectionChanged(eventData.items);
        });
        this.dataList.addEventListener("ItemInvoked", (eventData: { item: IShiftData }) => {
            this._dataListItemInvoked(eventData.item);
        });
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Callback for selecting random items button.
     */
    public selectRandomItem(): void {
        if (this.dataList.data.length == 0) {
            return;
        }

        let index = Math.floor(Math.random() * this.dataList.data.length);

        let item = this.dataList.data[index];
        this.dataList.selectItems([item]);
    }

    /**
     * Callback for selecting items by name button.
     */
    public selectItemsByName(): void {
        let nameFilterValue = (<HTMLInputElement>document.getElementById("nameFilter")).value;
        let itemsToSelect = this.dataList.data.filter(
            item => item.requestedWorkerName.toLowerCase().indexOf(nameFilterValue.toLowerCase()) != -1);
        this.dataList.selectItems(itemsToSelect);
    }

    /**
     * Callback for data list selection changed.
     */
    private _dataListSelectionChanged(items: IShiftData[]): void {
        this.context.logger.logInformational("SelectionChanged: " + JSON.stringify(items));
    }

    /**
     * Callback for data list item invoked.
     */
    private _dataListItemInvoked(item: IShiftData): void {
        this.context.logger.logInformational("ItemInvoked " + JSON.stringify(item));
    }
}