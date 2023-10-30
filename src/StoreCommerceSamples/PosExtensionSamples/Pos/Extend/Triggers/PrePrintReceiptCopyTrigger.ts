/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/PrintingTriggers";
import { ProxyEntities } from "PosApi/Entities";
import { ArrayExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import { ClientEntities } from "PosApi/Entities";
import { GetReceiptsClientRequest, GetReceiptsClientResponse } from "PosApi/Consume/SalesOrders";

export default class PrePrintReceiptCopyTrigger extends Triggers.PrePrintReceiptCopyTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPrePrintReceiptCopyTriggerOptions} options The options provided to the trigger.
     * @return {Promise<ClientEntities.ICancelable>} The cancelable promise.
     */
    public execute(options: Triggers.IPrePrintReceiptCopyTriggerOptions): Promise<ClientEntities.ICancelable> {
        this.context.logger.logVerbose("Executing PreProductSaleTrigger with options " + JSON.stringify(options) + ".");
        let receiptPair: { receipt: ProxyEntities.Receipt, printer: ProxyEntities.Printer } = ArrayExtensions.firstOrUndefined(options.receiptAndPrinterPairs);
        let criteria: ProxyEntities.ReceiptRetrievalCriteria = {
            IsCopy: true,
            ReceiptTypeValue: ObjectExtensions.isNullOrUndefined(receiptPair) ? ProxyEntities.ReceiptType.Unknown : receiptPair.receipt.ReceiptTypeValue,
            IsRemoteTransaction: false
        };

        let request: GetReceiptsClientRequest<GetReceiptsClientResponse> = new GetReceiptsClientRequest(options.salesOrder.Id, criteria);

        return this.context.runtime.executeAsync(request)
            .then((response: ClientEntities.ICancelableDataResult<GetReceiptsClientResponse>): ClientEntities.ICancelable => {
                return response;
            });
    }
}