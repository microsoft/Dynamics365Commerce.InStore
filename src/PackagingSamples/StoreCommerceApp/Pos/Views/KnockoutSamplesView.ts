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

/*
 * ATTENTION
 * 
 * The name of the import 'knockout' must match the one in the tsconfig and manifest file.
 * The data list is here to show that it's possible to use knockout along with POS controls.
 * To use knockout along with other controls from PosApi it's necessary to define the knockout binding: __posStopExtensionBinding.
 * The ApplicationStartTrigger sample shows how it's done. It's important that the binding happens before this file is loaded.
 */

export interface IShiftData {
    requestId: number;
    requestDateTime: Date;
    requestedWorkerName: string;
    requestType: string;
    requestStatus: string;
}

/**
 * The controller for KnockoutSamplesView.
 */
export default class KnockoutSamplesView extends Views.CustomViewControllerBase {
    public dataList: Controls.IDataList<IShiftData>;
    public readonly viewText: any;

    private _texts: string[] = [
        "This view is using knockout on the version specified in the csproj (except the data list control).",
        "It only works because the manifest has declared the knockout dependency.",
        "You can add the types file (.d.ts) manually to get IntelliSense."
    ];

    constructor(context: Views.ICustomViewControllerContext) {
        super(context);

        this.viewText = ko.observable(this._texts[0]);
    }

    /**
     * Bind the html element with view controller.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        let dataListDataSource: Readonly<IShiftData[]> = this._getDataListData();
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

        ko.applyBindings(this, element);
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Click handler for sample button.
     */
    public buttonClicked(): void {
        this._texts = this._texts.slice(1).concat(this._texts[0]);
        this.viewText(this._texts[0]);
    }

    /**
     * Returns sample data for the data list.
     * @returns {IShiftData[]} Sample list of shift data objects.
     */
    private _getDataListData(): IShiftData[] {
        return [
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
