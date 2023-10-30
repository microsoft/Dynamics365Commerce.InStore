import { ClientEntities } from "PosApi/Entities";
import { IPreProductSaleTriggerOptions, PreProductSaleTrigger } from "PosApi/Extend/Triggers/ProductTriggers";

/**
 * Example implementation of a PreProductSaleTrigger trigger that throws an error when trying to add Product 81213 to the cart.
 */
export default class ForceErrorPreProductSaleTrigger extends PreProductSaleTrigger {
    /**
     * Executes the trigger functionality.
     * @param {IPreProductSaleTriggerOptions} options The options provided to the trigger.
     * @return {Promise<ICancelable>} The cancelable promise.
     */
    public execute(options: IPreProductSaleTriggerOptions): Promise<ClientEntities.ICancelable> {
        this.context.logger.logInformational("Executing ForceErrorPreProductSaleTrigger with options " + JSON.stringify(options) + ".");

        // If trying to add product 81213 to the cart, then return error from trigger...
        if (options.productSaleDetails.length > 0 && options.productSaleDetails[0].product.ItemId == "81213") {
            return Promise.reject(new ClientEntities.ExtensionError("Product 81213 is not available."));
        // ... else do not block the trigger flow.
        } else {
            return Promise.resolve({ canceled: false });
        }
    }
}