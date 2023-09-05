/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { IShowJournalCustomerOrderHistoryListColumn } from "PosApi/Extend/Views/ShowJournalView";
import { ICustomColumnsContext } from "PosApi/Extend/Views/CustomListColumns";
import { DateFormatter, TransactionTypeFormatter, CurrencyFormatter } from "PosApi/Consume/Formatters";
import { ProxyEntities } from "PosApi/Entities";

export default (context: ICustomColumnsContext): IShowJournalCustomerOrderHistoryListColumn[] => {
    return [
        {
            title: "Date_CUSTOMIZED",
            computeValue: (row: ProxyEntities.SalesOrder): string => { return DateFormatter.toShortDateAndTime(row.CreatedDateTime); },
            ratio: 20,
            collapseOrder: 7,
            minWidth: 200
        }, {
            title: "Operator ID",
            computeValue: (row: ProxyEntities.SalesOrder): string => { return "Neato custom Staff ID: " + row.StaffId; },
            ratio: 10,
            collapseOrder: 1,
            minWidth: 100
        }, {
            title: "Register",
            computeValue: (row: ProxyEntities.SalesOrder): string => { return row.TerminalId; },
            ratio: 15,
            collapseOrder: 2,
            minWidth: 100
        }, {
            title: "Type",
            computeValue: (row: ProxyEntities.SalesOrder): string => { return TransactionTypeFormatter.toName(row.TransactionTypeValue); },
            ratio: 15,
            collapseOrder: 3,
            minWidth: 200
        }, {
            title: "Status",
            computeValue: (row: ProxyEntities.SalesOrder): string => { return TransactionTypeFormatter.toName(row.StatusValue); },
            ratio: 10,
            collapseOrder: 4,
            minWidth: 100,
        }, {
            title: "Receipt",
            computeValue: (row: ProxyEntities.SalesOrder): string => { return "Customized: " + row.ReceiptId; },
            ratio: 20,
            collapseOrder: 6,
            minWidth: 200
        }, {
            title: "Total",
            computeValue: (row: ProxyEntities.SalesOrder): string => { return CurrencyFormatter.toCurrency(row.TotalAmount); },
            ratio: 10,
            collapseOrder: 5,
            minWidth: 100,
            isRightAligned: true
        }
    ];
};