/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/TransactionTriggers";
import { ProxyEntities, ClientEntities } from "PosApi/Entities";
import {
    GetTaxOverridesServiceRequest,
    GetTaxOverridesServiceResponse,
    OverrideTransactionTaxOperationRequest
} from "PosApi/Consume/Cart";
import { ArrayExtensions } from "PosApi/TypeExtensions";

/**
 * Example implementation of a PreEndTransaction trigger that execute GetTaxOverridesServiceRequest and OverrideTransactionTaxOperationRequest.
 */
export default class OverrideTaxPreEndTransactionTrigger extends Triggers.PreEndTransactionTrigger {

    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPreEndTransactionTriggerOptions} options The options provided to the trigger.
     * @return {Promise<ICancelable>} The cancelable promise.
     */
    public execute(options: Triggers.IPreEndTransactionTriggerOptions): Promise<ClientEntities.ICancelable> {

        // This code is example for executing GetTaxOverridesServiceRequest and GetTaxOverridesServiceResponse.
        this.context.logger.logInformational("Executing OverrideTaxPreEndTransactionTrigger with options " + JSON.stringify(options) + ".");
        let correlationId: string = this.context.logger.getNewCorrelationId();

        let getTaxOverridesServiceRequest: GetTaxOverridesServiceRequest =
            new GetTaxOverridesServiceRequest(correlationId, ProxyEntities.TaxOverrideBy.Cart);

        return this.context.runtime.executeAsync(getTaxOverridesServiceRequest)
            .then((result: ClientEntities.ICancelableDataResult<GetTaxOverridesServiceResponse>): Promise<ClientEntities.ICancelable> => {

                if (ArrayExtensions.hasElements(result.data.taxOverrides)) {
                    let overrideTransactionTaxOperationRequest: OverrideTransactionTaxOperationRequest =
                        new OverrideTransactionTaxOperationRequest(correlationId, result.data.taxOverrides[0].Code);

                    return this.context.runtime.executeAsync(overrideTransactionTaxOperationRequest);
                }

                return Promise.reject(new ClientEntities.ExtensionError("Could not override tax. No sales tax group has been set up for the store"));
            });
    }
}