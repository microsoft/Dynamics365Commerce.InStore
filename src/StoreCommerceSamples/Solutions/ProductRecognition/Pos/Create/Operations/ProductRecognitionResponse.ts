/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */
import { Response } from "PosApi/Create/RequestHandlers";

/**
 * Represents a product recognition prediction result.
 */
export type RecognitionResult = {
    productId: number;
    confidenceScore: number;
};

/**
 * Operation response of executing product recognition.
 */
export default class ProductRecognitionResponse extends Response {
    public recognizedProducts: RecognitionResult[];

    constructor(recognizedProducts?: RecognitionResult[]) {
        super();
        this.recognizedProducts = recognizedProducts || [];
    }
}
