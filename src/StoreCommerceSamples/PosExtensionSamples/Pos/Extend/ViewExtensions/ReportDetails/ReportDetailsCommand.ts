/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as ReportDetailsView from "PosApi/Extend/Views/ReportDetailsView";
import { ProxyEntities } from "PosApi/Entities";
import { StringExtensions } from "PosApi/TypeExtensions";

export default class ReportDetailsCommand extends ReportDetailsView.ReportDetailsExtensionCommandBase {
    private _reportData: ProxyEntities.ReportDataSet = null;
    private _reportTitle: string = StringExtensions.EMPTY;
    private _reportId: string = StringExtensions.EMPTY;

    /**
     * Creates a new instance of the ReportDetailsCommand class.
     * @param {IExtensionCommandContext<ReportDetailsView.IReportDetailsToExtensionCommandMessageTypeMap>} context The context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<ReportDetailsView.IReportDetailsToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "sampleReportDetailsCommand";
        this.label = "Print";
        this.extraClass = "iconPrint";

        this.reportDataLoadedDataHandler = (data: ReportDetailsView.ReportDataLoadedData): void => {
            this.canExecute = true;
            this._reportData = data.reportDataSet;
        };
    }

    /**
     * Initializes the command.
     * @param {ReportDetailsView.IReportDetailsExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: ReportDetailsView.IReportDetailsExtensionCommandState): void {
        this.isVisible = true;
        this._reportId = state.reportId;
        this._reportTitle = state.reportTitle;
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        this.context.logger.logInformational("Report title: " + JSON.stringify(this._reportTitle));
        this.context.logger.logInformational("Report Id: " + JSON.stringify(this._reportId));
        this.context.logger.logInformational("Print report data: " + JSON.stringify(this._reportData));
    }
}