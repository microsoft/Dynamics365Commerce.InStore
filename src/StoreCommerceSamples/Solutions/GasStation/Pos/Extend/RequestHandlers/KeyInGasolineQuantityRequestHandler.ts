import { GetKeyedInQuantityClientRequestHandler } from "PosApi/Extend/RequestHandlers/CartRequestHandlers";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { GetCurrentCartClientRequest, GetCurrentCartClientResponse, GetKeyedInQuantityClientRequest, GetKeyedInQuantityClientResponse } from "PosApi/Consume/Cart";
import { GasStationDataStore } from "../../GasStationDataStore";
import { ArrayExtensions, ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";
import { GASOLINE_QUANTITY_EXTENSION_PROPERTY_NAME } from "../../GlobalConstants";
import { NumberFormattingHelper } from "../../NumberFormattingHelper";

type RequestHandlerResult = ClientEntities.ICancelableDataResult<GetKeyedInQuantityClientResponse>;

/**
 * The AutomatedKeyInGasolineQuantityRequestHandler automates the quantity entry for gasoline to be added to the transaction.
 * It by reading the gasoline quantity extension property value from the current cart which is previously set by the gas pump status page when creating the transaction.
 */
export default class AutomatedKeyInGasolineQuantityRequestHandler extends GetKeyedInQuantityClientRequestHandler {
    /**
     * Executes the request handler logic asynchronously.
     * @param {GetKeyedInQuantityClientRequest<GetKeyedInQuantityClientResponse>} request The request.
     * @returns {Promise<RequestHandlerResult>} The result of the request handler execution.
     */
    public executeAsync(request: GetKeyedInQuantityClientRequest<GetKeyedInQuantityClientResponse>): Promise<RequestHandlerResult> {
        // If it is not a gasoline line run the default implementation for GetKeyedInQuantityClientRequest.
        if (StringExtensions.compare(request.product.ItemId, GasStationDataStore.instance.gasStationDetails.GasolineItemId, true) !== 0) {
            return this.defaultExecuteAsync(request);
        }

        let getCartRequest: GetCurrentCartClientRequest<GetCurrentCartClientResponse> = new GetCurrentCartClientRequest(request.correlationId);
        return this.context.runtime.executeAsync(getCartRequest)
            .then((result: ClientEntities.ICancelableDataResult<GetCurrentCartClientResponse>): Promise<RequestHandlerResult> => {
                if (result.canceled) {
                    return Promise.resolve({ canceled: true, data: null });
                }

                let cart: ProxyEntities.Cart = result.data.result;
                let quantityExtensionProperty: ProxyEntities.CommerceProperty
                    = ArrayExtensions.firstOrUndefined(cart?.ExtensionProperties, (p) => p.Key === GASOLINE_QUANTITY_EXTENSION_PROPERTY_NAME);

                if (!StringExtensions.isNullOrWhitespace(cart.Id) && !ObjectExtensions.isNullOrUndefined(quantityExtensionProperty)) {
                    let decimalValue: number = NumberFormattingHelper.roundToNDigits(parseFloat(quantityExtensionProperty.Value.StringValue), 3);
                    return Promise.resolve({ canceled: false, data: new GetKeyedInQuantityClientResponse(decimalValue) })
                } else {
                    return this.defaultExecuteAsync(request); // If there is no cart in progress use the default implementation.
                }
            });
    }
}