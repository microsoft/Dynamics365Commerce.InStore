/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { IOrderLinesListColumn } from "PosApi/Extend/Views/PickingAndReceivingDetailsView";
import { ICustomColumnsContext } from "PosApi/Extend/Views/CustomListColumns";
import { ClientEntities } from "PosApi/Entities";

export default (context: ICustomColumnsContext): IOrderLinesListColumn[] => {
    return [
        {
            title: "PRODUCT NUMBER",
            computeValue: (row: ClientEntities.IPickingAndReceivingOrderLine): string => {
                return row.productNumber;
            },
            ratio: 40,
            collapseOrder: 3,
            minWidth: 100
        },
        {
            title: "QUANTITY ORDERED",
            computeValue: (row: ClientEntities.IPickingAndReceivingOrderLine): string => {
                return row.quantityOrdered.toString();
            },
            ratio: 30,
            collapseOrder: 2,
            minWidth: 100
        },
        {
            title: "UNIT OF MEASURE",
            computeValue: (row: ClientEntities.IPickingAndReceivingOrderLine): string => {
                return row.unitOfMeasure;
            },
            ratio: 30,
            collapseOrder: 1,
            minWidth: 100
        }
    ];
};