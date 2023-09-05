/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    CustomerDetailsCustomControlBase,
    ICustomerDetailsCustomControlState,
    ICustomerDetailsCustomControlContext
} from "PosApi/Extend/Views/CustomerDetailsView";
import { GetCustomerClientRequest, GetCustomerClientResponse } from "PosApi/Consume/Customer";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { StringExtensions } from "PosApi/TypeExtensions";
import * as Controls from "PosApi/Consume/Controls";
import ko from "knockout";

export default class CustomerDetailsFriendsPanel extends CustomerDetailsCustomControlBase {
    public dataList: Controls.IDataList<ProxyEntities.Customer>;
    public readonly title: ko.Observable<string>;

    private static readonly TEMPLATE_ID: string = "Microsot_Pos_Extensibility_Samples_CustomerDetailsFriendsPanel";
    private _state: ICustomerDetailsCustomControlState;
    private _friends: ProxyEntities.Customer[] = [];

    constructor(id: string, context: ICustomerDetailsCustomControlContext) {
        super(id, context);

        this.title = ko.observable("");
    }

    /**
     * Binds the control to the specified element.
     * @param {HTMLElement} element The element to which the control should be bound.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindingsToNode(element, {
            template: {
                name: CustomerDetailsFriendsPanel.TEMPLATE_ID,
                data: this
            }
        });

        let dataListOptions: Readonly<Controls.IDataListOptions<ProxyEntities.Customer>> = {
            columns: [
                {
                    title: "Account Number",
                    ratio: 40,
                    collapseOrder: 1,
                    minWidth: 100,
                    computeValue: (value: ProxyEntities.Customer): string => {
                        return value.AccountNumber;
                    }
                },
                {
                    title: "Name",
                    ratio: 60,
                    collapseOrder: 2,
                    minWidth: 100,
                    computeValue: (value: ProxyEntities.Customer): string => {
                        return value.Name;
                    }
                }
            ],
            data: this._friends,
            interactionMode: Controls.DataListInteractionMode.Invoke,
        };

        let dataListRootElem: HTMLDivElement = element.querySelector("#dataListSample") as HTMLDivElement;
        this.dataList = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "DataList", dataListOptions, dataListRootElem);
        this.dataList.addEventListener("ItemInvoked", (eventData: { item: ProxyEntities.Customer }): any => {
            this._viewFriendDetails(eventData.item);
        });
    }

    /**
     * Initializes the control.
     * @param {ICustomerDetailsCustomControlState} state The initial state of the page used to initialize the control.
     */
    public init(state: ICustomerDetailsCustomControlState): void {
        this._state = state;

        if (!this._state.isSelectionMode) {
            this.isVisible = true;
            this.title(this._state.customer.FirstName + "'s Friends");
            let allFriendAccountNumbers: string[] = ["2001", "2002", "2003", "2004", "2005"];
            let friendLoadPromises: Promise<void>[] = [];
            let friends: ProxyEntities.Customer[] = [];
            allFriendAccountNumbers.forEach((friendAccountNumber: string): void => {
                if (friendAccountNumber !== this._state.customer.AccountNumber) {
                    let getFirstFriendRequest: GetCustomerClientRequest<GetCustomerClientResponse> = new GetCustomerClientRequest(friendAccountNumber);
                    let loadPromise: Promise<void>
                        = this.context.runtime.executeAsync(getFirstFriendRequest)
                            .then((result: ClientEntities.ICancelableDataResult<GetCustomerClientResponse>): void => {
                                if (!result.canceled) {
                                    friends.push(result.data.result);
                                }
                            }).catch((reason: any): void => {
                                this.context.logger.logError("Failed to load customer information for customer with account number: " + friendAccountNumber);
                            });

                    friendLoadPromises.push(loadPromise);
                }
            });

            Promise.all(friendLoadPromises).then((): void => {
                this._friends = friends.sort((left: ProxyEntities.Customer, right: ProxyEntities.Customer): number => {
                    return StringExtensions.compare(left.AccountNumber, right.AccountNumber);
                });

                this.dataList.data = this._friends;
            });
        }
    }

    /**
     * Navigates to the customer details page for the specified friend.
     * @param {ProxyEntities.Customer} friend The friend whose details should be shown.
     */
    private _viewFriendDetails(friend: ProxyEntities.Customer): void {
        const correlationId: string = this.context.logger.getNewCorrelationId();
        this.context.logger.logInformational("The view friend details button was clicked on the customer details friends panel.", correlationId);
        let customerDetailsOptions: ClientEntities.CustomerDetailsNavigationParameters
            = new ClientEntities.CustomerDetailsNavigationParameters(friend.AccountNumber, correlationId);

        this.context.navigator.navigateToPOSView("CustomerDetailsView", customerDetailsOptions);
    }
}