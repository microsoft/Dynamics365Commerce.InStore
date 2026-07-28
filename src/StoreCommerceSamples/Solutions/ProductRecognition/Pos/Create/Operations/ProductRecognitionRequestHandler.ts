import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { AddItemToCartOperationRequest, AddItemToCartOperationResponse } from "PosApi/Consume/Cart";
import { ShowMessageDialogClientRequest } from "PosApi/Consume/Dialogs";
import { ExtensionOperationRequestType, ExtensionOperationRequestHandlerBase } from "PosApi/Create/Operations";
import { ObjectExtensions, StringExtensions, ArrayExtensions } from "PosApi/TypeExtensions";
import { StoreOperations } from "../../DataService/DataServiceRequests.g";
import { GetProductsByIdsClientRequest, GetProductsByIdsClientResponse } from "PosApi/Consume/Products";

import CameraCaptureDialog from "../Dialogs/CameraCapture/CameraCaptureDialog";
import ICameraCaptureDialogResult from "../Dialogs/CameraCapture/ICameraCaptureDialogResult";
import ProductRecognitionRequest from "./ProductRecognitionRequest";
import ProductRecognitionResponse from "./ProductRecognitionResponse";

/**
 * Represents a product recognition prediction result.
 */
type RecognitionResult = {
    productId: number;
    confidenceScore: number;
};

/**
 * Represents the status of processing a product recognition prediction.
 */
export enum ProductRecognitionStatus {
    AddedToCart,
    AlternativePrediction,
    SkippedLowConfidence,
    AddToCartFailed,
    ProcessingError
}

/**
 * Represents the result of processing a single recognition prediction.
 */
type ProcessedRecognitionResult = {
    productId: number;
    confidenceScore: number;
    status: ProductRecognitionStatus;
};

/**
 * Request handler for the ProductRecognitionRequest class.
 */
export default class ProductRecognitionRequestHandler<TResponse extends ProductRecognitionResponse> extends ExtensionOperationRequestHandlerBase<TResponse> {
    private readonly CONFIDENCE_THRESHOLD = 0.83;
    private readonly API_CONFIDENCE_THRESHOLD = 0.70;
    private readonly MULTIPLE_PRODUCTS_THRESHOLD = 2; // Navigate to selection view when 2+ products found

    /**
     * Gets the supported request type.
     * @return {RequestType<TResponse>} The supported request type.
     */
    public supportedRequestType(): ExtensionOperationRequestType<TResponse> {
        return ProductRecognitionRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {ProductRecognitionRequest<TResponse>} request The request.
     * @return {Promise<ICancelableDataResult<TResponse>>} The cancelable async result containing the response.
     */
    public async executeAsync(request: ProductRecognitionRequest<TResponse>): Promise<ClientEntities.ICancelableDataResult<TResponse>> {
        const correlationId: string = this.context.logger.getNewCorrelationId();
        this.context.logger.logInformational("Product Recognition operation started.", correlationId);

        const imageData: string = request.imageData || await this.getImageData(correlationId);
        if (StringExtensions.isNullOrWhitespace(imageData)) {
            return Promise.resolve(<ClientEntities.ICancelableDataResult<TResponse>>{
                canceled: true,
                data: null
            });
        }

        // Call product recognition API with captured image
        try {
            const recognitionResults: RecognitionResult[] = await this.recognizeProducts(correlationId, imageData);
            this.context.logger.logInformational(`Product Recognition completed. Found ${recognitionResults.length} products.`, correlationId);

            await this.processRecognitionResults(correlationId, recognitionResults);

            return Promise.resolve<ClientEntities.ICancelableDataResult<TResponse>>({
                canceled: false,
                data: <TResponse>new ProductRecognitionResponse(recognitionResults)
            });
        } catch (error) {
            this.context.logger.logError(`Product Recognition API call failed: ${error.message || error}`, correlationId);
            this.showErrorMessage(`Product recognition failed: ${error.message || "Unknown error"}. Please try again.`);
            return Promise.resolve<ClientEntities.ICancelableDataResult<TResponse>>({
                canceled: true,
                data: null
            });
        }
    }

    /**
     * Opens the camera capture dialog and retrieves image data.
     * @param {string} correlationId The telemetry correlation ID.
     * @return {Promise<string>} The captured image data in base64 format.
     */
    private async getImageData(correlationId: string): Promise<string> {
        try {
            const cameraDialog = new CameraCaptureDialog();
            const cameraResult: ICameraCaptureDialogResult = await cameraDialog.open();

            if (!cameraResult.success || StringExtensions.isNullOrWhitespace(cameraResult.imageData)) {
                // User canceled or camera failed
                const errorMessage = cameraResult.errorMessage || "Camera capture was canceled.";
                this.context.logger.logWarning(`Product Recognition canceled: ${errorMessage}`, correlationId);

                return null;
            }

            return cameraResult.imageData;
        } catch (error) {
            this.context.logger.logError(`Camera dialog failed: ${error.message || error}`, correlationId);
            this.showErrorMessage("Camera access failed. Please ensure camera permissions are enabled and try again.");
            return null;
        }
    }

    /**
     * Calls the Commerce Runtime Product Recognition API using generated DataService classes.
     * @param {string} correlationId The telemetry correlation ID.
     * @param {string} imageData Base64 encoded image data.
     * @return {Promise<RecognitionResult[]>} The recognition results.
     */
    private async recognizeProducts(
        correlationId: string,
        imageData: string
    ): Promise<RecognitionResult[]> {
        try {
            const commerceRuntimeRequest = new StoreOperations.RecognizeProductRequest(imageData, this.API_CONFIDENCE_THRESHOLD);
            const response = await this.context.runtime.executeAsync(commerceRuntimeRequest);

            if ((response?.canceled === true) || ObjectExtensions.isNullOrUndefined(response?.data?.result)) {
                return [];
            }

            // Map Commerce Runtime response to POS format
            const result: RecognitionResult[] = response.data.result.map((result: any) => ({
                productId: result.ProductId,
                confidenceScore: result.ConfidenceScore
            }));

            // duplicate for testing multiple products flow.
            return result;
        } catch (error) {
            this.context.logger.logError(`Product recognition service call failed: ${error.message}`, correlationId);
            throw error;
        }
    }

    /**
     * Processes recognition results, validates products, and adds them to cart or navigates to selection view.
     * @param {string} correlationId The telemetry correlation ID.
     * @param {RecognitionResult[]} recognitionResults The recognition results from the API (already sorted by confidence).
     * @return {Promise} Promise containing processing results.
     */
    private async processRecognitionResults(correlationId: string, recognitionResults: RecognitionResult[]): Promise<ProcessedRecognitionResult[]> {
        const processedResults: ProcessedRecognitionResult[] = [];

        for (let i = 0; i < recognitionResults.length; i++) {
            const result = recognitionResults[i];
            const isTopPrediction = i === 0;

            try {
                // Skip products with low confidence scores
                if (result.confidenceScore < this.CONFIDENCE_THRESHOLD) {
                    processedResults.push({
                        productId: result.productId,
                        confidenceScore: result.confidenceScore,
                        status: ProductRecognitionStatus.SkippedLowConfidence,
                    });
                    continue;
                }

                // Only add the top prediction to cart, show others as alternatives
                if (isTopPrediction) {
                    const addToCartResult = await this.addProductToCart(correlationId, result.productId);
                    if (addToCartResult.success) {
                        processedResults.push({
                            productId: result.productId,
                            confidenceScore: result.confidenceScore,
                            status: ProductRecognitionStatus.AddedToCart
                        });
                    } else {
                        processedResults.push({
                            productId: result.productId,
                            confidenceScore: result.confidenceScore,
                            status: ProductRecognitionStatus.AddToCartFailed
                        });
                    }
                } else {
                    // Alternative predictions - don't add to cart, just show as options
                    processedResults.push({
                        productId: result.productId,
                        confidenceScore: result.confidenceScore,
                        status: ProductRecognitionStatus.AlternativePrediction
                    });
                }

            } catch (error) {
                processedResults.push({
                    productId: result.productId,
                    confidenceScore: result.confidenceScore,
                    status: ProductRecognitionStatus.ProcessingError
                });
            }
        }

        if (processedResults.some(r => r.status === ProductRecognitionStatus.AddedToCart)) {
            return processedResults;
        }

        // Filter results by confidence threshold and status for navigation decision.
        const unconfidentPredictions = processedResults.filter(r => r.confidenceScore >= this.CONFIDENCE_THRESHOLD
            || (r.status !== ProductRecognitionStatus.AddToCartFailed && r.status !== ProductRecognitionStatus.ProcessingError)
        );

        // If multiple products detected with high confidence, navigate to selection view
        if (unconfidentPredictions.length >= this.MULTIPLE_PRODUCTS_THRESHOLD) {
            await this.navigateToSelectProductView(correlationId, unconfidentPredictions);

            // Return empty processed results since we're delegating to the selection view
            return [];
        }

        return processedResults;
    }

    /**
     * Navigates to the Select Product View with the recognized products.
     * @param {string} correlationId The telemetry correlation ID.
     * @param {RecognitionResult[]} recognitionResults The recognition results to display.
     */
    private async navigateToSelectProductView(correlationId: string, recognitionResults: RecognitionResult[]): Promise<void> {
        try {
            // Get product details for all recognized product IDs
            const products = await this.getProductsByIds(correlationId, recognitionResults.map(r => r.productId));

            if (products.length === 0) {
                await this.showErrorMessage("Failed to retrieve product information.");
                return;
            }

            const confidenceScores: { [recordId: number]: number } = {};
            for (let i = 0; i < recognitionResults.length; i++) {
                const result = recognitionResults[i];
                const product = ArrayExtensions.firstOrUndefined(products, p => p.RecordId === result.productId);
                if (product) {
                    confidenceScores[product.RecordId] = result.confidenceScore;
                }
            }

            // Navigate to SelectProductView with SimpleProduct objects
            this.context.navigator.navigate("SelectProductView", {
                products: products,
                confidenceScores: confidenceScores
            });

        } catch (error) {
            this.context.logger.logError(`Failed to navigate to product selection view: ${error.message}`);
            await this.showErrorMessage(`Failed to show product selection: ${error.message}`);
        }
    }

    /**
     * Gets product information by product IDs using GetProductsByIdsClientRequest.
     * @param {string} correlationId The telemetry correlation ID.
     * @param {string[]} productIds The product IDs (ItemIds) to resolve.
     * @return {Promise<ProxyEntities.SimpleProduct[]>} The resolved products.
     */
    private async getProductsByIds(correlationId: string, productIds: number[]): Promise<ProxyEntities.SimpleProduct[]> {
        if (!productIds || productIds.length === 0) {
            return [];
        }

        try {
            // Use GetProductsByIdsClientRequest to get product information in bulk
            const getProductsRequest = new GetProductsByIdsClientRequest<GetProductsByIdsClientResponse>(
                productIds,
                correlationId
            );

            const productsResult = await this.context.runtime.executeAsync(getProductsRequest);

            if (!productsResult.canceled &&
                productsResult.data &&
                productsResult.data.result) {
                return productsResult.data.result;
            } else {
                this.context.logger.logWarning("Failed to retrieve products");
                return [];
            }

        } catch (error) {
            this.context.logger.logError(`Error retrieving products: ${error.message}`);
            return [];
        }
    }

    /**
     * Adds a product to cart using POS operation request.
     * @param {string} correlationId The telemetry correlation ID.
     * @param {string} productId The product ID to add (will be converted to number).
     * @return {Promise} Promise containing the result.
     */
    private async addProductToCart(correlationId: string, productId: number): Promise<{ success: boolean; }> {
        try {
            const productDetails = {
                productId: productId,
                quantity: 1
            };

            const addItemRequest = new AddItemToCartOperationRequest<AddItemToCartOperationResponse>(
                [productDetails],
                correlationId
            );

            const result = await this.context.runtime.executeAsync(addItemRequest);

            return { success: result?.canceled === false };
        } catch (error) {
            return { success: false };
        }
    }

    /**
     * Shows an error message to the user.
     * @param {string} errorMessage The error message to display.
     */
    private async showErrorMessage(errorMessage: string): Promise<void> {
        try {
            const messageRequest = new ShowMessageDialogClientRequest({
                title: "Product Recognition",
                message: errorMessage
            });
            await this.context.runtime.executeAsync(messageRequest);
        } catch (error) {
            this.context.logger.logError(`Product Recognition: ${errorMessage}`, this.context.logger.getNewCorrelationId());
        }
    }
}