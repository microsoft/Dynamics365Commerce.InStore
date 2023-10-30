# Triggers Sample
## Overview
This sample shows how to use Cancelable, NonCancelable, and DataModification triggers:
 - A Cancelable trigger has been implemented to add a dialog confirmation when modifying the quantity of a product during a transaction.
 - A NonCancelable trigger has been implemented to adjust the Unit of Measure for a product when it is added to the cart.
 - A DataModification trigger has been implemented to filter out the list of allowable payment types, simulating a credit card only POS terminal.
 - Another Cancelable trigger has been implemented to demonstrate how users can return errors during trigger execution that break the normal action flow.
 - A trigger has been implemented sound play product was added to demonstrate how to use resource files in extension.

![Demo](./Demo.gif)

## Running the sample
- Open the Developer Command Prompt for Visual Studio 2022
- Restore the nuget packages for the solution by running "nuget restore Contoso.TriggerSamples.sln"
- Initialize Store Commerce development for the solution by running "msbuild Contoso.TriggerSamples.sln /t:InitDev"
- Open Visual Studio Code in the solution root directory
- Build the solution using the "Build & Install Store Commerce Extension" task in VSCode
- Open the "Run & Debug Tab" in VSCode and use the "Debug Store Commerce" option to launch Store Commerce app with the debugger attached.
- Sign in to Store Commerce
- **NonCancelable Trigger**:
  - Add Product ID 81212 to the cart, selecting any size.
  - Notice that after the cart line has been added, the Unit of Measure is updated to dozen and a new price is calculated.
- **Cancelable Trigger**:
  - Click *Set Quantity* and notice the new dialog confirming if the user wants to continue.
    - Clicking *Yes* will continue the action flow as normal.
    - Clicking *No* will cancel the action flow.
- **DataModification Trigger**:
  - Click the *Payments* tab at the top of the pane, and then click *Add payment*.
  - Notice that all payment options have been filtered out except for *Cards*.
- **Cancelable Trigger with errors**:
  - Add Product ID 81213 to the cart.
  - Notice that an error dialog is shown, and the action flow is canceled.
- **Sound Play Trigger**:
  - Add any product to the cart.
  - Notice that a sound is played.

## APIs and extension points used
###"PosApi/Consume/Cart"
- **ChangeCartLineUnitOfMeasureOperationRequest/ChangeCartLineUnitOfMeasureOperationResponse**: This API is used to submit a new Unit of Measure for a Cart Line. In this sample it is used to automatically update the Unit of Measure of Product ID 81212 to "Dozen" when it is added to the cart.
###"PosApi/Consume/Dialogs"
- **ShowMessageDialogClientRequest/ShowMessageDialogClientResponse**: This API is used to show a message in POS. In this sample it is used to display a confirmation message.
  - **IMessageDialogOptions**: This object defines the properties of the dialog to be displayed.
    - **message**: Text to display within the dialog.
    - **showCloseX**: Boolean for whether an 'X' exit button should be shown on the dialog.
    - **button1**, **button2**: These objects define the properties of the buttons on the dialog to be displayed.
      - **id**: Internal ID for the button object.
      - **label**: Text to display on the button.
      - **result**: Text to return as the dialog result if this button is clicked on.
      - **isPrimary**: Boolean for whether this button is the primary button on the dialog.
###"PosApi/Entities"
- **ClientEntities**: This namespace is used to access Client Entities within POS. In this sample it is used to access the `ICancelable` interface for Cancelable triggers and to access the `ExtensionError` object for returning errors during trigger execution.
- **ProxyEntities**: This namespace is used to access Proxy Entities within POS. In this sample it is used to access the `CartLine` interface for searching the cart for a specific Product ID.
###"PosApi/Extend/Triggers/ProductTriggers"
- **PreProductSaleTrigger**: This abstract base class is used for all PreProductSale triggers. In this sample it is extended by `ForceErrorPreProductSaleTrigger` in the returning errors trigger sample.
  - **IPreProductSaleTriggerOptions**: This interface defines the options passed to the PreProductSale trigger.
- **PostProductSaleTrigger**: This abstract base class is used for all PostProductSale triggers. In this sample it is extended by `ChangeUnitOfMeasurePostProductSaleTrigger` in the NonCancelable trigger sample.
  - **IPostProductSaleTriggerOptions**: This interface defines the options passed to the PostProductSale trigger.
- **PreSetQuantityTrigger**: This abstract base class is used for all PreSetQuantity triggers. In this sample it is extended by `ConfirmChangeQuantityTrigger` in the Cancelable trigger sample.
  - **IPreSetQuantityTriggerOptions**: This interface defines the options passed to the PreSetQuantity trigger.
###"PosApi/Extend/Triggers/TransactionTriggers"
- **PreSelectTransactionPaymentMethod**: This abstract base class is used for all PreSelectTransactionPaymentMethod triggers. In this sample it is extended by `CreditCardOnlyPreSelectTransactionPaymentMethod` in the DataModification trigger sample.
  - **IPreSelectTransactionPaymentMethodTriggerOptions**: This interface defines the options passed to the PreSelectTransactionPaymentMethod trigger.
###"PosApi/Extend/Triggers/Triggers"
- **CancelableTriggerResult**: This class is used for returning the modified data result in a DataModification trigger. In this sample it is used to return the list of payment methods after non-credit card options were removed.
###"PosApi/TypeExtensions"
- **ArrayExtensions**: The array extensions class provides utility methods that make it easier to work with arrays.
- **ObjectExtensions**: The object extensions class provides utility methods that make it easier to work with javascript objects.

## Additional Resources
- [Debugging POS Extensions in Store Commerce](https://learn.microsoft.com/en-us/dynamics365/commerce/dev-itpro/sc-debug)
- [Debugging POS Extensions in Cloud POS](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/pos-extension/debug-pos-extension#run-and-debug-cloud-pos)
- [POS APIs](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/pos-apis)
- [POS Triggers](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/pos-trigger-printing)