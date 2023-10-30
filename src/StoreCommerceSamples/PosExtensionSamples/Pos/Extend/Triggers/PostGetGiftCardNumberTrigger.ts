/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/PaymentTriggers";
import { ClientEntities } from "PosApi/Entities";

export default class PostGetGiftCardNumberTrigger extends Triggers.PostGetGiftCardNumberTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPostGetGiftCardNumberTriggerOptions} options The options provided to the trigger.
     * @return {Promise<ClientEntities.ICancelable>} The promise as resolved or rejected
     */
    public execute(options: Triggers.IPostGetGiftCardNumberTriggerOptions): Promise<ClientEntities.ICancelable> {
        this.context.logger.logInformational("Executing PostGetGiftCardNumberTrigger with options " + JSON.stringify(options) + ".");
        return Promise.resolve({ canceled: false });
    }
}