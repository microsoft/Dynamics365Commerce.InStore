import { ChangeCartLineUnitOfMeasureOperationRequest, ChangeCartLineUnitOfMeasureOperationResponse } from "PosApi/Consume/Cart";
import { ProxyEntities } from "PosApi/Entities";
import { IPostProductSaleTriggerOptions, PostProductSaleTrigger } from "PosApi/Extend/Triggers/ProductTriggers";
import { ObjectExtensions, ArrayExtensions } from "PosApi/TypeExtensions";

/**
 * Example implementation of a PostProductSale trigger that executes ChangeUnitOfMeasureClientRequest for Product 81212 when modifying the cart.
 */
export default class ChangeUnitOfMeasurePostProductSaleTrigger extends PostProductSaleTrigger {

    /**
     * Executes the trigger functionality.
     * @param {IPostProductSaleTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: IPostProductSaleTriggerOptions): Promise<void> {
        this.context.logger.logInformational("Executing ChangeUnitOfMeasurePostProductSaleTrigger with options " + JSON.stringify(options) + ".");

        // Check if there any cart lines
        if (!ObjectExtensions.isNullOrUndefined(options.cart) && !ObjectExtensions.isNullOrUndefined(options.cart.CartLines)) {
            // Check if specific product is in the cart
            let cartLine: ProxyEntities.CartLine =
                ArrayExtensions.firstOrUndefined(options.cart.CartLines, (cl: ProxyEntities.CartLine) => {
                    return cl.ItemId === "81212";
                });

            // If the product is in the cart, update its unit of measure
            if (!ObjectExtensions.isNullOrUndefined(cartLine)) {
                let changeUnitOfMeasureClientRequest: ChangeCartLineUnitOfMeasureOperationRequest<ChangeCartLineUnitOfMeasureOperationResponse> =
                    new ChangeCartLineUnitOfMeasureOperationRequest(
                        cartLine.LineId,
                        this.context.logger.getNewCorrelationId(),
                        { DecimalPrecision: 0, Symbol: "dz", Description: "Dozen", ExtensionProperties: [] }
                    );

                this.context.runtime.executeAsync(changeUnitOfMeasureClientRequest);
            }
        }

        return Promise.resolve();
    }
}