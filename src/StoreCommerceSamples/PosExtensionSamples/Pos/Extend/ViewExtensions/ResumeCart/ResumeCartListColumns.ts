/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ISuspendedCartsListColumn } from "PosApi/Extend/Views/ResumeCartView";
import { ICustomColumnsContext } from "PosApi/Extend/Views/CustomListColumns";
import { ClientEntities } from "PosApi/Entities";
import { DateFormatter, CurrencyFormatter } from "PosApi/Consume/Formatters";
import { ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";

export default (context: ICustomColumnsContext): ISuspendedCartsListColumn[] => {
    return [
        {
            title: "DATE",
            computeValue: (row: ClientEntities.ISuspendedCart): string => { return DateFormatter.toShortDateAndTime(row.cart.ModifiedDateTime); },
            ratio: 40,
            collapseOrder: 2,
            minWidth: 200
        }, {
            title: "CUSTOMER NAME",
            computeValue: (row: ClientEntities.ISuspendedCart): string => {
                return !ObjectExtensions.isNullOrUndefined(row.customer) ? row.customer.Name : StringExtensions.EMPTY;
            },
            ratio: 30,
            collapseOrder: 1,
            minWidth: 100
        }, {
            title: "TOTAL",
            computeValue: (row: ClientEntities.ISuspendedCart): string => { return CurrencyFormatter.toCurrency(row.cart.TotalAmount); },
            ratio: 30,
            collapseOrder: 3,
            minWidth: 100
        }
    ];
};