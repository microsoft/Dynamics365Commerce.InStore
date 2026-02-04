/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { HardwareStationDeviceActionRequest } from "PosApi/Consume/Peripherals";
import { ProxyEntities } from "PosApi/Entities";

/**
 * Centralized commands/constants for Light Device sample.
 */
export class LightDevice {
    /**
     * Operation ID for RequestForAssistance.
     */
    public static readonly REQUEST_FOR_ASSISTANCE_OPERATION_ID: number =
        Number(ProxyEntities?.RetailOperation?.RequestForAssistance ?? 718);

    public static getErrorMessage(error: unknown): string {
        return error instanceof Error ? error.message : "Unknown error";
    }

    /**
     * Executes a light device action via Hardware Station.
     * - Always swallows errors (triggers must not block the flow)
     * - Logs only via logger.logError
     */
    public static async executeAction(
        context: IExtensionContext,
        action: string,
        source: string
    ): Promise<void> {
        try {
            const request = new HardwareStationDeviceActionRequest("LightDevice", action, {});
            await context.runtime.executeAsync(request);
        } catch (error) {
            const errorMessage = LightDevice.getErrorMessage(error);
            context.logger.logError(`${source}: Light device action '${action}' failed. Error: ${errorMessage}`);
        }
    }
}
