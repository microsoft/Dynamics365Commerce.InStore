/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";
import { ISimpleExtensionViewModelOptions, ISimpleNextViewModelOptions } from "./NavigationContracts";
import KnockoutExtensionViewModelBase from "./BaseClasses/KnockoutExtensionViewModelBase";
import { ICustomViewControllerContext, ICustomViewControllerBaseState } from "PosApi/Create/Views";
import ko from "knockout";

/**
 * Type interface for an event request.
 */
export interface IEventRequest {
    requestDateTime: Date;
    requestedWorkerName: string;
    requestType: string;
    requestStatus: string;
}

/**
 * The ViewModel for SimpleNextViewModel.
 */
export class SimpleNextViewModel extends KnockoutExtensionViewModelBase {
    public simpleMessage: ko.Observable<string>;
    private _context: ICustomViewControllerContext;
    private _customViewControllerBaseState: ICustomViewControllerBaseState;

    /**
     * Creates a new instance of the SimpleNextViewModel class.
     * @param {ICustomViewControllerContext} context The custom view controller context.
     * @param {ICustomViewControllerBaseState} state Tbe custom view controller base state.
     * @param {ISimpleNextViewModelOptions} [options] The view model options, if any.
     */
    constructor(context: ICustomViewControllerContext, state: ICustomViewControllerBaseState,
        options?: ISimpleNextViewModelOptions) {

        super();

        this._context = context;

        let messageToDisplay: string = this._context.resources.getString("string_10");
        if (!ObjectExtensions.isNullOrUndefined(options) && !StringExtensions.isNullOrWhitespace(options.message)) {
            messageToDisplay = options.message;
        }

        this.simpleMessage = ko.observable(messageToDisplay);
        this._customViewControllerBaseState = state;
        this._customViewControllerBaseState.isProcessing = false;
    }

    /**
     * Loads the view model state and returns list of event requests.
     * @returns {IEventRequest[]} The list of event requests.
     */
    public load(): IEventRequest[] {
        // Enable the busy indicator while the page is loading.
        this._customViewControllerBaseState.isProcessing = true;

        let eventRequests: IEventRequest[] = [
            {
                requestDateTime: new Date(),
                requestedWorkerName: "Allison Berker",
                requestType: this._context.resources.getString("string_16"),
                requestStatus: this._context.resources.getString("string_19")
            },
            {
                requestDateTime: new Date(),
                requestedWorkerName: "Bert Miner",
                requestType: this._context.resources.getString("string_17"),
                requestStatus: this._context.resources.getString("string_20")
            },
            {
                requestDateTime: new Date(),
                requestedWorkerName: "Greg Marchievsky",
                requestType: this._context.resources.getString("string_18"),
                requestStatus: this._context.resources.getString("string_21")
            }
        ];

        this._customViewControllerBaseState.isProcessing = false;
        return eventRequests;
    }

    /**
     * Update on screen display message when button is clicked.
     */
    public updateMessage(): void {
        this._customViewControllerBaseState.isProcessing = true;
        this.simpleMessage(this._context.resources.getString("string_22"));

        setTimeout(() => {
            this._customViewControllerBaseState.isProcessing = false;
        }, 2000);
    }

    /**
     * Update on screen display message when tab is changed.
     * @param {string} message The tab changed message.
     */
    public tabChanged(message: string): void {
        this._context.logger.logInformational("Tab operation: " + message);
        this.simpleMessage(message);
    }

    /**
     * Handler for list item selection.
     * @param {IEventRequest} item The data corresponding to the invoked row.
     */
    public listItemInvoked(item: IEventRequest): void {
        this._context.logger.logInformational("Item selected:" + item.requestedWorkerName, item.requestStatus);
    }

    /**
     * Handler for list item selection.
     * @param {IEventRequest[]} items The data corresponding to the selected rows.
     */
    public selectionChanged(items: IEventRequest[]): void {
        this._context.logger.logVerbose("Items selected:");
        items.forEach((item: IEventRequest) => {
            this._context.logger.logVerbose("Item:" + item.requestedWorkerName + ", status:" + item.requestStatus);
        });
    }

    /**
     * Navigate to SimpleExtensionView.
     */
    public navigateToSimplePage(): void {
        this._context.logger.logInformational("SimpleNextViewModel: Navigating to SimpleExtensionView...");
        let options: ISimpleExtensionViewModelOptions = { displayMessage: this._context.resources.getString("string_23") };
        this._context.navigator.navigate("SimpleExtensionView", options);
    }
}