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
 * The controller for DynamicDataListView.
 */
export default class DynamicDataListView extends Views.CustomViewControllerBase {
    public paginatedDataList: Controls.IPaginatedDataList<IShiftData>;

    private _isUsingAlternativeData: boolean;

    constructor(context: Views.ICustomViewControllerContext) {
        super(context);

        this.state.title = "Dynamic DataList sample";
        this._isUsingAlternativeData = false;
    }

    /**
     * Bind the html element with view controller.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        document.getElementById("selectByIdMessage").innerHTML = "Try to click the 'Select random item by id' button!";
        document.getElementById("selectRandomItemsByIdButton").addEventListener('click', () => {
            this.selectRandomItemsById();
        });
        document.getElementById("selectItemsByNameButton").addEventListener('click', () => {
            this.selectItemsByName();
        });

        // Initialize datalist source
        let paginatedDataSource: Controls.IPaginatedDataSource<IShiftData> = {
            pageSize: 5,
            loadDataPage: this._loadDataPage.bind(this)
        };

        // Initialize datalist options
        let dataListOptions: Readonly<Controls.IPaginatedDataListOptions<IShiftData>> = {
            columns: [
                {
                    title: "ID",
                    ratio: 20,
                    collapseOrder: 3,
                    minWidth: 100,
                    computeValue: (value: IShiftData): string => {
                        return value.requestId.toString();
                    }
                },
                {
                    title: "Name",
                    ratio: 30,
                    collapseOrder: 4,
                    minWidth: 100,
                    computeValue: (value: IShiftData): string => {
                        return value.requestedWorkerName;
                    }
                },
                {
                    title: "Type",
                    ratio: 25,
                    collapseOrder: 1,
                    minWidth: 100,
                    computeValue: (value: IShiftData): string => {
                        return value.requestType;
                    }
                },
                {
                    title: "Status",
                    ratio: 25,
                    collapseOrder: 2,
                    minWidth: 100,
                    computeValue: (value: IShiftData): string => {
                        return value.requestStatus;
                    }
                }
            ],

            data: paginatedDataSource,
            interactionMode: Controls.DataListInteractionMode.MultiSelect,
            equalityComparer: (left: IShiftData, right: IShiftData): boolean => left.requestId === right.requestId
        };

        // Initialize datalist
        let dataListRootElem: HTMLDivElement = element.querySelector("#dynamicDataListSample") as HTMLDivElement;
        this.paginatedDataList = this.context.controlFactory.create("", "PaginatedDataList", dataListOptions, dataListRootElem);
        this.paginatedDataList.addEventListener("SelectionChanged", (eventData: { items: IShiftData[] }) => {
            this._dataListSelectionChanged();
        });

        let reloadBtn: HTMLButtonElement = element.querySelector("#reloadDataButton") as HTMLButtonElement;
        reloadBtn.addEventListener('click', () => {
            this._isUsingAlternativeData = !this._isUsingAlternativeData;
            this.paginatedDataList.reloadData();
        });
    }

    /**
     * Callback for selecting items by random id button.
     * Selecting will be applied only to the items which are already loaded.
     * If the item is not yet loaded, nothing will happen to it.
     */
    public selectRandomItemsById(): void {
        let items = this._getData();

        if (items.length == 0) {
            return;
        }

        let index = Math.floor(Math.random() * items.length);
        let item = items[index];

        document.getElementById("selectByIdMessage").innerHTML =
            `Tried to select item with id=${item.requestId}.`;

        this.paginatedDataList.selectItems([item]);
    }

    /**
     * Callback for selecting items by name button.
     * Selecting will be applied only to the items which are already loaded.
     * If the item is not yet loaded, nothing will happen to it.
     */
    public selectItemsByName(): void {
        let nameFilterValue = (<HTMLInputElement>document.getElementById("nameFilter")).value;
        let items = this._getData();
        let itemsToSelect = items.filter(
            item => item.requestedWorkerName.toLowerCase().indexOf(nameFilterValue.toLowerCase()) != -1);

        this.paginatedDataList.selectItems(itemsToSelect);
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Callback for data list.
     */
    private _dataListSelectionChanged(): void {
        this.context.logger.logInformational("_dataListSelectionChanged");
    }

    /**
     * Load data page callback.
     * @param {number} size The number of items to load.
     * @param {number} skip The number of items that were already loaded.
     * @returns {Promise<IShiftData[]>} The loaded items promise.
     */
    private _loadDataPage(size: number, skip: number): Promise<IShiftData[]> {
        let promise: Promise<any> = new Promise((resolve: (value?: any) => void) => {
            // Emulate delay of request to server.
            setTimeout(() => {
                this.context.logger.logInformational("dataListPageLoaded");

                let pageData: IShiftData[] = this._getData(size, skip);
                resolve(pageData);
            }, 1000);
        });

        return promise;
    }

    /**
     * Gets items based on the current data source.
     * @param {number} size The number of items to return.
     * @param {number} skip The number of items to skip.
     * @returns {IShiftData[]} The requested items.
     */
    private _getData(size?: number, skip?: number): IShiftData[] {
        if (ObjectExtensions.isNullOrUndefined(skip)) {
            skip = 0;
        }

        let data: IShiftData[] = [];
        if (this._isUsingAlternativeData) {
            data = this._getAlternativeData();
        } else {
            data = this._getAllItems();
        }

        if (ObjectExtensions.isNullOrUndefined(size)) {
            return data.slice(skip);
        } else {
            return data.slice(skip, skip + size);
        }
    }

    /**
     * Gets alternative items.
     * @returns {Promise<IShiftData[]>} The requested items.
     */
    private _getAlternativeData(): IShiftData[] {
        return [{
            requestId: 1,
            requestDateTime: new Date(),
            requestedWorkerName: "Alternative Name.",
            requestType: "Alternative Type.",
            requestStatus: "Approved"
        }];
    }

    /**
     * Gets all sample data items.
     * @returns {IShiftData[]} The items for the data list.
     */
    private _getAllItems(): IShiftData[] {
        return [{
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
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 5,
            requestDateTime: new Date(),
            requestedWorkerName: "Bert Miner",
            requestType: "Shift Swap",
            requestStatus: "Pending"
        },
        {
            requestId: 6,
            requestDateTime: new Date(),
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 7,
            requestDateTime: new Date(),
            requestedWorkerName: "Bert Miner",
            requestType: "Shift Swap",
            requestStatus: "Pending"
        },
        {
            requestId: 8,
            requestDateTime: new Date(),
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 9,
            requestDateTime: new Date(),
            requestedWorkerName: "Bert Miner",
            requestType: "Shift Swap",
            requestStatus: "Pending"
        },
        {
            requestId: 10,
            requestDateTime: new Date(),
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 11,
            requestDateTime: new Date(),
            requestedWorkerName: "Bert Miner",
            requestType: "Shift Swap",
            requestStatus: "Pending"
        },
        {
            requestId: 12,
            requestDateTime: new Date(),
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 13,
            requestDateTime: new Date(),
            requestedWorkerName: "Bert Miner",
            requestType: "Shift Swap",
            requestStatus: "Pending"
        },
        {
            requestId: 14,
            requestDateTime: new Date(),
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 15,
            requestDateTime: new Date(),
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 16,
            requestDateTime: new Date(),
            requestedWorkerName: "Bert Miner",
            requestType: "Shift Swap",
            requestStatus: "Pending"
        },
        {
            requestId: 17,
            requestDateTime: new Date(),
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 18,
            requestDateTime: new Date(),
            requestedWorkerName: "Bert Miner",
            requestType: "Shift Swap",
            requestStatus: "Pending"
        },
        {
            requestId: 19,
            requestDateTime: new Date(),
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 20,
            requestDateTime: new Date(),
            requestedWorkerName: "Bert Miner",
            requestType: "Shift Swap",
            requestStatus: "Pending"
        },
        {
            requestId: 21,
            requestDateTime: new Date(),
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 22,
            requestDateTime: new Date(),
            requestedWorkerName: "Bert Miner",
            requestType: "Shift Swap",
            requestStatus: "Pending"
        },
        {
            requestId: 23,
            requestDateTime: new Date(),
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 24,
            requestDateTime: new Date(),
            requestedWorkerName: "Bert Miner",
            requestType: "Shift Swap",
            requestStatus: "Pending"
        },
        {
            requestId: 25,
            requestDateTime: new Date(),
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 26,
            requestDateTime: new Date(),
            requestedWorkerName: "Bert Miner",
            requestType: "Shift Swap",
            requestStatus: "Pending"
        },
        {
            requestId: 27,
            requestDateTime: new Date(),
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 28,
            requestDateTime: new Date(),
            requestedWorkerName: "Bert Miner",
            requestType: "Shift Swap",
            requestStatus: "Pending"
        },
        {
            requestId: 29,
            requestDateTime: new Date(),
            requestedWorkerName: "Allison Berker",
            requestType: "Leave request",
            requestStatus: "Approved"
        },
        {
            requestId: 30,
            requestDateTime: new Date(),
            requestedWorkerName: "Bert Miner",
            requestType: "Shift Swap",
            requestStatus: "Pending"
        }];
    }
}