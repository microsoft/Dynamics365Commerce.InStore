/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as PaymentView from "PosApi/Extend/Views/PaymentView";
import MessageDialog from "../../../Create/Dialogs/DialogSample/MessageDialog";

export default class PaymentViewCommand extends PaymentView.PaymentViewExtensionCommandBase {

    private _paymentCard: Commerce.Proxy.Entities.PaymentCard;
    private _tenderType: Commerce.Proxy.Entities.TenderType;
    private _fullAmount: number;
    private _currency: Commerce.Proxy.Entities.Currency;
    private _paymentAmount: string;

    /**
     * Creates a new instance of the ButtonCommand class.
     * @param {IExtensionCommandContext<PaymentView.IPaymentToExtensionCommandMessageTypeMap>} context The command context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<PaymentView.IPaymentViewToExtensionCommandMessageTypeMap>) {
        super(context);

        this.label = "Payment Command";
        this.id = "PaymentCommand";
        this.extraClass = "iconLightningBolt";
    }

    /**
     * Initializes the command.
     * @param {PaymentView.IPaymentViewExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: PaymentView.IPaymentViewExtensionCommandState): void {
        this._paymentCard = null;
        this._tenderType = state.tenderType;
        this._fullAmount = state.fullAmount;
        this._currency = state.currency;

        // Only allow button if it is for credit cards
        if (state.tenderType.OperationId === Commerce.Proxy.Entities.RetailOperation.PayCard) {
            this.isVisible = true;
            this.canExecute = true;

            this.paymentViewPaymentCardChangedHandler = (data: PaymentView.PaymentViewPaymentCardChanged): void => {
                this._paymentCard = data.paymentCard;
                this.context.logger.logInformational("Payment View Command - Payment card changed");
            };

            this.paymentViewAmountChangedHandler = (data: PaymentView.PaymentViewAmountChanged): void => {
                this._paymentAmount = data.paymentAmount;
                this.context.logger.logInformational("Payment View Command - Amount changed");
            };
        } else {
            this.isVisible = false;
            this.canExecute = false;
        }
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        MessageDialog.show(this.context, "Payment View Command - Execute");
    }
}
