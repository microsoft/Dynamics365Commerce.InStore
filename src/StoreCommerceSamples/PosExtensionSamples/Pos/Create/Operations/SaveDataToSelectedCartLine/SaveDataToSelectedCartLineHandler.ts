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
import { StringExtensions } from "PosApi/TypeExtensions";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import {
    SaveExtensionPropertiesOnCartLinesClientRequest, SaveExtensionPropertiesOnCartLinesClientResponse,
    GetCurrentCartClientRequest, GetCurrentCartClientResponse
} from "PosApi/Consume/Cart";
import {
    IListInputDialogItem, IListInputDialogOptions,
    ShowListInputDialogClientRequest, ShowListInputDialogClientResponse
} from "PosApi/Consume/Dialogs";
import SaveDataToSelectedCartLineResponse from "./SaveDataToSelectedCartLineResponse";
import SaveDataToSelectedCartLineRequest from "./SaveDataToSelectedCartLineRequest";
import CartViewController from "../../../Extend/ViewExtensions/Cart/CartViewController";

/**
 * (Sample) Request handler for the SaveDataToSelectedCartLineHandler class.
 */
export default class SaveDataToSelectedCartLineHandler<TResponse extends SaveDataToSelectedCartLineResponse>
    extends ExtensionOperationRequestHandlerBase<TResponse> {

    /**
     * Gets the supported request type.
     * @return {RequestType<TResponse>} The supported request type.
     */
    public supportedRequestType(): ExtensionOperationRequestType<TResponse> {
        return SaveDataToSelectedCartLineRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {SaveDataToSelectedCartLineRequest<TResponse>} request The request.
     * @return {Promise<ICancelableDataResult<TResponse>>} The cancelable async result containing the response.
     */
    public executeAsync(request: SaveDataToSelectedCartLineRequest<TResponse>): Promise<ClientEntities.ICancelableDataResult<TResponse>> {

        this.context.logger.logInformational("Log message from SaveDataToSelectedCartLineHandler executeAsync().", request.correlationId);

        let getCurrentCartClientRequest: GetCurrentCartClientRequest<GetCurrentCartClientResponse> = new GetCurrentCartClientRequest(request.correlationId);

        return this.context.runtime.executeAsync(getCurrentCartClientRequest)
            .then((getCurrentCartClientResponse: ClientEntities.ICancelableDataResult<GetCurrentCartClientResponse>) => {
                if (getCurrentCartClientResponse.canceled) {
                    return Promise.resolve(<ClientEntities.ICancelableDataResult<TResponse>>{ canceled: true, data: null });
                }

                /**
                 * Get the currently selected cart line from the CartViewController.
                 * If there isn't a cart line currently selected prompt the user to select a cart line.
                 */
                let selectedCartLineId: string = CartViewController.selectedCartLineId;
                if (StringExtensions.isNullOrWhitespace(selectedCartLineId)) {
                    return this._showDialog(this.context, getCurrentCartClientResponse.data.result)
                        .then((dialogResult: ClientEntities.ICancelableDataResult<string>) => {
                            if (dialogResult.canceled) {
                                return Promise.resolve(<ClientEntities.ICancelableDataResult<TResponse>>{ canceled: true, data: null });
                            }

                            return this._saveDataToCartLineByCartLineId(
                                dialogResult.data,
                                request.installationDate,
                                request.correlationId,
                                getCurrentCartClientResponse.data.result);
                        });
                } else {
                    return this._saveDataToCartLineByCartLineId(
                        selectedCartLineId,
                        request.installationDate,
                        request.correlationId,
                        getCurrentCartClientResponse.data.result);
                }
            });
    }

    private _saveDataToCartLineByCartLineId(cartLineId: string, value: string, correlationId: string, cart: ProxyEntities.Cart):
        Promise<ClientEntities.ICancelableDataResult<TResponse>> {

        let cartLineExtensionProperty: ProxyEntities.CommerceProperty = new ProxyEntities.CommercePropertyClass();
        cartLineExtensionProperty.Key = "installationDate";
        cartLineExtensionProperty.Value = new ProxyEntities.CommercePropertyValueClass();
        cartLineExtensionProperty.Value.StringValue = value;

        let extensionPropertiesOnCartLine: ClientEntities.IExtensionPropertiesOnCartLine = {
            cartLineId: cartLineId,
            extensionProperties: [cartLineExtensionProperty]
        };

        let saveExtensionPropertiesOnCartLinesClientRequest:
            SaveExtensionPropertiesOnCartLinesClientRequest<SaveExtensionPropertiesOnCartLinesClientResponse> =
            new SaveExtensionPropertiesOnCartLinesClientRequest([extensionPropertiesOnCartLine], correlationId);

        return this.context.runtime.executeAsync(saveExtensionPropertiesOnCartLinesClientRequest)
            .then((saveExtensionPropertiesResponse: ClientEntities.ICancelableDataResult<SaveExtensionPropertiesOnCartLinesClientResponse>) => {
                if (saveExtensionPropertiesResponse.canceled) {
                    return Promise.resolve(<ClientEntities.ICancelableDataResult<TResponse>>{ canceled: true, data: null });
                }

                return Promise.resolve(<ClientEntities.ICancelableDataResult<TResponse>>{
                    canceled: false,
                    data: new SaveDataToSelectedCartLineResponse(cart)
                });
            });
    }

    private _showDialog(context: IExtensionContext, cart: ProxyEntities.Cart): Promise<ClientEntities.ICancelableDataResult<string>> {

        let convertedListItems: IListInputDialogItem[] = cart.CartLines.map((cartLine: ProxyEntities.CartLine): IListInputDialogItem => {
            return {
                label: cartLine.Description, // string to be displayed for the given item
                value: cartLine.LineId // list data item that the string label represents
            };
        });

        let listInputDialogOptions: IListInputDialogOptions = {
            title: "Select cart line",
            subTitle: "Cart lines",
            items: convertedListItems
        };

        let dialogRequest: ShowListInputDialogClientRequest<ShowListInputDialogClientResponse> =
            new ShowListInputDialogClientRequest<ShowListInputDialogClientResponse>(listInputDialogOptions);

        return context.runtime.executeAsync(dialogRequest)
            .then((result: ClientEntities.ICancelableDataResult<ShowListInputDialogClientResponse>) => {
                if (result.canceled) {
                    return Promise.resolve(<ClientEntities.ICancelableDataResult<string>>{ canceled: true, data: StringExtensions.EMPTY });
                }

                return Promise.resolve(<ClientEntities.ICancelableDataResult<string>>{ canceled: false, data: result.data.result.value.value });
        });
    }
}