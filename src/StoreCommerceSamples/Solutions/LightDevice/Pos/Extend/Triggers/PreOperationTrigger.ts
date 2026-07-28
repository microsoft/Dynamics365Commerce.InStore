/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { PreOperationTrigger } from "PosApi/Extend/Triggers/OperationTriggers";
import { LightDevice } from "../../LightDevice";

export default class PreOperationTriggerImpl extends PreOperationTrigger {
    public async execute(options: any): Promise<any> {
        const operationId = options?.operationRequest?.operationId ?? options?.operationId;

        if (operationId === LightDevice.REQUEST_FOR_ASSISTANCE_OPERATION_ID) {
            await LightDevice.executeAction(this.context, "BlinkOn", "PreOperationTrigger");
            LightDevice.isBlinking = true;
        } else if (LightDevice.isBlinking) {
            try {
                await LightDevice.executeAction(this.context, "BlinkOff", "PreOperationTrigger");
            } finally {
                LightDevice.isBlinking = false;
            }
        }

        return { canceled: false, data: options };
    }
}
