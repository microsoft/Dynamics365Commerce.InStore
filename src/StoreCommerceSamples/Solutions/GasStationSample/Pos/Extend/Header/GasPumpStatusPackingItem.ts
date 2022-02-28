import {
    CustomPackingItem, ICustomPackingItemContext, CustomPackingItemPosition, ICustomPackingItemState
} from "PosApi/Extend/Header";
import { GasStationDataStore, PumpStatusChangedHandler } from "../../GasStationDataStore";
import { GasPumpStatus } from "../../GasStationTypes";
import { Entities } from "../../DataService/DataServiceEntities.g";
import ko from "knockout";

import GasPump = Entities.GasPump;

/**
 * (Sample) Custom packing item that shows the overall gas pump statuses and opens a dialog with more detailed info on click.
 */
export default class GasPumpStatusPackingItem extends CustomPackingItem {
    /**
     * The position of the custom packing item relative to the out-of-the-box items.
     */
    public readonly position: CustomPackingItemPosition = CustomPackingItemPosition.After;

    /**
     * The background color of the packing item.
     */
    public backgroundColor: ko.Computed<string>;

    /**
     * The label of the packing item.
     */
    public label: ko.Computed<string>;

    private static readonly OK_STATUS_COLOR: string = "green";
    private static readonly WARNING_STATUS_COLOR: string = "orange";
    private static readonly EMERGENCY_STATUS_COLOR: string = "red";
    private static readonly OK_STATUS_LABEL: string = "Pump Statuses: OK";
    private static readonly WARNING_STATUS_LABEL: string = "Pump Statuses: Warning";
    private static readonly EMERGENCY_STATUS_LABEL: string = "Pump Statuses: Emergency";

    private _overallStatus: ko.Observable<GasPumpStatus>;
    private _pumps: GasPump[];
    private _pumpStatusChangedHandlerProxied: PumpStatusChangedHandler;

    /**
     * Initializes a new instance of the CartAmountDuePackingItem class.
     * @param {string} id The item identifier.
     * @param {ICustomPackingItemContext} context The custom packing item context.
     */
    constructor(id: string, context: ICustomPackingItemContext) {
        super(id, context);

        this._overallStatus = ko.observable(GasPumpStatus.Unknown);
        this.backgroundColor = ko.computed((): string => {
            switch (this._overallStatus()) {
                case GasPumpStatus.Emergency:
                    return GasPumpStatusPackingItem.EMERGENCY_STATUS_COLOR;
                case GasPumpStatus.Stopped:
                    return GasPumpStatusPackingItem.WARNING_STATUS_COLOR;
                default:
                    return GasPumpStatusPackingItem.OK_STATUS_COLOR;
            }
        }, this);
        this.label = ko.computed((): string => {
            switch (this._overallStatus()) {
                case GasPumpStatus.Emergency:
                    return GasPumpStatusPackingItem.EMERGENCY_STATUS_LABEL;
                case GasPumpStatus.Stopped:
                    return GasPumpStatusPackingItem.WARNING_STATUS_LABEL;
                default:
                    return GasPumpStatusPackingItem.OK_STATUS_LABEL;
            }
        }, this);
    }

    /**
     * Called when the control element is ready.
     * @param {HTMLElement} packedElement The DOM element of the packed element.
     * @param {HTMLElement} unpackedElement The DOM element of the unpacked element.
     */
    public onReady(packedElement: HTMLElement, unpackedElement: HTMLElement): void {
        ko.applyBindingsToNode(unpackedElement, {
            template: {
                name: "Microsoft_Pos_GasStationHeaderExtensionSample_UnpackedGasPumpStatusItem",
                data: this
            }
        });

        ko.applyBindingsToNode(packedElement, {
            template: {
                name: "Microsoft_Pos_GasStationHeaderExtensionSample_PackedGasPumpStatusItem",
                data: this
            }
        });
    }

    /**
     * Initializes the control.
     * @param {ICustomPackingItemState} state The custom control state.
     */
    public init(state: ICustomPackingItemState): void {
        this.visible = true;
        this._pumps = GasStationDataStore.instance.pumps;
        this._reevaluatePumpStatuses();
        this._pumpStatusChangedHandlerProxied = (pumps: GasPump[]): void => {
            this._pumps = pumps;
            this._reevaluatePumpStatuses();
        };
        GasStationDataStore.instance.addPumpStatusChangedHandler(this._pumpStatusChangedHandlerProxied);
    }

    /**
     * Disposes the control releasing its resources.
     */
    public dispose(): void {
        super.dispose();
    }

    /**
     * Method used to handle the onClick of the custom packing item.
     */
    public onItemClickedHandler(): void {
        this.context.navigator.navigate("GasPumpStatusView");
    }

    /**
     * Method to reevaluate the status of the pumps.
     */
    private _reevaluatePumpStatuses(): void {
        const newStatus: GasPumpStatus = this._getGeneralPumpsStatus(this._pumps);
        this._overallStatus(newStatus);
    }

    /**
     * Method to reevaluate the status of the pumps and check for emergencies or disabled pumps.
     */
    private _getGeneralPumpsStatus(pumps: GasPump[]): GasPumpStatus {
        let newStatus: GasPumpStatus = GasPumpStatus.Unknown;
        for (let i = 0; i < pumps.length; ++i) {
            const pumpState: GasPumpStatus = pumps[i].State.GasPumpStatusValue;
            switch (pumpState) {
                case GasPumpStatus.Emergency:
                    return GasPumpStatus.Emergency;
                case GasPumpStatus.Stopped:
                    newStatus = GasPumpStatus.Stopped;
                    break;
                default:
                    break;
            }
        }
        return newStatus;
    }
}