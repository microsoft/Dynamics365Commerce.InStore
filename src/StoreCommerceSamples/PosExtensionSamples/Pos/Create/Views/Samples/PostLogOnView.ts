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
import { IPostLogOnViewOptions } from "../NavigationContracts";
import ko from "knockout";

/**
 * The controller for PostLogOnView.
 */
export default class PostLogOnView extends Views.CustomViewControllerBase {
    private _options: any;

    constructor(context: Views.ICustomViewControllerContext, options?: IPostLogOnViewOptions) {
        super(context);

        this.state.title = "PostLogOnView sample";
        this._options = options;
    }

    /**
     * Bind the html element with view controller.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        var btn = document.getElementById("confirmBtn");
        btn.addEventListener('click', () => {
            this._confirmLogin();
        });
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Confirm login.
     */
    private _confirmLogin(): void {
        this._options.resolveCallback();
    }
}
