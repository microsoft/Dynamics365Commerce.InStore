/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { IOrdersListColumn } from "PosApi/Extend/Views/SearchOrdersView";
import { ICustomColumnsContext } from "PosApi/Extend/Views/CustomListColumns";
import { ClientEntities } from "PosApi/Entities";
import { CurrencyFormatter, DateFormatter } from "PosApi/Consume/Formatters";

export default (context: ICustomColumnsContext): IOrdersListColumn[] => {
    return [
        {
            title: "SALES ORDER",
            computeValue: (row: ClientEntities.ISalesOrderDetails): string => {
                return row.salesOrder.SalesId;
            },
            ratio: 10,
            collapseOrder: 8,
            minWidth: 100
        },
        {
            title: "ORDER TYPE",
            computeValue: (row: ClientEntities.ISalesOrderDetails): string => {
                return row.customerOrderType;
            },
            ratio: 15,
            collapseOrder: 2,
            minWidth: 200
        },
        {
            title: "ORDER STATUS",
            computeValue: (row: ClientEntities.ISalesOrderDetails): string => {
                return row.orderStatus;
            },
            ratio: 15,
            collapseOrder: 4,
            minWidth: 150
        },
        {
            title: "CREATED DATE",
            computeValue: (row: ClientEntities.ISalesOrderDetails): string => {
                return DateFormatter.toShortDate(row.salesOrder.CreatedDateTime);
            },
            ratio: 10,
            collapseOrder: 5,
            minWidth: 100
        },
        {
            title: "DOCUMENT STATUS",
            computeValue: (row: ClientEntities.ISalesOrderDetails): string => {
                return row.documentStatus;
            },
            ratio: 10,
            collapseOrder: 3,
            minWidth: 150
        },
        {
            title: "CUSTOMER NAME",
            computeValue: (row: ClientEntities.ISalesOrderDetails): string => {
                return row.salesOrder.Name;
            },
            ratio: 15,
            collapseOrder: 6,
            minWidth: 200
        },
        {
            title: "RECEIPT EMAIL",
            computeValue: (row: ClientEntities.ISalesOrderDetails): string => {
                return row.salesOrder.ReceiptEmail;
            },
            ratio: 15,
            collapseOrder: 1,
            minWidth: 200
        },
        {
            title: "ORDER TOTAL",
            computeValue: (row: ClientEntities.ISalesOrderDetails): string => {
                return CurrencyFormatter.toCurrency(row.salesOrder.TotalAmount);
            },
            ratio: 10,
            collapseOrder: 7,
            minWidth: 100,
            isRightAligned: true
        }
    ];
};