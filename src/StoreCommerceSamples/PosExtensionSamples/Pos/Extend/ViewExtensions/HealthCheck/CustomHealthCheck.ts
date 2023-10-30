/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ICustomHealthCheckContext, IHealthCheckSetupDetail, CustomHealthCheckBase } from "PosApi/Extend/Views/HealthCheckView";
import { ClientEntities } from "PosApi/Entities";

/**
 * The custom health check class.
 */
export default class CustomHealthCheck extends CustomHealthCheckBase {
    private _lastStatus: ClientEntities.IHealthCheckStatus;

    /**
     * Creates a new instance of the class.
     * @param {ICustomHealthCheckContext} context The extension context.
     */
    constructor(context: ICustomHealthCheckContext) {
        // Health check name and type that is shown on HealthCheckView grid.
        let healthCheckName: string = "Custom Health Check Name";
        let healthCheckType: string = "Custom Health Check Type";

        // This is the configuration that is shown on HealthCheckView "About" section of this health check entity.
        let healthCheckConfiguration: IHealthCheckSetupDetail[] = [
            {
                label: "Device Type",
                value: "Printer"
            },
            {
                label: "API Name",
                value: "External"
            },
            {
                label: "API Version",
                value: "1.0"
            }
        ];

        super(context, healthCheckName, healthCheckType, healthCheckConfiguration);
        this._lastStatus = null;
    }

    /**
     * Executes the health check test.
     * @returns {Promise<ClientEntities.IHealthCheckStatus>} The promise containing the health check status.
     */
    public executeHealthCheckAsync(): Promise<ClientEntities.IHealthCheckStatus> {
        // Add implementation that gets status of this health check entity.
        let status: ClientEntities.IHealthCheckStatus = {
            healthCheckState: ClientEntities.HealthCheckStatusEnum.Succeeded,
            result: null,
            timestamp: new Date()
        };

        this._lastStatus = status;
        return Promise.resolve(status);
    }

    /**
     * Get last run health check status.
     * @return {ClientEntities.IHealthCheckStatus} Returns health check status.
     */
    public getLastStatus(): ClientEntities.IHealthCheckStatus {
        return this._lastStatus;
    }
}