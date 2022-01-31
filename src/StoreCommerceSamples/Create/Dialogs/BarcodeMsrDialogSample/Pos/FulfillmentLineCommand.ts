/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import { ArrayExtensions, ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";
import {
    FulfillmentLineExtensionCommandBase,
    FulfillmentLinesSelectedData,
    FulfillmentLinePackingSlipSelectedData,
    FulfillmentLinesLoadedData,
    IFulfillmentLineExtensionCommandState,
    IFulfillmentLineToExtensionCommandMessageTypeMap
} from "PosApi/Extend/Views/FulfillmentLineView";
import { ShowMessageDialogClientRequest, ShowMessageDialogClientResponse, IMessageDialogOptions } from "PosApi/Consume/Dialogs";
import { GetScanResultClientRequest, GetScanResultClientResponse } from "PosApi/Consume/ScanResults";
import BarcodeMsrDialog from "./BarcodeMsrDialog";
import { IBarcodeMsrDialogResult } from "./BarcodeMsrDialogTypes";

export default class FulfillmentLineCommand extends FulfillmentLineExtensionCommandBase {

    private _fulfillmentLines: ProxyEntities.FulfillmentLine[];
    private _selectedFulfillmentLines: ProxyEntities.FulfillmentLine[];

    /**
     * Creates a new instance of the FulfillmentLineViewCommand class.
     * @param {IExtensionCommandContext<IFulfillmentLineToExtensionCommandMessageTypeMap>} context The context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<IFulfillmentLineToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "sampleFulfillmentLineCommand";
        this.label = "Scan and Select Product";
        this.extraClass = "iconLightningBolt";

        this._selectedFulfillmentLines = [];
        this.fulfillmentLinesSelectionHandler = (data: FulfillmentLinesSelectedData): void => {
            this._selectedFulfillmentLines = data.fulfillmentLines;
        };

        this.fulfillmentLinesSelectionClearedHandler = (): void => {
            this._selectedFulfillmentLines = [];
        };

        this.packingSlipSelectedHandler = (data: FulfillmentLinePackingSlipSelectedData): void => {
            this.isVisible = false;
        };

        this.packingSlipSelectionClearedHandler = (): void => {
            this.isVisible = true;
        };

        this.fulfillmentLinesLoadedHandler = (data: FulfillmentLinesLoadedData): void => {
            this._fulfillmentLines = data.fulfillmentLines;
        };
    }

    /**
     * Initializes the command.
     * @param {FulfillmentLineView.IFulfillmentLineExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: IFulfillmentLineExtensionCommandState): void {
        this.isVisible = true;
        this.canExecute = true;
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        let dialog: BarcodeMsrDialog = new BarcodeMsrDialog();
        let correlationId: string = this.context.logger.getNewCorrelationId();
        this.context.logger.logInformational("FulfillmentLineCommand.execute started", correlationId);

        dialog.open().then((dialogResult: IBarcodeMsrDialogResult): Promise<void> => {
            if (!dialogResult.canceled && dialogResult.inputType !== "MSR" && dialogResult.inputType !== "None" && !StringExtensions.isNullOrWhitespace(dialogResult.value)) {
                let getScanResultRequest: GetScanResultClientRequest<GetScanResultClientResponse>
                    = new GetScanResultClientRequest(dialogResult.value, correlationId);

                return this.context.runtime.executeAsync(getScanResultRequest)
                    .then((scanResult: ClientEntities.ICancelableDataResult<GetScanResultClientResponse>): Promise<void> => {
                        if (!scanResult.canceled
                            && !ObjectExtensions.isNullOrUndefined(scanResult.data)
                            && !ObjectExtensions.isNullOrUndefined(scanResult.data.result)
                            && !ObjectExtensions.isNullOrUndefined(scanResult.data.result.Product)) {

                            let product: ProxyEntities.SimpleProduct = scanResult.data.result.Product;
                            let matchingLine: ProxyEntities.FulfillmentLine
                                = ArrayExtensions.firstOrUndefined(this._fulfillmentLines, (line: ProxyEntities.FulfillmentLine): boolean => {
                                    return line.ProductId === product.RecordId;
                                });

                            if (ObjectExtensions.isNullOrUndefined(matchingLine)) {
                                return Promise.reject(new ClientEntities.ExtensionError("Please scan a product that matches a selected fulfillment line."));
                            } else {
                                if (!this._selectedFulfillmentLines.some((line: ProxyEntities.FulfillmentLine): boolean => { return line.ProductId === matchingLine.ProductId; })) {
                                    this._selectedFulfillmentLines.push(matchingLine);
                                    this.setSelectedFulfillmentLines({ fulfillmentLines: this._selectedFulfillmentLines });
                                }

                                return Promise.resolve();
                            }
                        } else {
                            return Promise.reject(new ClientEntities.ExtensionError("Please scan a product that matches a selected fulfillment line."));
                        }
                    });
            } else {
                return Promise.resolve();
            }
        }).catch((reason: any): void => {
            this._displayErrorAsync(reason);
        });
    }

    /**
     * Displays an error message for the provided error.
     * @param {any} reason The error.
     * @returns Promise<ICancelable> The promise.
     */
    private _displayErrorAsync(reason: any): Promise<ClientEntities.ICancelable> {
        let messageDialogOptions: IMessageDialogOptions;
        if (reason instanceof ClientEntities.ExtensionError) {
            messageDialogOptions = {
                message: reason.localizedMessage
            };
        } else if (reason instanceof Error) {
            messageDialogOptions = {
                message: reason.message
            };
        } else if (typeof reason === "string") {
            messageDialogOptions = {
                message: reason
            };
        } else {
            messageDialogOptions = {
                message: "An unexpected error occurred."
            };
        }

        let errorMessageRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse>
            = new ShowMessageDialogClientRequest(messageDialogOptions);

        return this.context.runtime.executeAsync(errorMessageRequest);
    }
}