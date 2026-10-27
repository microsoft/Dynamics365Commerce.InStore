/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    ICustomLinesGridItemSubfieldContext,
    CustomLinesGridItemSubfieldBase
} from "PosApi/Extend/Views/CartView";
import { ProxyEntities } from "PosApi/Entities";

export default class StockItemSubfieldCustomContent extends CustomLinesGridItemSubfieldBase {

    constructor(context: ICustomLinesGridItemSubfieldContext) {
        super(context);
    }

    /**
     * Computes a value to display as an item subfield based on the given cart line.
     * @param {ProxyEntities.CartLine} cartLine The cart line.
     * @returns {string | Commerce.Extensibility.HtmlResponse} The computed value to display as an item subfield.
     */
    public computeValue(cartLine: ProxyEntities.CartLine): string | Commerce.Extensibility.HtmlResponse {
        let value = `<div style="line-height: 1.4;">
                        <span style="color: #0078d4; font-weight: 600;">Item:</span>
                        <span style="color: #323130;">${cartLine.ItemId}</span>
                        <br/>
                        <span style="color: #107c10; font-size: 0.9em;">In Stock ✓</span>
                    </div>`;

        return Commerce.Extensibility.createHtmlResponse(value);
    }
}