/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/TransactionTriggers";
import { ClientEntities } from "PosApi/Entities";
import { ShowMessageDialogClientRequest, ShowMessageDialogClientResponse } from "PosApi/Consume/Dialogs";
import { HardwareStationDeviceActionRequest, HardwareStationDeviceActionResponse } from "PosApi/Consume/Peripherals";

export default class PostCheckoutPrintFileTrigger extends Triggers.PostCartCheckoutTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPreProductSaleTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IPostCartCheckoutTriggerOptions): Promise<void> {
        let dialogOptions: ClientEntities.Dialogs.IMessageDialogOptions = {
            message: "Would you like to print the transaction receipt in a file?",
            button1: {
                id: "YES_BUTTON",
                label: "Yes",
                isPrimary: false,
                result: "DO_SAVE"
            },
            button2: {
                id: "NO_BUTTON",
                label: "No",
                isPrimary: true,
                result: "DO_NOT_SAVE"
            }
        };
        let showMessageRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse> = new ShowMessageDialogClientRequest(dialogOptions);
        return this.context.runtime.executeAsync(showMessageRequest).then((result) => {
            if (result.canceled || result?.data?.result?.dialogResult === dialogOptions.button2.result) {
                return Promise.resolve();
            }

            let lines: string[] = options.salesOrder.SalesLines.map((salesLine): string => {
                return `Line Id: ${salesLine.LineId} - Product Id: ${salesLine.ProductId} - Total Amount: ${salesLine.TotalAmount}`;
            });

            let printRequest: { Lines: string[], FileName: string } = {
                Lines: lines,
                FileName: options.salesOrder.Id + ".txt"
            };
            let printFileRequest: HardwareStationDeviceActionRequest<HardwareStationDeviceActionResponse> = new HardwareStationDeviceActionRequest("FILEPRINTER", "Print", printRequest);
            return this.context.runtime.executeAsync(printFileRequest)
                .then(() => { return; })
                .catch((reason: any) => {
                    return Promise.reject(reason);
                });
        });
    }
}