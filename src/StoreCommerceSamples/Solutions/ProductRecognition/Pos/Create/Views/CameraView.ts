/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */
import ko from "knockout";
import { CustomViewControllerBase, ICustomViewControllerConfiguration, ICustomViewControllerContext, Icons } from "PosApi/Create/Views";
import { ObjectExtensions, ArrayExtensions } from "PosApi/TypeExtensions";
import ProductRecognitionRequest from "../Operations/ProductRecognitionRequest";
import ProductRecognitionResponse from "../Operations/ProductRecognitionResponse";
import CameraViewModel from "./CameraViewModel";

/**
 * The camera view for product recognition.
 */
export default class CameraView extends CustomViewControllerBase {
    public statusMessage: ko.Observable<string>;
    public isCameraReady: ko.Observable<boolean>;
    private cameraViewModel: CameraViewModel;

    /**
     * Creates a new instance of the CameraView class.
     * @param {ICustomViewControllerContext} context The view controller context.
     */
    constructor(context: ICustomViewControllerContext) {
        let config: ICustomViewControllerConfiguration = {
            title: "Product Recognition Camera",
            commandBar: {
                commands: [
                    {
                        name: "CaptureCommand",
                        label: "Capture",
                        icon: Icons.CashDrawer, // Using CashDrawer as camera icon placeholder
                        isVisible: true,
                        canExecute: false,
                        execute: (): void => {
                            this.captureImage();
                        }
                    },
                    {
                        name: "CancelCommand",
                        label: "Cancel",
                        icon: Icons.Cancel,
                        isVisible: true,
                        canExecute: true,
                        execute: (): void => {
                            this.cancelCamera();
                        }
                    }
                ]
            }
        };

        super(context, config);
        this.statusMessage = ko.observable("Initializing camera...");
        this.isCameraReady = ko.observable(false);
        this.cameraViewModel = new CameraViewModel();
    }

    /**
     * The onReady function is called when the page element has been added to the DOM.
     * @param {HTMLElement} element The root element for the view.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        const videoEl = element.querySelector("#camera-preview") as HTMLVideoElement;
        const canvasEl = element.querySelector("#capture-canvas") as HTMLCanvasElement;

        // Initialize camera view model with status callback
        this.cameraViewModel.initialize(videoEl, canvasEl, (message, type) => {
            this.statusMessage(message);
        });

        this.initializeCamera();
    }

    /**
     * Initializes the camera stream.
     */
    private async initializeCamera(): Promise<void> {
        try {
            await this.cameraViewModel.startCamera("environment");

            this.isCameraReady(true);

            // Enable capture button
            const captureCommand = ArrayExtensions.firstOrUndefined(
                this.state.commandBar.commands,
                (c) => c.name === "CaptureCommand"
            );
            if (captureCommand) {
                captureCommand.canExecute = true;
            }
        } catch (error) {
            this.context.logger.logError("Camera initialization failed: " + error);
            this.isCameraReady(false);
        }
    }

    /**
     * Captures an image from the camera stream and executes product recognition.
     */
    private async captureImage(): Promise<void> {
        if (!this.cameraViewModel.isCameraActive()) {
            this.statusMessage("Camera not ready. Please wait...");
            return;
        }

        try {
            this.state.isProcessing = true;

            // Capture image using view model (full frame, horizontally flipped)
            const base64Data = this.cameraViewModel.captureImage(false, true);

            // Stop camera after capture
            this.cameraViewModel.stopCamera();

            // Execute product recognition request with captured image data
            const recognitionRequest = new ProductRecognitionRequest<ProductRecognitionResponse>(
                this.context.logger.getNewCorrelationId(),
                base64Data
            );

            try {
                await this.context.runtime.executeAsync(recognitionRequest);
            } catch (error) {
                this.context.logger.logError("Product recognition failed: " + error);
                this.statusMessage("Product recognition failed. Please try again.");
            }
        } catch (error) {
            this.context.logger.logError("Image capture failed: " + (error instanceof Error ? error.message : error));
            this.statusMessage(`Capture failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            this.state.isProcessing = false;
        }
    }

    /**
     * Cancels the camera and navigates back.
     */
    private cancelCamera(): void {
        this.cameraViewModel.stopCamera();
        this.context.navigator.navigateBack();
    }

    /**
     * The onHidden method is called when the view is hidden.
     */
    public onHidden(): void {
        this.cameraViewModel.stopCamera();
    }

    /**
     * The dispose method is called when the view is removed from the DOM.
     */
    public dispose(): void {
        this.cameraViewModel.dispose();
        ObjectExtensions.disposeAllProperties(this);
    }
}
