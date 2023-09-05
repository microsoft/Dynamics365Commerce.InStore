/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ProxyEntities } from "PosApi/Entities";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as ManageShiftsView from "PosApi/Extend/Views/ManageShiftsView";
import MessageDialog from "../../../Create/Dialogs/DialogSample/MessageDialog";

export default class ManageShiftsCommand extends ManageShiftsView.ManageShiftsExtensionCommandBase {

    private _nonClosedShifts: ProxyEntities.Shift[];
    private _selectedShift: ProxyEntities.Shift;

    /**
     * Creates a new instance of the ManageShiftsCommand class.
     * @param {IExtensionCommandContext<ManageShiftsView.IManageShiftsToExtensionCommandMessageTypeMap>} context The context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<ManageShiftsView.IManageShiftsToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "sampleManageShiftsCommand";
        this.label = "Sample manage shifts command";
        this.extraClass = "iconLightningBolt";

        this.shiftSelectedHandler = (data: ManageShiftsView.ShiftSelectedData): void => {
            this.canExecute = true;
            this._selectedShift = data.selectedShift;
        };

        this.shiftSelectionClearedHandler = (): void => {
            this.canExecute = false;
        };
    }

    /**
     * Initializes the command.
     * @param {ManageShiftsView.IManageShiftsViewExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: ManageShiftsView.IManageShiftsExtensionCommandState): void {
        this.isVisible = true;
        this._nonClosedShifts = state.nonClosedShifts;
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        let message: string = "Shift ID: " + this._selectedShift.ShiftId + "; Non closed shifts: " + this._nonClosedShifts.length;

        // Retrieves the shifts from the server and reload them on the screen (The shift selection is cleared).
        this.refreshShifts();

        MessageDialog.show(this.context, message.toString());
    }
}