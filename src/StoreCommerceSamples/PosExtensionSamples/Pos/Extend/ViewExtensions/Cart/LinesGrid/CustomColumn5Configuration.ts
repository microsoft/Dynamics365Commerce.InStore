/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    ICustomLinesGridColumnContext,
    CustomLinesGridColumnBase
} from "PosApi/Extend/Views/CartView";
import { CustomGridColumnAlignment } from "PosApi/Extend/Views/CustomGridColumns";
import { ProxyEntities } from "PosApi/Entities";

/**
 * HOW TO ENABLE THIS SAMPLE
 *
 * 1) In HQ, go to Retail > Channel setup > POS > Screen layouts
 * 2) Filter results to "Fabrikam Manager"
 * 3) Under Layout sizes, select the resolution of your MPOS, and click on Layout designer
 * 4) Download, run and sign in to the designer.
 * 5) Right click on Lines, and click on customize.
 * 6) Find CUSTOM COLUMN 5 in Available columns and move it to Selected columns.
 * 7) Click OK and close the designer.
 * 8) Back in HQ, Go to Retail > Retail IT > Distribution schedule.
 * 9) Select job "9999" and click on Run now.
 */

export default class LinesCustomGridColumn5 extends CustomLinesGridColumnBase {

    constructor(context: ICustomLinesGridColumnContext) {
        super(context);
    }

    /**
     * Gets the column title.
     * @returns {string} The column title.
     */
    public title(): string {
        return this.context.resources.getString("string_74");
    }

    /**
     * Computes the value to display in the column.
     * @param cartLine The cart line.
     * @returns {string} The value to display in the column.
     */
    public computeValue(cartLine: ProxyEntities.CartLine): string {
        return cartLine.Comment;
    }

    /**
     * Gets the alignment of the column.
     * @returns {CustomGridColumnAlignment} The alignment.
     */
    public alignment(): CustomGridColumnAlignment {
        return CustomGridColumnAlignment.Left;
    }
}