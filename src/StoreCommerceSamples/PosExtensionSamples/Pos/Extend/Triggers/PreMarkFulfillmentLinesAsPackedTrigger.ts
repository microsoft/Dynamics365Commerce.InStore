/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/SalesOrderTriggers";

/**
 * Example implementation of PreMarkFulfillmentLinesAsPacked trigger that logs its execution.
 */
export default class PreMarkFulfillmentLinesAsPackedTrigger extends Triggers.PreMarkFulfillmentLinesAsPackedTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.PreMarkFulfillmentLinesAsPackedTriggerOptions} options The options provided to the trigger.
     * @return {Promise<Commerce.Triggers.CancelableTriggerResult<Triggers.IPreMarkFulfillmentLinesAsPackedTriggerOptions>>} The cancelable promise containing the response.
     */
    public execute(options: Triggers.IPreMarkFulfillmentLinesAsPackedTriggerOptions): Promise<Commerce.Triggers.CancelableTriggerResult<Triggers.IPreMarkFulfillmentLinesAsPackedTriggerOptions>> {
        this.context.logger.logInformational("Executing PreMarkFulfillmentLinesAsPackedTrigger with options " + JSON.stringify(options) + ".");
        return Promise.resolve(new Commerce.Triggers.CancelableTriggerResult(false, options));
    }
}