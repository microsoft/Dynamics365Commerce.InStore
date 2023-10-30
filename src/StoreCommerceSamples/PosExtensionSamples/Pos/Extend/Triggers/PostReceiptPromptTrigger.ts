/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/PrintingTriggers";

/**
 * Example implementation of an PostReceiptPromptTrigger trigger that logs to the console.
 */
export default class PostReceiptPromptTrigger extends Triggers.PostReceiptPromptTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPostReceiptPromptTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IPostReceiptPromptTriggerOptions): Promise<void> {
        console.log("Executing PostReceiptPromptTrigger with options " + JSON.stringify(options) + ".");
        return Promise.resolve();
    }
}