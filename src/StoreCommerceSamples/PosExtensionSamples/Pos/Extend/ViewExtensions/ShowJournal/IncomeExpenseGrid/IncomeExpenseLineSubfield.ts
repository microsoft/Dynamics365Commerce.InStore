/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    ICustomLinesGridIncomeExpenseSubfieldContext,
    CustomLinesGridIncomeExpenseSubfieldBase
} from "PosApi/Extend/Views/ShowJournalView";
import { ProxyEntities } from "PosApi/Entities";
import { ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";

export default class IncomeExpenseLineSubfield extends CustomLinesGridIncomeExpenseSubfieldBase {

    constructor(context: ICustomLinesGridIncomeExpenseSubfieldContext) {
        super(context);
    }

    /**
     * Computes a value to display as an item subfield based on the given encome/expense line.
     * @param {ProxyEntities.IncomeExpenseLine} cartLine The income/expense line.
     * @returns {string} The computed value do display as a subfield.
     */
    public computeValue(incomeExpenseLine: ProxyEntities.IncomeExpenseLine): string {
        let value: string = StringExtensions.EMPTY;
        if (!ObjectExtensions.isNullOrUndefined(incomeExpenseLine) && Math.abs(incomeExpenseLine.Amount) > 1000) {
            value = StringExtensions.format("The amount is greater then 1000.", incomeExpenseLine.IncomeExpenseAccount);
        }

        return value;
    }
}