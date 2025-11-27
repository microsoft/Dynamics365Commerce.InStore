/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */
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
