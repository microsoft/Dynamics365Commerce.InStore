/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ExtensionTemplatedDialogBase, ITemplatedDialogOptions } from "PosApi/Create/Dialogs";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ClientEntities } from "PosApi/Entities";
import { BarcodeMsrDialogInputType, IBarcodeMsrDialogResult } from "./BarcodeMsrDialogTypes";
import { IAlphanumericNumPad, IAlphanumericNumPadOptions } from "PosApi/Consume/Controls";

type BarcodeMsrDialogResolveFunction = (value: IBarcodeMsrDialogResult) => void;
type BarcodeMsrDialogRejectFunction = (reason: any) => void;

export default class BarcodeMsrDialog extends ExtensionTemplatedDialogBase {
    public numPad: IAlphanumericNumPad;

    private resolve: BarcodeMsrDialogResolveFunction;
    private _inputType: BarcodeMsrDialogInputType;
    private _automatedEntryInProgress: boolean;

    constructor() {
        super();

        this._inputType = "None";
        this._automatedEntryInProgress = false;

        // Set the onBarcodeScanned property to enable the barcode scanner in a templated dialog.
        this.onBarcodeScanned = (data: string): void => {
            this._automatedEntryInProgress = true;
            this.numPad.value = data;
            this._inputType = "Barcode";
            this._automatedEntryInProgress = false;
        };

        // Set the onMsrSwiped property to handle MSR swipe events in a templated dialog.
        this.onMsrSwiped = (data: ClientEntities.ICardInfo): void => {
            this._automatedEntryInProgress = true;
            this.numPad.value = data.CardNumber;
            this._inputType = "MSR";
            this._automatedEntryInProgress = false;
        };
    }

    /**
     * The function that is called when the dialog element is ready.
     * @param {HTMLElement} element The element containing the dialog.
     */
    public onReady(element: HTMLElement): void {
        let numPadOptions: IAlphanumericNumPadOptions = {
            globalInputBroker: this.numPadInputBroker,
            label: "Please enter a value, scan or swipe:",
            value: ""
        };

        let numPadRootElem: HTMLDivElement = element.querySelector("#barcodeMsrDialogAlphanumericNumPad") as HTMLDivElement;
        this.numPad = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "AlphanumericNumPad", numPadOptions, numPadRootElem);
        this.numPad.addEventListener("EnterPressed", (eventData: { value: Commerce.Extensibility.NumPadValue }) => {
            this._resolvePromise({ canceled: false, inputType: this._inputType, value: eventData.value.toString() });
        });
        this.numPad.addEventListener("ValueChanged", (eventData: { value: string }) => {
            if (!this._automatedEntryInProgress) {
                this._inputType = "Manual";
            }
        });
    }

    /**
     * Opens the dialog.
     * @returns {Promise<IBarcodeMsrDialogResult>} The promise that represents showing the dialog and contains the dialog result.
     */
    public open(): Promise<IBarcodeMsrDialogResult> {
        let promise: Promise<IBarcodeMsrDialogResult> = new Promise((resolve: BarcodeMsrDialogResolveFunction, reject: BarcodeMsrDialogRejectFunction) => {
            this.resolve = resolve;
            let option: ITemplatedDialogOptions = {
                title: "Barcode Scanner and MSR Swipe Dialog",
                onCloseX: this._cancelButtonClickHandler.bind(this)
            };

            this.openDialog(option);
        });

        return promise;
    }

    /**
     * Handles the cancel button click.
     * @returns {boolean} True if the dialog should close. False otherwise.
     */
    private _cancelButtonClickHandler(): boolean {
        this._resolvePromise({ canceled: true });
        return false;
    }

    /**
     * Results the dialog promise with the specified result.
     * @param {IBarcodeMsrDialogResult} result The result with which the dialog promise should be resolved.
     */
    private _resolvePromise(result: IBarcodeMsrDialogResult): void {
        if (ObjectExtensions.isFunction(this.resolve)) {
            this.resolve(result);

            this.resolve = null;
            this.closeDialog();
        }
    }
}