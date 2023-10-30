/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    ShowListInputDialogClientRequest, ShowListInputDialogClientResponse, IListInputDialogOptions,
    IListInputDialogItem, ShowListInputDialogError, IListInputDialogResult
} from "PosApi/Consume/Dialogs";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ClientEntities } from "PosApi/Entities";

export default class ListInputDialog {
    /**
     * Shows the list input dialog.
     * @param context The extension context.
     * @param message The message to display in the dialog.
     * @returns {Promise<string>} The promise.
     */
    public show(context: IExtensionContext, message: string): Promise<string> {
        let promise: Promise<string> = new Promise<string>((resolve: (num: string) => void, reject: (reason?: any) => void) => {

            /* List data that you may want to display */
            let listItems: ListData[] = [new ListData("Houston", "1"), new ListData("Seattle", "2"), new ListData("Boston", "3")];

            /* Convert your list data into an array of IListInputDialogItem */
            let convertedListItems: IListInputDialogItem[] = listItems.map((listItem: ListData): IListInputDialogItem => {
                let convertedListItem: IListInputDialogItem = {
                    label: listItem.label, // string to be displayed for the given item
                    value: listItem // list data item that the string label represents
                };
                return convertedListItem;
            });

            let listInputDialogOptions: IListInputDialogOptions = {
                title: context.resources.getString("string_55"), // string that denotes the optional title on the list dialog
                subTitle: context.resources.getString("string_55"), // string that denotes the optional subtitle under the title
                items: convertedListItems,
                onBeforeClose: this.onBeforeClose.bind(this)
            };

            let dialogRequest: ShowListInputDialogClientRequest<ShowListInputDialogClientResponse> =
                new ShowListInputDialogClientRequest<ShowListInputDialogClientResponse>(listInputDialogOptions);

            context.runtime.executeAsync(dialogRequest)
                .then((result: ClientEntities.ICancelableDataResult<ShowListInputDialogClientResponse>) => {
                    if (!result.canceled) {
                        /* The response returns the selected IListInputDialogItem */
                        let selectedItem: IListInputDialogItem = result.data.result.value;
                        let selectedListData: ListData = selectedItem.value;
                        context.logger.logInformational("Selected ListData label: " + selectedListData.label);
                        context.logger.logInformational("Selected ListData value: " + selectedListData.value);
                        resolve(selectedItem.label);
                    } else {
                        context.logger.logInformational("ListInputDialog is canceled.");
                        resolve(null);
                    }
                }).catch((reason: any) => {
                    context.logger.logError(JSON.stringify(reason));
                    reject(reason);
                });
        });

        return promise;
    }

    /**
     * Decides what to do with the dialog based on the list item pressed.
     * @param {ClientEntities.ICancelableDataResult<IListInputDialogResult>} result Selected result of dialog.
     * @returns {Promise<void>} The returned promise.
     */
    private onBeforeClose(result: ClientEntities.ICancelableDataResult<IListInputDialogResult>): Promise<void> {
        if (!result.canceled) {
            if (!ObjectExtensions.isNullOrUndefined(result.data)) {
                if (result.data.value.label === "Houston") {

                    /* new List data that you may want to display after displaying error message */
                    let listItems: ListData[] = [new ListData("Pittsburgh", "1"), new ListData("Seattle", "2"), new ListData("Boston", "3")];
                    let convertedListItems: IListInputDialogItem[] = listItems.map((listItem: ListData): IListInputDialogItem => {
                        let convertedListItem: IListInputDialogItem = {
                            label: listItem.label, // string to be displayed for the given item
                            value: listItem // list data item that the string label represents
                        };
                        return convertedListItem;
                    });

                    let error: ShowListInputDialogError = new ShowListInputDialogError
                        ("Invalid item selected. Select different item.", convertedListItems /* updated list items to display */);
                    return Promise.reject(error);
                } else {
                    return Promise.resolve();
                }
            } else {
                // Should not reach this branch
                let error: ShowListInputDialogError = new ShowListInputDialogError("Data result is null.");
                return Promise.reject(error);
            }
        } else {
            // Note that if result.cancelled is true, then result.data is null
            let error: ShowListInputDialogError = new ShowListInputDialogError("Cannot close dialog. Must select item.");
            return Promise.reject(error);
        }
    }
}

class ListData {
    label: string;
    value: string;

    constructor(label: string, value: string) {
        this.label = label;
        this.value = value;
    }
}