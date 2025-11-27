/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */
import ProductRecognitionResponse from "./ProductRecognitionResponse";
import ProductRecognitionRequest from "./ProductRecognitionRequest";
import { ExtensionOperationRequestFactoryFunctionType, IOperationContext } from "PosApi/Create/Operations";
import { ClientEntities } from "PosApi/Entities";

let getOperationRequest: ExtensionOperationRequestFactoryFunctionType<ProductRecognitionResponse> =
/**
 * Gets an instance of ProductRecognitionRequest.
 * @param {IOperationContext} context The operation context.
 * @param {number} operationId The operation Id.
 * @param {string[]} actionParameters The action parameters.
 * @param {string} correlationId A telemetry correlation ID, used to group events logged from this request together with the calling context.
 * @return {ProductRecognitionRequest<TResponse>} Instance of ProductRecognitionRequest.
 */
function (
    context: IOperationContext,
    operationId: number,
    actionParameters: string[],
    correlationId: string
): Promise<ClientEntities.ICancelableDataResult<ProductRecognitionRequest<ProductRecognitionResponse>>> {
    let operationRequest: ProductRecognitionRequest<ProductRecognitionResponse> =
        new ProductRecognitionRequest<ProductRecognitionResponse>(correlationId);

    return Promise.resolve(<ClientEntities.ICancelableDataResult<ProductRecognitionRequest<ProductRecognitionResponse>>>{
        canceled: false,
        data: operationRequest
    });
};

export default getOperationRequest;
