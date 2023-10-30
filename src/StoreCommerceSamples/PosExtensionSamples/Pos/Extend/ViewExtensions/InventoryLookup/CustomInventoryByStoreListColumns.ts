/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { IInventoryByStoreListColumn } from "PosApi/Extend/Views/InventoryLookupView";
import { ICustomColumnsContext } from "PosApi/Extend/Views/CustomListColumns";
import { BooleanFormatter } from "PosApi/Consume/Formatters";
import { ProxyEntities } from "PosApi/Entities";

function getItemAvailability(orgUnitAvailability: ProxyEntities.OrgUnitAvailability): ProxyEntities.ItemAvailability {
    "use strict";
    return (orgUnitAvailability && orgUnitAvailability.ItemAvailabilities) ? orgUnitAvailability.ItemAvailabilities[0] : undefined;
}

export default (context: ICustomColumnsContext): IInventoryByStoreListColumn[] => {
    return [
        {
            title: "LOCATION_CUSTOMIZED",
            computeValue: (row: ProxyEntities.OrgUnitAvailability): string => {
                return row.OrgUnitLocation.OrgUnitName;
            },
            ratio: 50,
            collapseOrder: 5,
            minWidth: 150
        }, {
            title: "STORE",
            computeValue: (row: ProxyEntities.OrgUnitAvailability): string => {
                const nonStoreWarehouseIdentifier: number = 0; // Non-Store Warehouses do not have a Channel Id.
                let isRetailStore: boolean = row.OrgUnitLocation.ChannelId !== nonStoreWarehouseIdentifier;
                return BooleanFormatter.toYesNo(isRetailStore);
            },
            ratio: 10,
            collapseOrder: 2,
            minWidth: 50
        }, {
            title: "INVENTORY",
            computeValue: (row: ProxyEntities.OrgUnitAvailability): string => {
                let inventoryAvailability: ProxyEntities.ItemAvailability = getItemAvailability(row);
                let quantity: number = (inventoryAvailability && inventoryAvailability.AvailableQuantity) ? inventoryAvailability.AvailableQuantity : 0;
                return quantity.toString();
            },
            ratio: 10,
            collapseOrder: 6,
            minWidth: 60,
            isRightAligned: true
        }, {
            title: "RESERVED",
            computeValue: (row: ProxyEntities.OrgUnitAvailability): string => {
                let inventoryAvailability: ProxyEntities.ItemAvailability = getItemAvailability(row);
                let physicalReserved: number = (inventoryAvailability && inventoryAvailability.PhysicalReserved) ? inventoryAvailability.PhysicalReserved : 0;
                return physicalReserved.toString();
            },
            ratio: 10,
            collapseOrder: 3,
            minWidth: 60,
            isRightAligned: true
        }, {
            title: "ORDERED",
            computeValue: (row: ProxyEntities.OrgUnitAvailability): string => {
                let inventoryAvailability: ProxyEntities.ItemAvailability = getItemAvailability(row);
                let orderedSum: number = (inventoryAvailability && inventoryAvailability.OrderedSum) ? inventoryAvailability.OrderedSum : 0;
                return orderedSum.toString();
            },
            ratio: 10,
            collapseOrder: 4,
            minWidth: 60,
            isRightAligned: true
        }, {
            title: "UNIT",
            computeValue: (row: ProxyEntities.OrgUnitAvailability): string => {
                let inventoryAvailability: ProxyEntities.ItemAvailability = getItemAvailability(row);
                let unitOfMeasure: string = (inventoryAvailability && inventoryAvailability.UnitOfMeasure) ? inventoryAvailability.UnitOfMeasure : "";
                return unitOfMeasure;
            },
            ratio: 10,
            collapseOrder: 1,
            minWidth: 60,
            isRightAligned: true
        }
    ];
};