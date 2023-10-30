/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    ShowAlphanumericInputDialogClientRequest, ShowAlphanumericInputDialogClientResponse,
    IAlphanumericInputDialogOptions, IAlphanumericInputDialogResult, ShowAlphanumericInputDialogError
} from "PosApi/Consume/Dialogs";
import { GetGiftCardByIdServiceRequest, GetGiftCardByIdServiceResponse } from "PosApi/Consume/Payments";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";

/**
 * (Sample) Dialog for getting a gift card entity by its number.
 */
export default class GiftCardNumberDialog {

    /**
     * Shows the GiftCardNumberDialog.
     * @param {IExtensionContext} context The extension context contained runtime to execute async requests.
     * @param {string} correlationId The correlation identifier.
     * @return {Promise<ProxyEntities.GiftCard>} The result from message dialog.
     */
    public show(context: IExtensionContext, correlationId: string): Promise<ClientEntities.ICancelableDataResult<ProxyEntities.GiftCard>> {

        let giftCard: ProxyEntities.GiftCard = null;
        let alphanumericInputDialogOptions: IAlphanumericInputDialogOptions = {
            title: "Gift card balance",
            subTitle: "Enter the card number to check the balance on the gift card.",
            numPadLabel: "Card number",
            enableBarcodeScanner: true,
            enableMagneticStripReader: true,
            onBeforeClose: ((result: ClientEntities.ICancelableDataResult<IAlphanumericInputDialogResult>): Promise<void> => {

                return this._onBeforeClose(result, context, correlationId).then((result: ProxyEntities.GiftCard) => {
                    giftCard = result;
                });
            })
        };

        let dialogRequest: ShowAlphanumericInputDialogClientRequest<ShowAlphanumericInputDialogClientResponse> =
            new ShowAlphanumericInputDialogClientRequest<ShowAlphanumericInputDialogClientResponse>(alphanumericInputDialogOptions);

        return context.runtime.executeAsync(dialogRequest).then((result: ClientEntities.ICancelableDataResult<ShowAlphanumericInputDialogClientResponse>) => {
            return Promise.resolve({ canceled: result.canceled, data: result.canceled ? null : giftCard });
        });
    }

    /**
     * Decides what to do with the dialog based on the button pressed and input.
     * @param {ClientEntities.ICancelableDataResult<IAlphanumericInputDialogResult>} result Input result of dialog.
     * @param {IExtensionContext} context The context object passed to all POS extensions.
     * @param {string} correlationId A telemetry correlation ID, used to group events logged from this request together with the calling context.
     * @returns {Promise<ProxyEntities.GiftCard>} The returned promise.
     */
    private _onBeforeClose(
        result: ClientEntities.ICancelableDataResult<IAlphanumericInputDialogResult>,
        context: IExtensionContext,
        correlationId: string): Promise<ProxyEntities.GiftCard> {

        if (!result.canceled) {
            if (!ObjectExtensions.isNullOrUndefined(result.data)) {
                const incorrectNumberMessage: string = "The gift card number does not exist. Enter another number.";
                return this._getGiftCardByIdAsync(result.data.value, context, correlationId).then((result: ProxyEntities.GiftCard) => {
                    if (!ObjectExtensions.isNullOrUndefined(result)) {
                        return Promise.resolve(result);
                    } else {
                        let error: ShowAlphanumericInputDialogError = new ShowAlphanumericInputDialogError(incorrectNumberMessage);
                        return Promise.reject(error);
                    }
                }).catch((reason: any) => {
                    let error: ShowAlphanumericInputDialogError = new ShowAlphanumericInputDialogError(incorrectNumberMessage);
                    return Promise.reject(error);
                });

            } else {
                const noNumberMessage: string = "The gift card number is required. Enter the gift card number, and then try again.";
                let error: ShowAlphanumericInputDialogError = new ShowAlphanumericInputDialogError(noNumberMessage);
                return Promise.reject(error);
            }
        } else {
            return Promise.resolve(null);
        }
    }

    /**
     * Gets the gift card by card ID.
     * @param {string} giftCardId The gift card ID.
     * @param {IExtensionContext} context The context object passed to all POS extensions.
     * @param {string} correlationId A telemetry correlation ID, used to group events logged from this request together with the calling context.
     * @returns {Promise<Proxy.Entities.GiftCard>} The async result.
     */
    private _getGiftCardByIdAsync(giftCardId: string, context: IExtensionContext, correlationId: string): Promise<ProxyEntities.GiftCard> {
        let request: GetGiftCardByIdServiceRequest<GetGiftCardByIdServiceResponse> = new GetGiftCardByIdServiceRequest(correlationId, giftCardId);
        return context.runtime.executeAsync(request).then((response: ClientEntities.ICancelableDataResult<GetGiftCardByIdServiceResponse>) => {
            return Promise.resolve(response.canceled ? null : response.data.giftCard);
        });
    }
}