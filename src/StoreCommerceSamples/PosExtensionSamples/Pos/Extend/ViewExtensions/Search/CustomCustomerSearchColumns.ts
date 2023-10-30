/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ICustomerSearchColumn } from "PosApi/Extend/Views/SearchView";
import { ICustomColumnsContext } from "PosApi/Extend/Views/CustomListColumns";
import { ProxyEntities } from "PosApi/Entities";

export default (context: ICustomColumnsContext): ICustomerSearchColumn[] => {
    return [
        {
            title: context.resources.getString("string_2"),
            computeValue: (row: ProxyEntities.GlobalCustomer): string => { return row.AccountNumber; },
            ratio: 15,
            collapseOrder: 5,
            minWidth: 120
        }, {
            title: context.resources.getString("string_3"),
            computeValue: (row: ProxyEntities.GlobalCustomer): string => { return row.FullName; },
            ratio: 20,
            collapseOrder: 4,
            minWidth: 200
        }, {
            title: context.resources.getString("string_4"),
            computeValue: (row: ProxyEntities.GlobalCustomer): string => { return row.FullAddress; },
            ratio: 25,
            collapseOrder: 1,
            minWidth: 200
        }, {
            title: context.resources.getString("string_5"),
            computeValue: (row: ProxyEntities.GlobalCustomer): string => { return row.Email; },
            ratio: 20,
            collapseOrder: 2,
            minWidth: 200
        }, {
            title: context.resources.getString("string_7"),
            computeValue: (row: ProxyEntities.GlobalCustomer): string => { return row.Phone; },
            ratio: 20,
            collapseOrder: 3,
            minWidth: 120
        }
    ];
};