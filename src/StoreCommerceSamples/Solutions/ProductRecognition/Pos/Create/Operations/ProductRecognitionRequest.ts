import { ExtensionOperationRequestBase } from "PosApi/Create/Operations";
import ProductRecognitionResponse from "./ProductRecognitionResponse";

/**
 * Operation request for executing product recognition using camera.
 */
export default class ProductRecognitionRequest<TResponse extends ProductRecognitionResponse> extends ExtensionOperationRequestBase<TResponse> {
    /**
    * The base64 encoded image data to process. If set, camera dialog will be skipped.
    */
    public imageData?: string;

    constructor(correlationId: string, imageData?: string) {
        super(5001, correlationId);
        this.imageData = imageData;
    }
}
