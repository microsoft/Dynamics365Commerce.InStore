/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { PreElevateUserTrigger, IPreElevateUserTriggerOptions } from "PosApi/Extend/Triggers/ApplicationTriggers";
import { CancelableTriggerResult } from "PosApi/Extend/Triggers/Triggers";
import { LightDevice } from "../../LightDevice";

export default class PreElevateUserTriggerImpl extends PreElevateUserTrigger {
    public async execute(options: IPreElevateUserTriggerOptions): Promise<CancelableTriggerResult<IPreElevateUserTriggerOptions>> {
        await LightDevice.executeAction(this.context, "BlinkOff", "PreElevateUserTrigger");
        return Promise.resolve(new CancelableTriggerResult(false, options));
    }
}
