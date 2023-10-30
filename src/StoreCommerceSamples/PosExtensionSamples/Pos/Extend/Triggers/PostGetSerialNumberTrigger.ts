/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/ProductTriggers";
import { ClientEntities } from "PosApi/Entities";
import { StringExtensions } from "PosApi/TypeExtensions";

export default class PostGetSerialNumberTrigger extends Triggers.PostGetSerialNumberTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPostGetSerialNumberTriggerOptions} options The options provided to the trigger.
     * @return {Promise<void>} The promise as resolved or rejected.
     */
    public execute(options: Triggers.IPostGetSerialNumberTriggerOptions): Promise<void> {
        this.context.logger.logInformational("Executing PostSerialInputTrigger with options " + JSON.stringify(options) + ".");

        if (StringExtensions.isNullOrWhitespace(options.serialNumber)) {
            /* This condition is necessary if you want to continue allowing
               the feature of adding the serial number later. */
            return Promise.resolve();
        } else if (options.serialNumber === "111") {
            /* Does not add the item to the cart and shows an error message on the dialog. */
            let error: ClientEntities.ExtensionError = new ClientEntities.ExtensionError
                ("The serial number entered has been rejected. Please enter it again or Add Later.");
            return Promise.reject(error);
        } else {
            /* Adds the item to the cart and dismisses the dialog. */
            return Promise.resolve();
        }
    }
}