/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import SaveDataToSelectedCartLineRequest from "./SaveDataToSelectedCartLineRequest";
import SaveDataToSelectedCartLineResponse from "./SaveDataToSelectedCartLineResponse";
import { ExtensionOperationRequestFactoryFunctionType, IOperationContext } from "PosApi/Create/Operations";
import { ClientEntities } from "PosApi/Entities";
import { DateExtensions } from "PosApi/TypeExtensions";

let getOperationRequest: ExtensionOperationRequestFactoryFunctionType<SaveDataToSelectedCartLineResponse> =
    /**
     * Gets an instance of SaveDataToSelectedCartLineRequest.
     * @param {number} operationId The operation Id.
     * @param {string[]} actionParameters The action parameters.
     * @param {string} correlationId A telemetry correlation ID, used to group events logged from this request together with the calling context.
     * @return {SaveDataToSelectedCartLineRequest<TResponse>} Instance of SaveDataToSelectedCartLineRequest.
     */
    function (
        context: IOperationContext,
        operationId: number,
        actionParameters: string[],
        correlationId: string
    ): Promise<ClientEntities.ICancelableDataResult<SaveDataToSelectedCartLineRequest<SaveDataToSelectedCartLineResponse>>> {
        const installationDate: string = DateExtensions.getDate().toDateString();

        let operationRequest: SaveDataToSelectedCartLineRequest<SaveDataToSelectedCartLineResponse> =
            new SaveDataToSelectedCartLineRequest<SaveDataToSelectedCartLineResponse>(correlationId, installationDate);

        return Promise.resolve(<ClientEntities.ICancelableDataResult<SaveDataToSelectedCartLineRequest<SaveDataToSelectedCartLineResponse>>>{
            canceled: false,
            data: operationRequest
        });
};

export default getOperationRequest;