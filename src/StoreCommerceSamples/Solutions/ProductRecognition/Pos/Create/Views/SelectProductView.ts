import ko from "knockout";
import { CustomViewControllerBase, ICustomViewControllerConfiguration, ICustomViewControllerContext, Icons } from "PosApi/Create/Views";
import { IDataList, IDataListOptions, DataListInteractionMode } from "PosApi/Consume/Controls";
import { ObjectExtensions, ArrayExtensions } from "PosApi/TypeExtensions";
import { AddItemToCartOperationRequest, AddItemToCartOperationResponse } from "PosApi/Consume/Cart";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { CurrencyFormatter } from "PosApi/Consume/Formatters";
import { ShowMessageDialogClientRequest, ShowMessageDialogClientResponse } from "PosApi/Consume/Dialogs";

/**
 * Options for initializing the SelectProductView.
 */
export interface ISelectProductViewOptions {
    products: ProxyEntities.SimpleProduct[];
    confidenceScores?: { [recordId: number]: number }; // Object mapping RecordId to confidence score
}

/**
 * Product data for display that includes confidence score.
 */
interface IProductDisplayData {
    product: ProxyEntities.SimpleProduct;
    confidenceScore: number;
}

/**
 * The select product view for choosing from multiple recognized products.
 */
export default class SelectProductView extends CustomViewControllerBase {
    public dataList: IDataList<IProductDisplayData>;
    public selectedProduct: ko.Observable<ProxyEntities.SimpleProduct>;
    public isProductSelected: ko.Computed<boolean>;
    private products: IProductDisplayData[];

    /**
     * Creates a new instance of the SelectProductView class.
     * @param {ICustomViewControllerContext} context The view controller context.
     * @param {ISelectProductViewOptions} options The view options containing products to display.
     */
    constructor(context: ICustomViewControllerContext, options: ISelectProductViewOptions) {
        let config: ICustomViewControllerConfiguration = {
            title: "Select Product",
            commandBar: {
                commands: [
                    {
                        name: "AddToCartCommand",
                        label: "Add to Sale",
                        icon: Icons.Add,
                        isVisible: true,
                        canExecute: false,
                        execute: (): void => {
                            this.addProductToCart();
                        }
                    },
                    {
                        name: "CancelCommand",
                        label: "Cancel",
                        icon: Icons.Cancel,
                        isVisible: true,
                        canExecute: true,
                        execute: (): void => {
                            this.context.navigator.navigateToPOSView("CartView");
                        }
                    }
                ]
            }
        };

        super(context, config);

        // Map products with confidence scores
        this.products = options && options.products ? options.products.map((product) => {
            const confidenceScore = (options.confidenceScores && options.confidenceScores[product.RecordId]) || 0;
            return {
                product: product,
                confidenceScore: confidenceScore
            };
        }) : [];

        this.selectedProduct = ko.observable(null);
        this.isProductSelected = ko.computed(() => !ObjectExtensions.isNullOrUndefined(this.selectedProduct()), this);
    }

    /**
     * The onReady function is called when the page element has been added to the DOM.
     * @param {HTMLElement} element The root element for the view.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        const dataListElement = element.querySelector("#productDataList") as HTMLDivElement;
        this.initializeDataList(dataListElement);
    }

    /**
     * Initializes the data list control.
     * @param {HTMLDivElement} element The root element for the data list.
     */
    private initializeDataList(element: HTMLDivElement): void {
        const dataListOptions: IDataListOptions<IProductDisplayData> = {
            interactionMode: DataListInteractionMode.SingleSelect,
            data: this.products,
            columns: [
                {
                    title: "Product",
                    ratio: 40,
                    collapseOrder: 1,
                    minWidth: 150,
                    computeValue: (row: IProductDisplayData): string => {
                        return `${row.product.Name} (${row.product.ItemId})`;
                    }
                },
                {
                    title: "Price",
                    ratio: 20,
                    collapseOrder: 3,
                    minWidth: 100,
                    computeValue: (row: IProductDisplayData): string => {
                        return CurrencyFormatter.toCurrency(row.product.Price);
                    }
                },
                {
                    title: "Confidence",
                    ratio: 40,
                    collapseOrder: 2,
                    minWidth: 100,
                    computeValue: (row: IProductDisplayData): string => {
                        return `${Math.round(row.confidenceScore * 100)}%`;
                    }
                }
            ]
        };

        this.dataList = this.context.controlFactory.create<IProductDisplayData>(
            this.context.logger.getNewCorrelationId(),
            "DataList",
            dataListOptions,
            element
        );

        // Add event listener for selection changes
        this.dataList.addEventListener("SelectionChanged", (eventData: { items: IProductDisplayData[] }): void => {
            if (eventData.items && eventData.items.length > 0) {
                this.selectedProduct(eventData.items[0].product);

                // Enable the add to cart command
                const addToCartCommand = ArrayExtensions.firstOrUndefined(this.state.commandBar.commands, (c) => c.name === "AddToCartCommand");
                if (addToCartCommand) {
                    addToCartCommand.canExecute = true;
                }
            } else {
                this.selectedProduct(null);

                // Disable the add to cart command
                const addToCartCommand = ArrayExtensions.firstOrUndefined(this.state.commandBar.commands, (c) => c.name === "AddToCartCommand");
                if (addToCartCommand) {
                    addToCartCommand.canExecute = false;
                }
            }
        });

        // Add event listener for row click (alternative to add to cart)
        this.dataList.addEventListener("ItemInvoked", (eventData: { item: IProductDisplayData }): void => {
            this.selectedProduct(eventData.item.product);
            this.addProductToCart();
        });
    }

    /**
     * Adds the selected product to the cart.
     */
    private async addProductToCart(): Promise<void> {
        const product = this.selectedProduct();
        if (!product) {
            return;
        }

        try {
            this.state.isProcessing = true;

            const productDetails: ClientEntities.IProductSaleReturnDetails = {
                productId: product.RecordId,
                quantity: 1
            };

            const addItemRequest = new AddItemToCartOperationRequest<AddItemToCartOperationResponse>(
                [productDetails],
                this.context.logger.getNewCorrelationId()
            );

            const result = await this.context.runtime.executeAsync(addItemRequest);

            this.state.isProcessing = false;

            if (result && !result.canceled) {
                // Successfully added to cart, navigate to cart view
                this.context.navigator.navigateToPOSView("CartView");
            } else {
                await this.showErrorMessage("Failed to add product to cart.");
            }
        } catch (error) {
            this.state.isProcessing = false;
            this.context.logger.logError("Add to cart failed: " + error.message);
            await this.showErrorMessage(`Failed to add product to cart: ${error.message}`);
        }
    }

    /**
     * Shows an error message to the user.
     * @param {string} message The error message to display.
     */
    private async showErrorMessage(message: string): Promise<void> {
        try {
            const messageRequest = new ShowMessageDialogClientRequest<ShowMessageDialogClientResponse>({
                title: "Select Product",
                message: message
            });
            await this.context.runtime.executeAsync(messageRequest);
        } catch (error) {
            this.context.logger.logError("Error showing message: " + error);
        }
    }

    /**
     * The dispose method is called when the view is removed from the DOM.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}