/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { CustomSortColumnDefinitionBase } from "PosApi/Extend/Views/CustomSortColumnDefinitions";

export default class DeliveryModeSortColumn extends CustomSortColumnDefinitionBase {
    private readonly _columnLabel: string = "Delivery Mode";
    private readonly _columnName: string = "deliveryMode";

    public label(): string {
        return this._columnLabel;
    }

    public columnName(): string {
        return this._columnName;
    }
}