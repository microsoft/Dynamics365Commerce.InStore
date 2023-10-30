/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/ProductTriggers";
import { ProxyEntities } from "PosApi/Entities";
import { ChangeCartLineUnitOfMeasureOperationRequest, ChangeCartLineUnitOfMeasureOperationResponse } from "PosApi/Consume/Cart";
import { ObjectExtensions, ArrayExtensions } from "PosApi/TypeExtensions";

/**
 * Example implementation of an PostProductSale trigger that execute ChangeUnitOfMeasureClientRequest for different products and different options.
 */
export default class ChangeUnitOfMeasurePostProductSaleTrigger extends Triggers.PostProductSaleTrigger {

    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPostProductSaleTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IPostProductSaleTriggerOptions): Promise<void> {

        // Set "true" to enable this sample.
        const enabled: boolean = false;

        if (enabled) {
            // This code is example for executing ChangeCartLineUnitOfMeasureOperationRequest.
            // The dialog of choice for unit of measure will be prompted when "unitOfMeasure" parameter of "ChangeCartLineUnitOfMeasureOperationRequest" request
            // is not provided.Otherwise the dialog won't appear.
            if (!ObjectExtensions.isNullOrUndefined(options.cart) && !ObjectExtensions.isNullOrUndefined(options.cart.CartLines)) {

                return this.doChangeUnitOfMeasure(options, "81211")
                    .then((): Promise<any> =>
                        this.doChangeUnitOfMeasure(options, "81212", { DecimalPrecision: 0, Symbol: "pcs", Description: "Pieces", ExtensionProperties: [] }));
            }
        }

        this.context.logger.logInformational("Executing ChangeUnitOfMeasurePostProductSaleTrigger with options " + JSON.stringify(options) + ".");
        return Promise.resolve();
    }

    /**
     * Executes ChangeCartLineUnitOfMeasureOperationRequest.
     * @param options The options provided to the trigger.
     * @param itemId The item identifier.
     * @param unitOfMeasure The unit of measure.
     * @returns {Promise<any>} The promise.
     */
    private doChangeUnitOfMeasure(
        options: Triggers.IPostProductSaleTriggerOptions,
        itemId: string,
        unitOfMeasure?: ProxyEntities.UnitOfMeasure): Promise<any> {

        let cartLine: ProxyEntities.CartLine =
            ArrayExtensions.firstOrUndefined(options.cart.CartLines, (cl: ProxyEntities.CartLine) => {
                return cl.ItemId === itemId;
        });

        if (!ObjectExtensions.isNullOrUndefined(cartLine)) {

            let changeUnitOfMeasureClientRequest: ChangeCartLineUnitOfMeasureOperationRequest<ChangeCartLineUnitOfMeasureOperationResponse> =
                new ChangeCartLineUnitOfMeasureOperationRequest(cartLine.LineId, this.context.logger.getNewCorrelationId(), unitOfMeasure);

            return this.context.runtime.executeAsync(changeUnitOfMeasureClientRequest);
        }

        return Promise.resolve();
    }
}