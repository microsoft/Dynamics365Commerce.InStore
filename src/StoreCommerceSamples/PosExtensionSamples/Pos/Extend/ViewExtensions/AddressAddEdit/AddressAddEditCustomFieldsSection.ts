/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    AddressAddEditCustomControlBase,
    IAddressAddEditCustomControlState,
    IAddressAddEditCustomControlContext
} from "PosApi/Extend/Views/AddressAddEditView";
import { ProxyEntities } from "PosApi/Entities";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import * as Controls from "PosApi/Consume/Controls";
import ko from "knockout";

/**
 * This is extension custom control for address add/edit view. It adds to the page 2 new fields: notes and toggle for residential address.
 */
export default class AddressAddEditCustomFieldsSection extends AddressAddEditCustomControlBase {
    public notes: ko.Observable<string>;
    public toggleSwitch: Controls.IToggle;
    private static readonly TEMPLATE_ID: string = "Microsoft_Pos_Extensibility_Samples_AddressAddEditCustomFieldsSection";

    constructor(id: string, context: IAddressAddEditCustomControlContext) {
        super(id, context);

        this.notes = ko.observable("");

        this.notes.subscribe((newValue: string): void => {
            this._addOrUpdateExtensionProperty("notes", <ProxyEntities.CommercePropertyValue>{ StringValue: newValue });
        });
    }

    /**
     * Binds the control to the specified element.
     * @param {HTMLElement} element The element to which the control should be bound.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindingsToNode(element, {
            template: {
                name: AddressAddEditCustomFieldsSection.TEMPLATE_ID,
                data: this
            }
        });

        let toggleOptions: Controls.IToggleOptions = {
            tabIndex: 0,
            enabled: true,
            checked: false,
            labelOn: "Yes",
            labelOff: "No",
        };

        let toggleRootElem: HTMLDivElement = element.querySelector("#isResidentialAddressToggle") as HTMLDivElement;
        this.toggleSwitch = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "Toggle", toggleOptions, toggleRootElem);
        this.toggleSwitch.addEventListener("CheckedChanged", (eventData: { checked: boolean }) => {
            this.toggleSwitchChanged(eventData.checked);
        });
    }

    /**
     * Initializes the control.
     * @param {ICustomerIAddressAddEditCustomControlStateDetailCustomControlState} state The initial state of the page used to initialize the control.
     */
    public init(state: IAddressAddEditCustomControlState): void {
        this.isVisible = true;
    }

    /**
     * Toggles Residential address property.
     * @param {boolean} checked Indicates if residential address is checked or not.
     */
    public toggleSwitchChanged(checked: boolean): void {
        this._addOrUpdateExtensionProperty("isResidentialAddress", <ProxyEntities.CommercePropertyValue>{ BooleanValue: checked });
    }

    /**
     * Gets the property value from the property bag, by its key. Optionally creates the property value on the bag, if it does not exist.
     */
    private _addOrUpdateExtensionProperty(key: string, newValue: ProxyEntities.CommercePropertyValue): void {
        let address: ProxyEntities.Address = this.address;

        let extensionProperty: ProxyEntities.CommerceProperty =
            Commerce.ArrayExtensions.firstOrUndefined(address.ExtensionProperties, (property: ProxyEntities.CommerceProperty) => {
                return property.Key === key;
            });

        if (ObjectExtensions.isNullOrUndefined(extensionProperty)) {
            let newProperty: ProxyEntities.CommerceProperty = {
                Key: key,
                Value: newValue
            };

            if (ObjectExtensions.isNullOrUndefined(address.ExtensionProperties)) {
                address.ExtensionProperties = [];
            }

            address.ExtensionProperties.push(newProperty);
        } else {
            extensionProperty.Value = newValue;
        }

        this.address = address;
    }
}