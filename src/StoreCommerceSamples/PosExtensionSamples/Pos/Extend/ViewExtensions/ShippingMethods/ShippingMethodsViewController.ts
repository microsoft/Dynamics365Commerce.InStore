/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as ShippingMethodsView from "PosApi/Extend/Views/ShippingMethodsView";
import { IExtensionShippingMethodsViewControllerContext } from "PosApi/Extend/Views/ShippingMethodsView";
import { StringExtensions } from "PosApi/TypeExtensions";

/**
 * This class extends the base one to modify the default shipping address' city according to the customer's name
 */
export default class ShippingMethodsViewController extends ShippingMethodsView.ShippingMethodsExtensionViewControllerBase {
    /**
     * Creates a new instance of the ShippingMethodsViewController class.
     * @param {IExtensionShippingMethodsViewControllerContext} context The events Handler context.
     * @remarks The events handler context contains APIs through which a handler can communicate with POS.
     */
    constructor(context: IExtensionShippingMethodsViewControllerContext) {
        super(context);

        this.shippingAddressUpdatedHandler = (data: ShippingMethodsView.ShippingAddressUpdatedData): void => {
            data.shippingAddress.City = StringExtensions.format("{0} - Home of {1}", data.shippingAddress.City, data.customer.Name);
            this.shippingAddress = data.shippingAddress;
        };
    }
}