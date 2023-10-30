/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as AddressAddEditView from "PosApi/Extend/Views/AddressAddEditView";
import { ProxyEntities, ClientEntities } from "PosApi/Entities";
import { IAlphanumericInputDialogOptions, ShowAlphanumericInputDialogClientResponse, ShowAlphanumericInputDialogClientRequest } from "PosApi/Consume/Dialogs";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";

/**
 * This class extends the base one to include an additional button in the app bar.
 * The button populates the address' fields with a specific value depending on user's input.
 */
export default class GetExternalAddressCommand extends AddressAddEditView.AddressAddEditExtensionCommandBase {
    /**
     * Creates a new instance of the GetExternalAddressCommand class.
     * @param {IExtensionCommandContext<AddressAddEditView.IAddressAddEditToExtensionCommandMessageTypeMap>} context The command context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<AddressAddEditView.IAddressAddEditToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "getExternalAddressCommand";
        this.label = "Get Address";
        this.extraClass = "iconLightningBolt";
    }

    /**
     * Initializes the command.
     * @param {ProductDetailsView.IProductDetailsExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: AddressAddEditView.IAddressAddEditExtensionCommandState): void {
        this.canExecute = true;
        this.isVisible = true;
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        let inputAlphanumericDialogOptions: IAlphanumericInputDialogOptions = {
            title: "External System",
            numPadLabel: "Please enter code:"
        };

        let dialogRequest: ShowAlphanumericInputDialogClientRequest<ShowAlphanumericInputDialogClientResponse>
            = new ShowAlphanumericInputDialogClientRequest<ShowAlphanumericInputDialogClientResponse>(inputAlphanumericDialogOptions);

        this.context.runtime.executeAsync(dialogRequest)
            .then((dialogResponse: ClientEntities.ICancelableDataResult<ShowAlphanumericInputDialogClientResponse>) => {
                if (!dialogResponse.canceled) {
                    let address: ProxyEntities.Address = new ProxyEntities.AddressClass();

                    if (dialogResponse.data.result.value === "1") {
                        address.AddressTypeValue = ClientEntities.ExtensibleAddressType.Business.Value;
                        address.City = "Redmond";
                        address.IsPrimary = true;
                        address.Name = "Contoso Consulting USA";
                        address.State = "WA";
                        address.StateName = "Washington";
                        address.Street = "454 1st Street\nSuite 99";
                        address.ThreeLetterISORegionName = "USA";
                        address.ZipCode = "98052";
                    } else {
                        address.AddressTypeValue = ClientEntities.ExtensibleAddressType.Home.Value;
                        address.City = "Redmond";
                        address.IsPrimary = true;
                        address.Name = "Town house";
                        address.State = "WA";
                        address.StateName = "Washington";
                        address.Street = "One microsoft way";
                        address.ThreeLetterISORegionName = "USA";
                        address.ZipCode = "98052";
                    }

                    this.address = address;
                }
            });
    }
}