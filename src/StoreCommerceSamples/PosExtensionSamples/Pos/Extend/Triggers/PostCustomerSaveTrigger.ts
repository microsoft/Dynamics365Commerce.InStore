/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/CustomerTriggers";

/**
 * Example implementation of an PostCustomerSave trigger that logs to the console.
 */
export default class PostCustomerSaveTrigger extends Triggers.PostCustomerSaveTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPostCustomerSaveTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IPostCustomerSaveTriggerOptions): Promise<void> {
        this.context.logger.logInformational("Executing PostCustomerSaveTrigger with options " + JSON.stringify(options) + ".");
        return Promise.resolve();
    }
}