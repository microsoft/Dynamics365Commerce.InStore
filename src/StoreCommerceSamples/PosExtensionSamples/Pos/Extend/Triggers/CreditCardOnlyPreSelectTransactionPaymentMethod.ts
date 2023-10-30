import { IPreSelectTransactionPaymentMethodTriggerOptions, PreSelectTransactionPaymentMethod } from "PosApi/Extend/Triggers/TransactionTriggers";
import { CancelableTriggerResult } from "PosApi/Extend/Triggers/Triggers";
import { ObjectExtensions } from "PosApi/TypeExtensions";

/**
 * Example implementation of a PreSelectTransactionPaymentMethod trigger that filters out all non-credit card payment methods.
 */
export default class CreditCardOnlyPreSelectTransactionPaymentMethod extends PreSelectTransactionPaymentMethod {

    /**
     * Executes the trigger functionality.
     * @param {IPreSelectTransactionPaymentMethodTriggerOptions} options The options provided to the trigger.
     * @return {Promise<CancelableTriggerResult<IPreSelectTransactionPaymentMethodTriggerOptions>>} The cancelable promise containing the response.
     */
    public execute(options: IPreSelectTransactionPaymentMethodTriggerOptions): Promise<CancelableTriggerResult<IPreSelectTransactionPaymentMethodTriggerOptions>> {
        this.context.logger.logInformational("Executing CreditCardOnlyPreSelectTransactionPaymentMethod with options " + JSON.stringify(options) + ".");

        // Check if any payment options are configured.
        if (!ObjectExtensions.isNullOrUndefined(options.tenderTypes) && options.tenderTypes.length > 0) {
            // Filter out all non-credit card options.
            options.tenderTypes = options.tenderTypes.filter(value => {
                return (value.Name == "Cards");
            });
        }

        // Return non-canceled result with modified data options.
        return Promise.resolve(new CancelableTriggerResult<IPreSelectTransactionPaymentMethodTriggerOptions>(false, options))
    }
}