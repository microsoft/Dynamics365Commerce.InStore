/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import {
    SimpleProductDetailsCustomControlBase,
    ISimpleProductDetailsCustomControlState,
    ISimpleProductDetailsCustomControlContext
} from "PosApi/Extend/Views/SimpleProductDetailsView";
import { InventoryLookupOperationRequest, InventoryLookupOperationResponse } from "PosApi/Consume/OrgUnits";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { ArrayExtensions } from "PosApi/TypeExtensions";
import * as Controls from "PosApi/Consume/Controls";

export default class ProductAvailabilityPanel extends SimpleProductDetailsCustomControlBase {
   
    public dataList: Controls.IDataList<ProxyEntities.OrgUnitAvailability>;
    public readonly title: string;

    private static readonly TEMPLATE_ID: string = "Contoso_Pos_Extensibility_Samples_ProductAvailabilityPanel";
    private _state: ISimpleProductDetailsCustomControlState;
    private _orgUnitAvailabilities: ProxyEntities.OrgUnitAvailability[] = [];

    constructor(id: string, context: ISimpleProductDetailsCustomControlContext) {
        super(id, context);

        this.title = "Product Availability";
    }

    /**
     * Binds the control to the specified element.
     * @param {HTMLElement} element The element to which the control should be bound.
     */
    public onReady(element: HTMLElement): void {
        let templateElement: HTMLElement = document.getElementById(ProductAvailabilityPanel.TEMPLATE_ID);
        let templateClone: Node = templateElement.cloneNode(true);
        element.appendChild(templateClone);
        let titleElement: HTMLElement = element.querySelector("#Contoso_Pos_Extensibility_Samples_ProductAvailabilityPanel_TitleElement");
        titleElement.innerText = this.title;

        let dataListOptions: Readonly<Controls.IDataListOptions<ProxyEntities.OrgUnitAvailability>> = {
            columns: [
                {
                    title: "Location",
                    ratio: 31,
                    collapseOrder: 4,
                    minWidth: 100,
                    computeValue: (value: ProxyEntities.OrgUnitAvailability): string => {
                        return value.OrgUnitLocation.OrgUnitName;
                    }
                },
                {
                    title: "Inventory",
                    ratio: 23,
                    collapseOrder: 3,
                    minWidth: 60,
                    computeValue: (value: ProxyEntities.OrgUnitAvailability): string => {
                        return ArrayExtensions.hasElements(value.ItemAvailabilities) ? value.ItemAvailabilities[0].AvailableQuantity.toString() : "0";
                    }
                },
                {
                    title: "Reserved",
                    ratio: 23,
                    collapseOrder: 1,
                    minWidth: 60,
                    computeValue: (value: ProxyEntities.OrgUnitAvailability): string => {
                        return ArrayExtensions.hasElements(value.ItemAvailabilities) ? value.ItemAvailabilities[0].PhysicalReserved.toString() : "0";
                    }
                },
                {
                    title: "Ordered",
                    ratio: 23,
                    collapseOrder: 2,
                    minWidth: 60,
                    computeValue: (value: ProxyEntities.OrgUnitAvailability): string => {
                        return ArrayExtensions.hasElements(value.ItemAvailabilities) ? value.ItemAvailabilities[0].OrderedSum.toString() : "0";
                    }
                }
            ],
            data: this._orgUnitAvailabilities,
            interactionMode: Controls.DataListInteractionMode.None,
        };

        let dataListRootElem: HTMLDivElement = element.querySelector("#Contoso_Pos_Extensibility_Samples_ProductAvailabilityPanel_DataList") as HTMLDivElement;
        this.dataList = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "DataList", dataListOptions, dataListRootElem);
    }

    /**
     * Initializes the control.
     * @param {ISimpleProductDetailsCustomControlState} state The initial state of the page used to initialize the control.
     */
    public init(state: ISimpleProductDetailsCustomControlState): void {
        this._state = state;
        let correlationId: string = this.context.logger.getNewCorrelationId();

        if (!this._state.isSelectionMode) {
            this.isVisible = true;
            let request: InventoryLookupOperationRequest<InventoryLookupOperationResponse> =
                new InventoryLookupOperationRequest<InventoryLookupOperationResponse>
                    (this._state.product.RecordId, correlationId);
            this.context.runtime.executeAsync(request)
                .then((result: ClientEntities.ICancelableDataResult<InventoryLookupOperationResponse>) => {
                    if (!result.canceled) {
                        this._orgUnitAvailabilities = result.data.orgUnitAvailability;
                        this.dataList.data = this._orgUnitAvailabilities;
                    }
                }).catch((reason: any) => {
                    this.context.logger.logError(JSON.stringify(reason), correlationId);
                });
        }
    }
}