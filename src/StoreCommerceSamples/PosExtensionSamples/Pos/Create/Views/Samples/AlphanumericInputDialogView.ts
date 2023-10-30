/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Views from "PosApi/Create/Views";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import AlphanumericInputDialog from "../../Dialogs/DialogSample/AlphanumericInputDialog";
import ko from "knockout";

/**
 * The controller for AlphanumericInputDialogView.
 */
export default class AlphanumericInputDialogView extends Views.CustomViewControllerBase {
    public dialogResult: ko.Observable<string>;

    constructor(context: Views.ICustomViewControllerContext) {
        super(context);

        this.dialogResult = ko.observable("");
        this.state.title = "Alphanumeric Input Dialog Sample";
    }

    /**
     * Bind the html element with view controller.
     *
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);
    }

    /**
     * Opens the Alphanumeric Input dialog sample.
     */
    public openAlphanumericInputDialog(): void {
        let alphanumericInputDialog: AlphanumericInputDialog = new AlphanumericInputDialog();
        alphanumericInputDialog.show(this.context, this.context.resources.getString("string_55"))
            .then((result: string) => {
                this.dialogResult(result);
            }).catch((reason: any) => {
                this.context.logger.logError("AlphanumericInputDialog: " + JSON.stringify(reason));
            });
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}
