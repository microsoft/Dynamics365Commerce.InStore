/**
 * Shared camera view model for handling camera operations.
 * This class encapsulates common camera functionality used by both CameraView and CameraCaptureDialog.
 */
export default class CameraViewModel {
    private videoElement: HTMLVideoElement | null = null;
    private canvasElement: HTMLCanvasElement | null = null;
    private mediaStream: MediaStream | null = null;
    private statusCallback: ((message: string, type: "success" | "error" | "warning" | "info") => void) | null = null;

    /**
     * Initializes the camera view model with DOM elements.
     * @param videoElement The video element for camera preview.
     * @param canvasElement The canvas element for image capture.
     * @param statusCallback Optional callback for status updates.
     */
    public initialize(
        videoElement: HTMLVideoElement,
        canvasElement: HTMLCanvasElement,
        statusCallback?: (message: string, type: "success" | "error" | "warning" | "info") => void
    ): void {
        this.videoElement = videoElement;
        this.canvasElement = canvasElement;
        this.statusCallback = statusCallback || null;
    }

    /**
     * Starts the camera stream with the specified constraints.
     * @param facingMode The camera facing mode ("environment" or "user").
     * @returns Promise that resolves when camera is ready.
     */
    public async startCamera(facingMode: "environment" | "user" = "environment"): Promise<void> {
        if (!this.videoElement) {
            throw new Error("Video element not initialized");
        }

        try {
            this.updateStatus("Requesting camera access...", "warning");

            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    aspectRatio: { ideal: 16 / 9 }
                },
                audio: false
            };

            this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoElement.srcObject = this.mediaStream;

            await new Promise<void>((resolve) => {
                if (!this.videoElement) {
                    resolve();
                }

                this.videoElement.onloadedmetadata = () => {
                    resolve();
                };
            });

            await this.videoElement.play();

            this.updateStatus("Camera ready - Position product in frame and capture", "success");

        } catch (error) {
            console.error("Camera initialization failed:", error);

            let errorMessage = "Camera access failed";
            if (error?.name === "NotAllowedError") {
                errorMessage = "Camera permission denied. Please allow camera access and try again.";
            } else if (error?.name === "NotFoundError") {
                errorMessage = "No camera found. Please connect a camera and try again.";
            } else if (error?.name === "NotReadableError") {
                errorMessage = "Camera is already in use by another application.";
            }

            this.updateStatus(errorMessage, "error");
            throw error;
        }
    }

    /**
     * Captures an image from the camera stream.
     * @param cropToSquare Whether to crop the image to a square (center-cropped).
     * @param flipHorizontally Whether to flip the image horizontally.
     * @returns Base64 encoded JPEG image data (without the data URL prefix).
     */
    public captureImage(cropToSquare: boolean = false, flipHorizontally: boolean = true): string {
        if (!this.videoElement || !this.canvasElement) {
            throw new Error("Camera elements not initialized");
        }

        if (!this.mediaStream || !this.videoElement.videoWidth || !this.videoElement.videoHeight) {
            throw new Error("Camera not ready");
        }

        try {
            this.updateStatus("Capturing image...", "warning");

            const streamWidth = this.videoElement.videoWidth;
            const streamHeight = this.videoElement.videoHeight;

            let captureWidth: number;
            let captureHeight: number;
            let sourceX: number = 0;
            let sourceY: number = 0;

            if (cropToSquare) {
                // Crop to center square
                const squareSize = Math.min(streamWidth, streamHeight);
                captureWidth = squareSize;
                captureHeight = squareSize;
                sourceX = (streamWidth - squareSize) / 2;
                sourceY = (streamHeight - squareSize) / 2;
            } else {
                // Use full frame
                captureWidth = streamWidth;
                captureHeight = streamHeight;
            }

            // Set canvas dimensions
            this.canvasElement.width = captureWidth;
            this.canvasElement.height = captureHeight;

            const context = this.canvasElement.getContext("2d");
            if (!context) {
                throw new Error("Could not get canvas context");
            }

            // Apply horizontal flip if requested
            if (flipHorizontally) {
                context.save();
                context.scale(-1, 1);
                context.drawImage(
                    this.videoElement,
                    sourceX, sourceY, captureWidth, captureHeight,
                    -captureWidth, 0, captureWidth, captureHeight
                );
                context.restore();
            } else {
                context.drawImage(
                    this.videoElement,
                    sourceX, sourceY, captureWidth, captureHeight,
                    0, 0, captureWidth, captureHeight
                );
            }

            // Convert to base64 JPEG
            const imageDataUrl = this.canvasElement.toDataURL("image/jpeg", 0.8);
            const base64Data = imageDataUrl.split(",")[1];

            this.updateStatus("Image captured successfully!", "success");

            return base64Data;

        } catch (error) {
            console.error("Image capture failed:", error);
            const errorMessage = `Capture failed: ${error instanceof Error ? error.message : "Unknown error"}`;
            this.updateStatus(errorMessage, "error");
            throw error;
        }
    }

    /**
     * Stops the camera stream and releases resources.
     */
    public stopCamera(): void {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }

        if (this.videoElement) {
            this.videoElement.srcObject = null;
        }
    }

    /**
     * Checks if the camera is currently active.
     * @returns True if camera stream is active.
     */
    public isCameraActive(): boolean {
        return this.mediaStream !== null &&
            this.videoElement !== null &&
            this.videoElement.videoWidth > 0 &&
            this.videoElement.videoHeight > 0;
    }

    /**
     * Gets the current video dimensions.
     * @returns Object containing width and height, or null if camera is not active.
     */
    public getVideoDimensions(): { width: number; height: number } | null {
        if (!this.videoElement || !this.isCameraActive()) {
            return null;
        }

        return {
            width: this.videoElement.videoWidth,
            height: this.videoElement.videoHeight
        };
    }

    /**
     * Updates the status via callback if provided.
     * @param message The status message.
     * @param type The status type.
     */
    private updateStatus(message: string, type: "success" | "error" | "warning" | "info" = "info"): void {
        if (this.statusCallback) {
            this.statusCallback(message, type);
        }
    }

    /**
     * Disposes the view model and releases all resources.
     */
    public dispose(): void {
        this.stopCamera();
        this.videoElement = null;
        this.canvasElement = null;
        this.statusCallback = null;
    }
}
