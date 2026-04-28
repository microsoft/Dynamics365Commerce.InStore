import { ExtensionTemplatedDialogBase, ITemplatedDialogOptions } from "PosApi/Create/Dialogs";
import { ObjectExtensions } from "PosApi/TypeExtensions";

import ICameraCaptureDialogResult from "./ICameraCaptureDialogResult";
import CameraViewModel from "../../Views/CameraViewModel";

type CameraCaptureDialogResolveFunction = (value: ICameraCaptureDialogResult) => void;
type CameraCaptureDialogRejectFunction = (reason: any) => void;

/**
 * Camera capture dialog for product recognition.
 */
export default class CameraCaptureDialog extends ExtensionTemplatedDialogBase {
    private captureButton: HTMLButtonElement;
    private cancelButton: HTMLButtonElement;
    private statusElement: HTMLElement;
    private resolve: CameraCaptureDialogResolveFunction;
    private cameraViewModel: CameraViewModel;

    /**
     * Creates an instance of CameraCaptureDialog.
     */
    constructor() {
        super();
        this.cameraViewModel = new CameraViewModel();
    }

    /**
     * Called when the dialog element is ready and added to the DOM.
     * @param element The dialog element.
     */
    public onReady(element: HTMLElement): void {
        const videoElement = element.querySelector("#camera-preview-dialog") as HTMLVideoElement;
        const canvasElement = element.querySelector("#capture-canvas-dialog") as HTMLCanvasElement;
        this.captureButton = element.querySelector("#capture-btn") as HTMLButtonElement;
        this.cancelButton = element.querySelector("#cancel-btn") as HTMLButtonElement;
        this.statusElement = element.querySelector("#camera-status .status-message") as HTMLElement;

        this.captureButton.addEventListener("click", () => this.captureImage());
        this.cancelButton.addEventListener("click", () => this.cancelDialog());

        // Initialize camera view model with status callback
        this.cameraViewModel.initialize(videoElement, canvasElement, (message, type) => {
            this.updateStatus(message, type);
        });

        this.initializeCamera();
    }

    /**
     * Opens the camera capture dialog.
     * @returns Promise containing the dialog result.
     */
    public open(): Promise<ICameraCaptureDialogResult> {
        let promise: Promise<ICameraCaptureDialogResult> = new Promise((resolve: CameraCaptureDialogResolveFunction, reject: CameraCaptureDialogRejectFunction) => {
            this.resolve = resolve;

            const dialogOptions: ITemplatedDialogOptions = {
                title: "Product Recognition Camera",
                onCloseX: this.cancelButtonClickHandler.bind(this)
            };

            this.openDialog(dialogOptions);
        });

        return promise;
    }

    /**
     * Handles the cancel button click.
     * @returns True if the dialog should close.
     */
    private cancelButtonClickHandler(): boolean {
        this.resolvePromise({
            imageData: "",
            success: false,
            errorMessage: "User canceled camera capture"
        });
        return false;
    }

    /**
     * Initializes the camera stream.
     */
    private async initializeCamera(): Promise<void> {
        try {
            await this.cameraViewModel.startCamera("environment");
            this.captureButton.disabled = false;
        } catch (error) {
            console.error("Camera initialization failed:", error);
            this.captureButton.disabled = true;
        }
    }

    /**
     * Captures an image from the camera stream.
     */
    private captureImage(): void {
        if (!this.cameraViewModel.isCameraActive()) {
            this.updateStatus("Camera not ready. Please wait...", "error");
            return;
        }

        try {
            // Capture image using view model (square crop, horizontally flipped)
            const base64Data = this.cameraViewModel.captureImage(true, true);

            // Stop camera stream
            this.cameraViewModel.stopCamera();

            // Return the result
            const result: ICameraCaptureDialogResult = {
                imageData: base64Data,
                success: true
            };

            this.resolvePromise(result);

        } catch (error) {
            console.error("Image capture failed:", error);
            this.updateStatus(`Capture failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
        }
    }

    /**
     * Cancels the dialog and stops the camera.
     */
    private cancelDialog(): void {
        this.cameraViewModel.stopCamera();

        const result: ICameraCaptureDialogResult = {
            imageData: "",
            success: false,
            errorMessage: "User canceled camera capture"
        };

        this.resolvePromise(result);
    }

    /**
     * Updates the status message display.
     * @param message The status message to display.
     * @param type The type of status (success, error, warning).
     */
    private updateStatus(message: string, type: "success" | "error" | "warning" | "info" = "info"): void {
        if (this.statusElement) {
            this.statusElement.textContent = message;

            this.statusElement.classList.remove("status-success", "status-error", "status-warning");

            if (type !== "info") {
                this.statusElement.classList.add(`status-${type}`);
            }
        }
    }

    /**
     * Resolves the dialog promise with the specified result.
     * @param result The result to resolve with.
     */
    private resolvePromise(result: ICameraCaptureDialogResult): void {
        if (ObjectExtensions.isFunction(this.resolve)) {
            this.resolve(result);
            this.resolve = null;
            this.closeDialog();
        }
    }
}
