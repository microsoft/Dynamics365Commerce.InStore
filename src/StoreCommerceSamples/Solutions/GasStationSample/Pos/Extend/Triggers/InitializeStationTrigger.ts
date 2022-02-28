/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ApplicationStartTrigger, IApplicationStartTriggerOptions } from "PosApi/Extend/Triggers/ApplicationTriggers";
import { GasStationDataStore } from "../../GasStationDataStore";
import ko from "knockout";

/**
 * Example implementation of an ApplicationStart trigger that initiates the Gas Station Data Store.
 */
export default class InitializeStationTrigger extends ApplicationStartTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IApplicationStartTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: IApplicationStartTriggerOptions): Promise<void> {
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

        return GasStationDataStore.instance.initAsync(this.context);
    }
}