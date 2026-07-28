/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { IOperationFailureTriggerOptions, OperationFailureTrigger } from "PosApi/Extend/Triggers/OperationTriggers";
import { LightDevice } from "../../LightDevice";

export default class OperationFailureTriggerImpl extends OperationFailureTrigger {
    public async execute(options: IOperationFailureTriggerOptions): Promise<void> {
        const operationId = options?.operationRequest?.operationId;

        if (operationId === LightDevice.REQUEST_FOR_ASSISTANCE_OPERATION_ID) {
            try {
                await LightDevice.executeAction(this.context, "BlinkOff", "OperationFailureTrigger");
            } finally {
                LightDevice.isBlinking = false;
            }
        }
    }
}
