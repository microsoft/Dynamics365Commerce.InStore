/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    ICustomSalesOrderLinesGridItemSubfieldContext,
    CustomSalesOrderLinesGridItemSubfieldBase
} from "PosApi/Extend/Views/ReturnTransactionView";
import { ProxyEntities } from "PosApi/Entities";
import { ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";

/**
 * This class extends the base one to issue a fraud check warning in case the total value of the purchase is above $100.00.
 */
export default class FraudCheckReminderItemSubfield extends CustomSalesOrderLinesGridItemSubfieldBase {
    /**
     * Creates a new instance of the FraudCheckReminderItemSubfield class.
     * @param {ICustomSalesOrderLinesGridItemSubfieldContext} context The events Handler context.
     * @remarks The events handler context contains APIs through which a handler can communicate with POS.
     */
    constructor(context: ICustomSalesOrderLinesGridItemSubfieldContext) {
        super(context);
    }

    /**
     * Computes a value to display as an item subfield based on the given sales line.
     * @param {ClientEntities.ISalesLineForDisplay} salesLine The sales line.
     * @returns {string} The computed value do display as an item subfield.
     */
    public computeValue(salesLine: ProxyEntities.SalesLine): string {
        let value: string = StringExtensions.EMPTY;
        if (!ObjectExtensions.isNullOrUndefined(salesLine) && salesLine.TotalAmount > 100) {
            value = "Please check the purchasers I.D. in order to prevent fraud.";
        }

        return value;
    }
}