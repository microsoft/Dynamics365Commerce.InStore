/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    PriceCheckCustomControlBase,
    IPriceCheckCustomControlState,
    IPriceCheckCustomControlContext,
    PriceCheckPriceCheckCompletedData,
    PriceCheckCustomerChangedData
} from "PosApi/Extend/Views/PriceCheckView";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ProxyEntities } from "PosApi/Entities";
import * as Controls from "PosApi/Consume/Controls";
import ko from "knockout";

export interface IMonthlyPrice {
    month: string;
    price: string;
}

export default class PriceCheckCustomControlPanel extends PriceCheckCustomControlBase {
    public readonly title: ko.Observable<string>;
    public readonly customerName: ko.Observable<string>;   
    public dataList: Controls.IDataList<IMonthlyPrice>;

    private static readonly TEMPLATE_ID: string = "Microsoft_Pos_Extensibility_Samples_PriceCheckPanel";
    private _monthlyProductPrices: IMonthlyPrice[] = [];

    constructor(id: string, context: IPriceCheckCustomControlContext) {
        super(id, context);

        this.title = ko.observable("Monthly Payment Plan");
        this.customerName = ko.observable(null);
        this.customerChangedHandler = this.customerChanged;
        this.priceCheckCompletedHandler = this.priceCheckCompleted;
    }

    /**
     * Binds the control to the specified element.
     * @param {HTMLElement} element The element to which the control should be bound.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindingsToNode(element, {
            template: {
                name: PriceCheckCustomControlPanel.TEMPLATE_ID,
                data: this
            }
        });

        let dataListOptions: Readonly<Controls.IDataListOptions<IMonthlyPrice>> = {
            columns: [
                {
                    title: "Month",
                    ratio: 50,
                    collapseOrder: 1,
                    minWidth: 100,
                    computeValue: (value: IMonthlyPrice): string => {
                        return value.month;
                    }
                },
                {
                    title: "Price",
                    ratio: 50,
                    collapseOrder: 2,
                    minWidth: 60,
                    computeValue: (value: IMonthlyPrice): string => {
                        return value.price;
                    }
                }
            ],
            interactionMode: Controls.DataListInteractionMode.None,
            data: this._monthlyProductPrices
        };

        let dataListRootElem: HTMLDivElement = element.querySelector("#Microsoft_Pos_Extensibility_Samples_PriceCheckPanel_DataList") as HTMLDivElement;
        this.dataList = this.context.controlFactory.create("", "DataList", dataListOptions, dataListRootElem);
    }

    /**
     * Initializes the control.
     * @param {IPriceCheckCustomControlState} state The initial state of the page used to initialize the control.
     */
    public init(state: IPriceCheckCustomControlState): void {
        this.isVisible = true;
        this._setCustomer(state.customer);
        this._updateMonthlyProductPrice(state.productPrice.CustomerContextualPrice);
    }

    /**
     * The handler for the price check completed message.
     * @param {PriceCheckPriceCheckCompletedData} data The result data of product search.
     */
    public priceCheckCompleted(data: PriceCheckPriceCheckCompletedData): void {
        this._updateMonthlyProductPrice(data.productPrice.CustomerContextualPrice);
    }

    /**
     * The handler for the customer changed message.
     * @param {PriceCheckCustomerChangedData} customer The changed customer.
     */
    public customerChanged(data: PriceCheckCustomerChangedData): void {
        this._setCustomer(data.customer);
    }

    /**
     * Sets the customer.
     * @param {ProxyEntities.Customer} customer The customer to set
     */
    private _setCustomer(customer: ProxyEntities.Customer): void {
        if (!ObjectExtensions.isNullOrUndefined(customer)) {
            this.customerName(customer.Name);
        } else {
            this.customerName(null);
        }
    }

    /**
     * Calculates and updates the monthly price.
     * @param {number} productPrice The product price.
     */
    private _updateMonthlyProductPrice(productPrice: number): void {
        let monthlyProductPrice: string = "$" + this._getMonthlyPrice(productPrice);
        this._monthlyProductPrices = [
            {
                month: "January",
                price: monthlyProductPrice
            },
            {
                month: "February",
                price: monthlyProductPrice
            },
            {
                month: "March",
                price: monthlyProductPrice
            },
            {
                month: "April",
                price: monthlyProductPrice
            },
            {
                month: "May",
                price: monthlyProductPrice
            },
            {
                month: "June",
                price: monthlyProductPrice
            },
            {
                month: "July",
                price: monthlyProductPrice
            },
            {
                month: "August",
                price: monthlyProductPrice
            },
            {
                month: "September",
                price: monthlyProductPrice
            }, {
                month: "October",
                price: monthlyProductPrice
            },
            {
                month: "November",
                price: monthlyProductPrice
            },
            {
                month: "December",
                price: monthlyProductPrice
            }
        ];
        this.dataList.data = this._monthlyProductPrices;
    }

    /**
     * Returns the monthly price.
     * @param {number} productPrice The product price.
     * @returns {string} The monthly product price.
     */
    private _getMonthlyPrice(productPrice: number): string {
        if (ObjectExtensions.isNullOrUndefined(productPrice)) {
            return "0";
        }
        let monthlyPaymentAmount: number = productPrice / 12.0;
        return monthlyPaymentAmount.toFixed(2);
    }
}