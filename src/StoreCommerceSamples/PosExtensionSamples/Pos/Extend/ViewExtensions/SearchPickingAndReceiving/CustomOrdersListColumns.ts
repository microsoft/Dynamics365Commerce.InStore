/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { IOrdersListColumn } from "PosApi/Extend/Views/SearchPickingAndReceivingView";
import { ICustomColumnsContext } from "PosApi/Extend/Views/CustomListColumns";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { PurchaseTransferOrderTypeFormatter } from "PosApi/Consume/Formatters";
import { ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";

export default (context: ICustomColumnsContext): IOrdersListColumn[] => {
    return [
        {
            title: "NUMBER",
            computeValue: (row: ClientEntities.IPickingAndReceivingOrder): string => {
                return row.orderId;
            },
            ratio: 30,
            collapseOrder: 3,
            minWidth: 100
        },
        {
            title: "TYPE",
            computeValue: (row: ClientEntities.IPickingAndReceivingOrder): string => {
                return PurchaseTransferOrderTypeFormatter.toName(row.orderType);
            },
            ratio: 40,
            collapseOrder: 2,
            minWidth: 200
        },
        {
            title: "STATUS",
            computeValue: (row: ClientEntities.IPickingAndReceivingOrder): string => {
                return row.status;
            },
            ratio: 20,
            collapseOrder: 1,
            minWidth: 150
        },
        {
            title: "EXTENSION_PROP",
            computeValue: (row: ClientEntities.IPickingAndReceivingOrder): string => {
                if (!ObjectExtensions.isNullOrUndefined(row.extensionProperties)) {
                    let commentsProperties: ProxyEntities.CommerceProperty[] = row.extensionProperties.filter(
                        (value: ProxyEntities.CommerceProperty): boolean => {
                            return value.Key === "Comments";
                        }
                    );

                    return commentsProperties.length > 0 ? commentsProperties[0].Value.StringValue : StringExtensions.EMPTY;
                }

                return StringExtensions.EMPTY;
            },
            ratio: 10,
            collapseOrder: 4,
            minWidth: 120
        },
    ];
};