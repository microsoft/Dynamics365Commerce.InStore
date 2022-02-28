import { Entities } from "DataService/DataServiceEntities.g";
import { GasPumpStatus } from "../../GasStationTypes";
import { NumberFormattingHelper } from "../../NumberFormattingHelper";
import { ShowListInputDialogClientRequest, ShowListInputDialogClientResponse } from "PosApi/Consume/Dialogs";
import { ClientEntities } from "PosApi/Entities";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import { ISimpleProductDetailsToExtensionCommandMessageTypeMap, SimpleProductDetailsExtensionCommandBase, SimpleProductDetailsProductChangedData } from "PosApi/Extend/Views/SimpleProductDetailsView";
import { GasStationDataStore } from "../../GasStationDataStore";
import PumpGasDialog from "../../Create/Dialogs/PumpGasDialog";
import { StringExtensions } from "PosApi/TypeExtensions";

/**
 * An extension command for the Simple Product details view that will display the pump gas dialog.
 */
export default class PumpGasExtensionCommand extends SimpleProductDetailsExtensionCommandBase {
    constructor(context: IExtensionCommandContext<ISimpleProductDetailsToExtensionCommandMessageTypeMap>) {
        super(context);
        this.extraClass = "iconDeliveryTruck"
        this.id = "startStopPumpingGasExtensionCommand";
        this.label = "Start/stop pumping gas";
        this.productChangedHandler = (data: SimpleProductDetailsProductChangedData): void => {
            if (StringExtensions.compare(data.product.ItemId, GasStationDataStore.instance.gasStationDetails.GasolineItemId, true) === 0) {
                this.isVisible = true;
                this.canExecute = true;
            }
        };
    }

    protected init(state: Commerce.Extensibility.ISimpleProductDetailsExtensionCommandState): void {
        if (StringExtensions.compare(state.product?.ItemId, GasStationDataStore.instance.gasStationDetails.GasolineItemId, true) === 0) {
            this.isVisible = true;
            this.canExecute = true;
        }
    }

    protected execute(): void {
        this.isProcessing = true;
        let dialogOptions: ClientEntities.Dialogs.IListInputDialogOptions = {
            title: "Select gas pump",
            items: GasStationDataStore.instance.pumps.filter((pump: Entities.GasPump): boolean => {
                return pump.State.GasPumpStatusValue === GasPumpStatus.Idle
            }).map((pump): ClientEntities.Dialogs.IListInputDialogItem => {
                return { value: pump.Id, label: pump.Name };
            })
        };

        let selectPumpRequest: ShowListInputDialogClientRequest<ShowListInputDialogClientResponse> = new ShowListInputDialogClientRequest(dialogOptions);
        this.context.runtime.executeAsync(selectPumpRequest).then((result: ClientEntities.ICancelableDataResult<ShowListInputDialogClientResponse>) => {
            if (result.canceled) {
                return;
            }

            let dialog = new PumpGasDialog();
            dialog.open({ pumpId: result.data.result.value.value }).then((pumpResult: ClientEntities.ICancelableDataResult<number>): Promise<any> => {
                if (result.canceled) {
                    return Promise.resolve();
                }

                return GasStationDataStore.instance.updatePumpStatusAsync(
                    this.context,
                    result.data.result.value.value,
                    {
                        GasPumpStatusValue: GasPumpStatus.PumpingComplete,
                        LastUpdateTime: new Date(),
                        SaleVolume: pumpResult.data,
                        SaleTotal: NumberFormattingHelper.roundToNDigits(GasStationDataStore.instance.gasStationDetails.GasBasePrice * pumpResult.data, 3)
                    });
            });
        }).catch((reason: any): void => {
        }).then((): void => {
            this.isProcessing = false;
        });
    }
}