/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Dialogs from "PosApi/Create/Dialogs";
import { ArrayExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import { Entities } from "../../DataService/DataServiceEntities.g";
import { CurrencyFormatter } from "PosApi/Consume/Formatters";
import { ClientEntities } from "PosApi/Entities";
import ko from "knockout";
import { GasStationDataStore } from "../../GasStationDataStore";
import { NumberFormattingHelper } from "../../NumberFormattingHelper";
import { GasPumpStatus } from "../../GasStationTypes";

/**
 * The dialog used to simulate a customer pumping gas.
 */
export default class PumpGasDialog extends Dialogs.ExtensionTemplatedDialogBase {
    public gasPump: Entities.GasPump;
    public pumpedTotalAmount: ko.Computed<string>;
    public pumpedQuantity: ko.Computed<string>;
    public readonly pricePerUnit: string;
    public isEmergencyInProgress: ko.Observable<boolean>;
    private _pumpedQuantity: ko.Observable<number>;
    private _canceled: boolean;
    private _resolve: () => void;

    constructor() {
        super();

        this._pumpedQuantity = ko.observable(0);
        this.pricePerUnit = CurrencyFormatter.toCurrency(NumberFormattingHelper.roundToNDigits(GasStationDataStore.instance.gasStationDetails.GasBasePrice, 2)) + " per gallon";
        this.pumpedQuantity = ko.computed((): string => {
            return NumberFormattingHelper.getRoundedStringValue(this._pumpedQuantity(), 3);
        }, this);
        this.pumpedTotalAmount = ko.computed((): string => {
            let totalAmount: number = NumberFormattingHelper.roundToNDigits(this._pumpedQuantity() * GasStationDataStore.instance.gasStationDetails.GasBasePrice, 2);
            return CurrencyFormatter.toCurrency(totalAmount);
        }, this);
        this._canceled = false;
        this.isEmergencyInProgress = ko.observable(false);
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
    public open(options: { pumpId: number }): Promise<ClientEntities.ICancelableDataResult<number>> {
        this.gasPump = ArrayExtensions.firstOrUndefined(GasStationDataStore.instance.pumps, (pump): boolean => { return pump.Id === options.pumpId });
        if (ObjectExtensions.isNullOrUndefined(this.gasPump)) {
            return Promise.reject(new Error("Pump not found."));
        }

        let intervalId = setInterval(() => {
            let updatedQuantity: number = this._pumpedQuantity() + 0.033;
            this._pumpedQuantity(updatedQuantity);

            if (updatedQuantity > 75) {
                this.isEmergencyInProgress(true);
                GasStationDataStore.instance.updatePumpStatusAsync(this.context, options.pumpId, { GasPumpStatusValue: GasPumpStatus.Emergency, LastUpdateTime: new Date(), SaleTotal: 0, SaleVolume: 0 });
                clearInterval(intervalId);
                intervalId = undefined;
            }
        }, 50);
        let promise: Promise<void> = new Promise<void>((resolve: () => void, reject: (reason: any) => void): void => {
            this._resolve = resolve;
            let option: Dialogs.ITemplatedDialogOptions = {
                title: this.gasPump.Name,
                onCloseX: this.onCloseX.bind(this),
                button1: {
                    id: "OkayButton",
                    label: "Stop pumping",
                    isPrimary: true,
                    onClick: this._stopPumpClickHandler.bind(this)
                }
            };

            this.openDialog(option);
        });

        return promise.then((): ClientEntities.ICancelableDataResult<number> => {
            if (typeof intervalId === "number") {
                clearInterval(intervalId);
            }

            let finalQuantity: number = this._pumpedQuantity();
            return { canceled: this._canceled, data: finalQuantity };
        });
    }

    /**
     * Called when the X button is clicked.
     * @return {boolean} True to close the dialog, false otherwise.
     */
    private onCloseX(): boolean {
        this._canceled = true;
        this._resolvePromise();
        return true;
    }

    /**
     * Called when the enable pump button is clicked.
     * @return {boolean} True to close the dialog, false otherwise.
     */
    private _stopPumpClickHandler(): boolean {
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