/**
 * Interface for the camera capture dialog result.
 */
export default interface ICameraCaptureDialogResult {
    /**
     * Base64 encoded image data captured from the camera.
     */
    imageData: string;

    /**
     * Whether the capture was successful.
     */
    success: boolean;

    /**
     * Error message if capture failed.
     */
    errorMessage?: string;
}
