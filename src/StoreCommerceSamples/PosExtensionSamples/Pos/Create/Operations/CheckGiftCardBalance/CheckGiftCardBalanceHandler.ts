/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ExtensionOperationRequestType, ExtensionOperationRequestHandlerBase } from "PosApi/Create/Operations";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import CheckGiftCardBalanceRequest from "./CheckGiftCardBalanceRequest";
import CheckGiftCardBalanceResponse from "./CheckGiftCardBalanceResponse";
import GiftCardBalanceDialog from "../../Dialogs/GiftCardBalanceDialog/GiftCardBalanceDialog";
import GiftCardNumberDialog from "../../Dialogs/GiftCardNumberDialog";

/**
 * (Sample) Request handler for the CheckGiftCardBalanceRequest class.
 */
export default class CheckGiftCardBalanceHandler<TResponse extends CheckGiftCardBalanceResponse> extends ExtensionOperationRequestHandlerBase<TResponse> {
    /**
     * Gets the supported request type.
     * @return {RequestType<TResponse>} The supported request type.
     */
    public supportedRequestType(): ExtensionOperationRequestType<TResponse> {
        return CheckGiftCardBalanceRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {CheckGiftCardBalanceRequest<TResponse>} request The request.
     * @return {Promise<ICancelableDataResult<TResponse>>} The cancelable async result containing the response.
     */
    public executeAsync(request: CheckGiftCardBalanceRequest<TResponse>): Promise<ClientEntities.ICancelableDataResult<TResponse>> {

        this.context.logger.logInformational("Log message from CheckGiftCardBalanceHandler executeAsync().", this.context.logger.getNewCorrelationId());

        let giftCardNumberDialog: GiftCardNumberDialog = new GiftCardNumberDialog();
        return giftCardNumberDialog.show(this.context, request.correlationId).then((result: ClientEntities.ICancelableDataResult<ProxyEntities.GiftCard>)
            : Promise<ClientEntities.ICancelableDataResult<TResponse>> => {

            if (result.canceled) {
                return Promise.resolve({ canceled: true, data: null });
            }

            let giftCardBalanceDialog: GiftCardBalanceDialog = new GiftCardBalanceDialog();
            return giftCardBalanceDialog.open(result.data).then(() => {
                return Promise.resolve({ canceled: false, data: <TResponse>new CheckGiftCardBalanceResponse() });
            });
        });
    }
}