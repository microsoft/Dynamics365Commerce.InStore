/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/SalesOrderTriggers";
import { CancelableTriggerResult } from "PosApi/Extend/Triggers/Triggers";

/**
 * Example implementation of an PreShipFulfillmentLinesTrigger trigger that logs its execution.
 */
export default class PreShipFulfillmentLinesTrigger extends Triggers.PreShipFulfillmentLinesTrigger {

    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPreShipFulfillmentLinesTriggerOptions} options The options provided to the trigger.
     * @return {Promise<CancelableTriggerResult<Triggers.IPreShipFulfillmentLinesTriggerOptions>>} The cancelable promise containing the response.
     */
    public execute(options: Triggers.IPreShipFulfillmentLinesTriggerOptions):
        Promise<CancelableTriggerResult<Triggers.IPreShipFulfillmentLinesTriggerOptions>> {
        this.context.logger.logInformational("Executing PreShipFulfillmentLinesTrigger with options " + JSON.stringify(options) + ".");

        return Promise.resolve(new CancelableTriggerResult(false, options));
    }
}