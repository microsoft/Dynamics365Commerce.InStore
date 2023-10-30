/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/CustomerTriggers";
import { ClientEntities } from "PosApi/Entities";

/**
 * Example implementation of PreDisplayLoyaltyCardBalance trigger that logs to the console.
 */
export default class PreDisplayLoyaltyCardBalanceTrigger extends Triggers.PreDisplayLoyaltyCardBalanceTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPreDisplayLoyaltyCardBalanceTriggerOptions} options The options provided to the trigger.
     * @return {Promise<ClientEntities.ICancelable>} The cancelable promise.
     */
    public execute(options: Triggers.IPreDisplayLoyaltyCardBalanceTriggerOptions): Promise<ClientEntities.ICancelable> {
        this.context.logger.logInformational("Executing PreDisplayLoyaltyCardBalanceTrigger with options " + JSON.stringify(options) + ".");
        return Promise.resolve({ canceled: false });
    }
}