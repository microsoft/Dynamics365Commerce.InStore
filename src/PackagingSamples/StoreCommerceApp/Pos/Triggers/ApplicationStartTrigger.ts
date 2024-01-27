/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/ApplicationTriggers";
import ko from "knockout"; // The name of the import 'knockout' must match the one in the tsconfig and manifest file.

/**
 * Example implementation of an ApplicationStart trigger that logs to the console and implements the __posStopExtensionBinding knockout binding.
 */
export default class ApplicationStartTrigger extends Triggers.ApplicationStartTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IApplicationStartTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IApplicationStartTriggerOptions): Promise<void> {
        this.context.logger.logInformational("Executing ApplicationStartTrigger at " + new Date().getTime() + ".");

        /* This implementation is necessary to make POS controls behave properly when a custom version of knockout is used on extensions.
         *   - The 'controlsDescendantBindings = true' tells knockout to not bind the descendants of the element that has it.
         *   - All POS controls which use knockout have the __posStopExtensionBinding binding.
         * Then, the code below is telling to the 'ko' imported by the extension to not rebind elements inside POS controls.
         * Otherwise using a POS data list would result in error because the data list defines new bindings to its descendants and
         * the local 'ko' doesn't know their implementation, only the 'ko' imported in the POS code knows.
         */
        ko.bindingHandlers.__posStopExtensionBinding = {
            init: () => {
                return { controlsDescendantBindings: true };
            }
        };

        return Promise.resolve();
    }
}