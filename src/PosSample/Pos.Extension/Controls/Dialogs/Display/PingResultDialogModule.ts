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

type DialogResolve = (result: any) => void;
type DialogReject = (reason: any) => void;

export default class PingResultDialog extends Dialogs.ExtensionTemplatedDialogBase {
    private _resolve: DialogResolve;
    private _pingUnboundGetResult: boolean;
    private _pingUnboundPostResult: boolean;

    constructor() {
        super();
    }

    /**
     * Executed when the dialog is instantiated, its HTML element is rendered and ready to be used.
     * @param {HTMLElement} element The HTMLElement
     */
    public onReady(element: HTMLElement): void {
        let getPingResult = element.querySelector("#UnboundGetResult") as HTMLSpanElement;
        getPingResult.textContent = this._pingUnboundGetResult ? "Success!" : "Failed.";
        let postPingResult = element.querySelector("#UnboundPostResult") as HTMLSpanElement;
        postPingResult.textContent = this._pingUnboundPostResult ? "Success!" : "Failed.";
    }

    /**
     * Opens the dialog.
     * @param {boolean} pingUnboundGetResult The ping unbound get result.
     * @param {boolean} pingUnboundPostResult The ping unbound post result.
     */
    public open(pingUnboundGetResult: boolean, pingUnboundPostResult: boolean): Promise<void> {
        let promise: Promise<void> = new Promise((resolve: DialogResolve, reject: DialogReject) => {
            this._resolve = resolve;
            this._pingUnboundGetResult = pingUnboundGetResult;
            this._pingUnboundPostResult = pingUnboundPostResult;
            this.openDialog({
                title: "Ping Test Results",
                button1: {
                    id: "buttonOk",
                    label: this.context.resources.getString("string_2005"),
                    isPrimary: true,
                    onClick: this._closeDialogHandler.bind(this)
                },
                onCloseX: () => this._closeDialogHandler()
            });
        });

        return promise;
    }

    /**
     * The handler to close the dialog.
     */
    private _closeDialogHandler(): boolean {
        this._resolvePromise();
        return true;
    }

    /**
     * Resolves the stored promise.
     */
    private _resolvePromise(): void {
        if (ObjectExtensions.isFunction(this._resolve)) {
            this._resolve(null);
            this._resolve = null;
        }
    }
}
