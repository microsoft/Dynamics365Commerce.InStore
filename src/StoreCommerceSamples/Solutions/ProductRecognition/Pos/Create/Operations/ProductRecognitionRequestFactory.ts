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
