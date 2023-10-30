/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Controls from "PosApi/Consume/Controls";
import {
    CustomerAddEditCustomControlBase,
    ICustomerAddEditCustomControlState,
    ICustomerAddEditCustomControlContext,
    CustomerAddEditCustomerUpdatedData
} from "PosApi/Extend/Views/CustomerAddEditView";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ProxyEntities } from "PosApi/Entities";
import ko from "knockout";

export default class CustomFieldsSection extends CustomerAddEditCustomControlBase {
    public ssn: ko.Observable<string>;
    public organizationId: ko.Observable<string>;
    public isVip: boolean;
    public customerIsPerson: ko.Observable<boolean>;
    public toggleSwitch: Controls.IToggle;
    private static readonly TEMPLATE_ID: string = "Microsoft_Pos_Extensibility_Samples_CustomFieldsSection";

    constructor(id: string, context: ICustomerAddEditCustomControlContext) {
        super(id, context);

        this.ssn = ko.observable("");
        this.organizationId = ko.observable("");
        this.isVip = false;
        this.customerIsPerson = ko.observable(false);

        this.ssn.subscribe((newValue: string): void => {
            this._addOrUpdateExtensionProperty("ssn", <ProxyEntities.CommercePropertyValue>{ StringValue: newValue });
        });

        this.organizationId.subscribe((newValue: string): void => {
            this._addOrUpdateExtensionProperty("organizationId", <ProxyEntities.CommercePropertyValue>{ StringValue: newValue });
        });

        this.customerUpdatedHandler = (data: CustomerAddEditCustomerUpdatedData) => {
            this.customerIsPerson(data.customer.CustomerTypeValue === ProxyEntities.CustomerType.Person);
        };
    }

    /**
     * Binds the control to the specified element.
     * @param {HTMLElement} element The element to which the control should be bound.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindingsToNode(element, {
            template: {
                name: CustomFieldsSection.TEMPLATE_ID,
                data: this
            }
        });
        let toggleOptions: Controls.IToggleOptions = {
            labelOn: this.context.resources.getString("string_1357"),
            labelOff: this.context.resources.getString("string_1358"),
            checked: this.isVip,
            enabled: true,
            tabIndex: 0
        };

        let toggleRootElem: HTMLDivElement = element.querySelector("#isVipToggle") as HTMLDivElement;
        this.toggleSwitch = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "Toggle", toggleOptions, toggleRootElem);
        this.toggleSwitch.addEventListener("CheckedChanged", (eventData: { checked: boolean }) => {
            this.toggleVip(eventData.checked);
        });

    }

    /**
     * Initializes the control.
     * @param {ICustomerDetailCustomControlState} state The initial state of the page used to initialize the control.
     */
    public init(state: ICustomerAddEditCustomControlState): void {
        if (!state.isSelectionMode) {
            this.isVisible = true;
            this.customerIsPerson(state.customer.CustomerTypeValue === ProxyEntities.CustomerType.Person);
        }
    }

    /**
     * Toggles Vip property.
     * @param {boolean} checked Indicates if vip is checked or not.
     */
    public toggleVip(checked: boolean): void {
        this._addOrUpdateExtensionProperty("isVip", <ProxyEntities.CommercePropertyValue>{ BooleanValue: checked });
    }

    /**
     * Gets the property value from the property bag, by its key. Optionally creates the property value on the bag, if it does not exist.
     * @param {string} key The key of the property to get.
     * @param {ProxyEntities.CommercePropertyValue} newValue The new value to set on the property.
     */
    private _addOrUpdateExtensionProperty(key: string, newValue: ProxyEntities.CommercePropertyValue): void {
        let customer: ProxyEntities.Customer = this.customer;

        let extensionProperty: ProxyEntities.CommerceProperty =
            Commerce.ArrayExtensions.firstOrUndefined(customer.ExtensionProperties, (property: ProxyEntities.CommerceProperty) => {
                return property.Key === key;
            });

        if (ObjectExtensions.isNullOrUndefined(extensionProperty)) {
            let newProperty: ProxyEntities.CommerceProperty = {
                Key: key,
                Value: newValue
            };

            if (ObjectExtensions.isNullOrUndefined(customer.ExtensionProperties)) {
                customer.ExtensionProperties = [];
            }

            customer.ExtensionProperties.push(newProperty);
        } else {
            extensionProperty.Value = newValue;
        }

        this.customer = customer;
    }
}