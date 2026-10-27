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
