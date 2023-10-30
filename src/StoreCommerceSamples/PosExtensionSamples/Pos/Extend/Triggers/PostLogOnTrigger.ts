/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/ApplicationTriggers";
import { IPostLogOnViewOptions } from "../../Create/Views/NavigationContracts";

/**
 * Example implementation of a PostLogOnTrigger trigger that navigates to a new view and waits for the resolve callback from the navigated view.
 * The navigated view can delay the resuming of the logon operation to perform any other custom operations.
 */
export default class PostLogOnTrigger extends Triggers.PostLogOnTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPostLogOnTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IPostLogOnTriggerOptions): Promise<any> {
        this.context.logger.logInformational("Executing PostLogOnTrigger with options " + JSON.stringify(options) + ".");

        let promise = new Promise((resolve, reject) => {
            let options: IPostLogOnViewOptions = {
                resolveCallback: resolve,
                rejectCallback: reject
            };

            this.context.logger.logInformational("Navigating to PostLogOnView...");
            this.context.navigator.navigate("PostLogOnView", options);
        });

        promise.then((value: any) => {
            this.context.logger.logInformational("Promise resolved");
        });

        return promise;
    }
}