/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Dialogs from "PosApi/Create/Dialogs";
import { DateExtensions } from "PosApi/TypeExtensions";
import { ProxyEntities } from "PosApi/Entities";
import { IGiftCardBalanceDialogResult } from "./GiftCardBalanceDialogTypes";
import ko from "knockout";

export default class GiftCardBalanceDialog extends Dialogs.ExtensionTemplatedDialogBase {
    public balance: ko.Observable<string>;
    public expirationDate: ko.Observable<string>;
    public number: ko.Observable<string>;

    constructor() {
        super();
        this.balance = ko.observable("");
        this.expirationDate = ko.observable("");
        this.number = ko.observable("");
    }

    /**
     * The function that is called when the dialog element is ready.
     * @param {HTMLElement} element The element containing the dialog.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);
    }

    /**
     * Opens the dialog.
     * @returns {Promise<IBarcodeMsrDialogResult>} The promise that represents showing the dialog and contains the dialog result.
     */
    public open(giftCard: ProxyEntities.GiftCard): Promise<IGiftCardBalanceDialogResult> {
        this.balance(giftCard.BalanceCurrencyCode.concat(" ", giftCard.Balance.toString()));
        this.expirationDate(DateExtensions.now.toDateString());
        this.number(giftCard.Id);

        let promise: Promise<IGiftCardBalanceDialogResult> =
            new Promise((resolve: (value: IGiftCardBalanceDialogResult) => void, reject: (reason: any) => void) => {

            let option: Dialogs.ITemplatedDialogOptions = {
                title: "Gift card balance",
                onCloseX: () => {
                    resolve({});
                    return true;
                },
                button1: {
                    id: "CloseButton",
                    label: "Close",
                    isPrimary: true,
                    onClick: () => {
                        resolve({});
                        return true;
                    }
                }
            };

            this.openDialog(option);
        });

        return promise;
    }
}