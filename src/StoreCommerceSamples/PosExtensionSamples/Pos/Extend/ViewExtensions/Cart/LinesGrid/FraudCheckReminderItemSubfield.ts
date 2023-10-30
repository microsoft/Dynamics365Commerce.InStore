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
} from "PosApi/Extend/Views/CartView";
import { ProxyEntities } from "PosApi/Entities";
import { ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";

export default class FraudCheckReminderItemSubfield extends CustomLinesGridItemSubfieldBase {

    constructor(context: ICustomLinesGridItemSubfieldContext) {
        super(context);
    }

    /**
     * Computes a value to display as an item subfield based on the given cart line.
     * @param {ProxyEntities.CartLine} cartLine The cart line.
     * @returns {string} The computed value do display as an item subfield.
     */
    public computeValue(cartLine: ProxyEntities.CartLine): string {
        let value: string = StringExtensions.EMPTY;
        if (!ObjectExtensions.isNullOrUndefined(cartLine) && cartLine.TotalAmount > 100) {
            value = "Please check the purchasers I.D. in order to prevent fraud.";
        }

        return value;
    }
}