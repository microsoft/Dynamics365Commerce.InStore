/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    ICustomLinesGridItemSubfieldContext,
    CustomLinesGridItemSubfieldBase
} from "PosApi/Extend/Views/ShowJournalView";
import { CurrencyFormatter } from "PosApi/Consume/Formatters";
import { ProxyEntities } from "PosApi/Entities";
import { ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";

export default class SubscribeAndSaveItemSubfield extends CustomLinesGridItemSubfieldBase {
    constructor(context: ICustomLinesGridItemSubfieldContext) {
        super(context);
    }

    /**
     * Computes a value to display as an item subfield based on the given sales line.
     * @param {ClientEntities.ISalesLineForDisplay} salesLine The sales line.
     * @returns {string} The computed value do display as an item subfield.
     */
    public computeValue(salesLine: ProxyEntities.SalesLine): string {
        let value: string = StringExtensions.EMPTY;
        if (this._isSubscribeAndSaveCartLine(salesLine)) {
            value = StringExtensions.format("Subscribe and save: {0} each month", CurrencyFormatter.toCurrency(salesLine.NetAmount * .95));
        }

        return value;
    }

    /**
     * Returns whether or not the given sales line is for an item that supports subscribing and saving.
     * @param {ClientEntities.ISalesLineForDisplay} salesLine The sales line.
     * @returns {boolean} Whether or not the given sales line is for an item that supports subscribing and saving.
     */
    private _isSubscribeAndSaveCartLine(salesLine: ProxyEntities.SalesLine): boolean {
        return !ObjectExtensions.isNullOrUndefined(salesLine) && salesLine.ItemId === "0006"; // Inner Tube Patches.
    }
}