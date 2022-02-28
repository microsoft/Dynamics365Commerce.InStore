/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Dialogs from "PosApi/Create/Dialogs";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { GasStationDataStore } from "../../GasStationDataStore";
import { Entities } from "../../DataService/DataServiceEntities.g";
import { DateFormatter, CurrencyFormatter } from "PosApi/Consume/Formatters";
import { NumberFormattingHelper } from "../../NumberFormattingHelper";
import ko from "knockout";

/**
 * The class representing the gas station details dialog.
 */
export default class GasStationDetailsDialog extends Dialogs.ExtensionTemplatedDialogBase {
    public readonly gasStationDetails: Entities.GasStationDetails;
    public readonly lastGasDeliveryTime: string;
    public readonly nextGasDeliveryTime: string;
    public readonly gasTankCapacity: string;
    public readonly gasTankLevel: string;
    public readonly pricePerUnit: string;
    public readonly pumpCount: string;

    private _resolve: () => void;

    constructor() {
        super();

        this.gasStationDetails = GasStationDataStore.instance.gasStationDetails;
        this.nextGasDeliveryTime = DateFormatter.toShortDateAndTime(this.gasStationDetails.NextGasDeliveryTime);
        this.lastGasDeliveryTime = DateFormatter.toShortDateAndTime(this.gasStationDetails.LastGasDeliveryTime);
        this.gasTankCapacity = NumberFormattingHelper.getRoundedStringValue(this.gasStationDetails.GasTankCapacity, 2) + " gallons";
        this.gasTankLevel = NumberFormattingHelper.getRoundedStringValue(this.gasStationDetails.GasTankLevel, 2) + " gallons";
        this.pricePerUnit = CurrencyFormatter.toCurrency(NumberFormattingHelper.roundToNDigits(this.gasStationDetails.GasBasePrice, 2)) + " per gallon";
        this.pumpCount = NumberFormattingHelper.getRoundedStringValue(this.gasStationDetails.GasPumpCount, 0);
    }
    /**
     * Called when the dialog element is ready.
     * @param {HTMLElement} element The DOM element of the dialog.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);
    }

    /**
     * Opens the GasPumpStatusDialog.
     * @return {Promise<void>} The result from message dialog.
     */
    public open(): Promise<void> {
        let promise: Promise<void> = new Promise<void>((resolve: () => void, reject: (reason: any) => void): void => {
            this._resolve = resolve;
            let option: Dialogs.ITemplatedDialogOptions = {
                title: "Station Information",
                onCloseX: this.onCloseX.bind(this),
                button1: {
                    id: "OkayButton",
                    label: "Ok",
                    isPrimary: true,
                    onClick: this._enablePumpClickHandler.bind(this)
                }
            };

            this.openDialog(option);
        });

        return promise;
    }

    /**
     * Called when the X button is clicked.
     * @return {boolean} True to close the dialog, false otherwise.
     */
    private onCloseX(): boolean {
        this._resolvePromise();
        return true;
    }

    /**
     * Called when the enable pump button is clicked.
     * @return {boolean} True to close the dialog, false otherwise.
     */
    private _enablePumpClickHandler(): boolean {
        this._resolvePromise();
        return true;
    }

    /**
     * Resolves the dialog promise so the caller knows the dialog was closed.
     */
    private _resolvePromise(): void {
        if (ObjectExtensions.isFunction(this._resolve)) {
            this._resolve();

            this._resolve = null;
        }
    }
}