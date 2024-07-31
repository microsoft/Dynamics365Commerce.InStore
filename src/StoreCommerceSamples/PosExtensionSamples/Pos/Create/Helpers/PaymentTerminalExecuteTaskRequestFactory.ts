/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { PaymentTerminalExecuteTaskRequest, PaymentTerminalExecuteTaskResponse } from "PosApi/Consume/Peripherals";
import { ProxyEntities } from "PosApi/Entities";

/**
 * (Sample) Creation of PaymentTerminalExecuteTaskRequest.
 */
export default class PaymentTerminalExecuteTaskRequestFactory {
    /**
     * Creates a PaymentTerminalExecuteTaskRequest based on the task and cart information.
     * @param {string} task The PaymentTerminalExecuteTaskRequest task.
     * @param {ProxyEntities.Cart} cart The ProxyEntities.Cart.
     * @returns {PaymentTerminalExecuteTaskRequest<PaymentTerminalExecuteTaskResponse>} The PaymentTerminalExecuteTaskRequest<PaymentTerminalExecuteTaskResponse>
     */
    public static createPaymentTerminalExecuteTaskRequest(task: string, cart: ProxyEntities.Cart): PaymentTerminalExecuteTaskRequest<PaymentTerminalExecuteTaskResponse> {

        var request: PaymentTerminalExecuteTaskRequest<PaymentTerminalExecuteTaskResponse>;

        if (task === "getconfirmation") {
            request = new PaymentTerminalExecuteTaskRequest(
                "getconfirmation",
                {
                    ExtensionProperties: [
                        { Key: "Header", Value: { StringValue: "Testing confirmation task, l1"} },
                        { Key: "Contents", Value: { StringValue: cart.Comment ?? "Some contents, l2" } },
                        { Key: "LeftButton", Value: { StringValue: "Cancel" } },
                        { Key: "RightButton", Value: { StringValue: "Ok" } }
                    ]
                },
                undefined,
                180);
        } else if (task === "getsignature") {
            request = new PaymentTerminalExecuteTaskRequest(
                "getsignature",
                {
                    ExtensionProperties: [
                        { Key: "Header", Value: { StringValue: "Please sign for delivery" } },
                        { Key: "Contents", Value: { StringValue: "" } },
                    ]
                },
                undefined,
                180);
        } else if (task === "menubuttons") {
            request = new PaymentTerminalExecuteTaskRequest(
                "menubuttons",
                {
                    ExtensionProperties: [
                        { Key: "Header", Value: { StringValue: "Which city is in the USA?" } },
                        { Key: "Contents", Value: { StringValue: "Please choose a single answer." } },
                        { Key: "MenuEntry1", Value: { StringValue: "New York" } },
                        { Key: "MenuEntry2", Value: { StringValue: "Paris" } },
                        { Key: "MenuEntry3", Value: { StringValue: "Beijing" } },
                        { Key: "MenuEntry4", Value: { StringValue: "Tokyo" } },
                    ]
                },
                undefined,
                180);
        } else if (task === "getdigit") {
            request = new PaymentTerminalExecuteTaskRequest(
                "getdigit",
                {
                    ExtensionProperties: [
                        { Key: "Header", Value: { StringValue: "GetDigit" } },
                        { Key: "Contents", Value: { StringValue: "Enter your zip code" } },
                    ]
                },
                undefined,
                180);
        } else if (task === "getamount") {
            request = new PaymentTerminalExecuteTaskRequest(
                "getamount",
                {
                    ExtensionProperties: [
                        { Key: "Header", Value: { StringValue: "GetAmount" } },
                        { Key: "Contents", Value: { StringValue: "Enter amount" } },
                    ]
                },
                undefined,
                180);
        } else if (task === "getphonenumber") {
            request = new PaymentTerminalExecuteTaskRequest(
                "getphonenumber",
                {
                    ExtensionProperties: [
                        { Key: "Header", Value: { StringValue: "GetPhoneNumber" } },
                        { Key: "Contents", Value: { StringValue: "Enter your phone number" } },
                    ]
                },
                undefined,
                180);
        } else if (task === "gettext") {
            request = new PaymentTerminalExecuteTaskRequest(
                "gettext",
                {
                    ExtensionProperties: [
                        { Key: "Header", Value: { StringValue: "GetText" } },
                        { Key: "Contents", Value: { StringValue: "Enter your email address" } },
                    ]
                },
                undefined,
                180);
        } else {
            throw new Error("Unsupported task: " + task);
        }

        return request;
    }
}