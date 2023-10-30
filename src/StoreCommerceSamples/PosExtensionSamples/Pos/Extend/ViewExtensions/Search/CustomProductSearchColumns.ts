/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { IProductSearchColumn } from "PosApi/Extend/Views/SearchView";
import { ICustomColumnsContext } from "PosApi/Extend/Views/CustomListColumns";
import { CurrencyFormatter } from "PosApi/Consume/Formatters";
import { ProxyEntities } from "PosApi/Entities";

export default (context: ICustomColumnsContext): IProductSearchColumn[] => {
    return [
        {
            title: "Item ID_CUSTOMIZED",
            computeValue: (row: ProxyEntities.ProductSearchResult): string => { return row.ItemId; },
            ratio: 20,
            collapseOrder: 3,
            minWidth: 120
        }, {
            title: "Name",
            computeValue: (row: ProxyEntities.ProductSearchResult): string => { return row.Name; },
            ratio: 40,
            collapseOrder: 2,
            minWidth: 200
        }, {
            title: "Custom",
            computeValue: (row: ProxyEntities.ProductSearchResult): string => { return "RecID: " + row.RecordId; },
            ratio: 20,
            collapseOrder: 4,
            minWidth: 200
        }, {
            title: "Price",
            computeValue: (row: ProxyEntities.ProductSearchResult): string => { return CurrencyFormatter.toCurrency(row.Price); },
            ratio: 20,
            collapseOrder: 1,
            minWidth: 100,
            isRightAligned: true
        }
    ];
};