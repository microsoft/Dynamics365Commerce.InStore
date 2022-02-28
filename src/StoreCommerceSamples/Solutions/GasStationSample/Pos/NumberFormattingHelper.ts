export abstract class NumberFormattingHelper {

    /**
     * Gets the rounded value as a formatted string.
     * @param {number} value The value.
     * @param {number} decimalPrecision The decimal precision.
     * @returns {string} The formatted string value.
     */
    public static getRoundedStringValue(value: number, decimalPrecision: number): string {
        return NumberFormattingHelper.roundToNDigits(value, decimalPrecision).toFixed(decimalPrecision);
    }

    /**
     * Gets the rounded value.
     * @param {number} value The value to be rounded.
     * @param {number} decimalPrecision The decimal precision.
     * @returns {number} The rounded value.
     */
    public static roundToNDigits(value: number, decimalPrecision: number): number {
        if (decimalPrecision === 0) {
            return Math.round(value);
        }

        // Use this instead of toFixed otherwise it will not round anything, simply lose digits
        return Math.round(value * Math.pow(10, decimalPrecision)) / Math.pow(10, decimalPrecision);
    }
}