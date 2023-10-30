# Printing QR Code Sample
## Overview
This sample showcases a sample Store Commerce extension that prints a QR code on the receipt. The QR code can be scanned by a mobile device to open the receipt in the browser.

## Configuring the sample
> For more details on how to extend Commerce Store receipts, see [Extend Commerce Store receipts](https://learn.microsoft.com/en-us/dynamics365/commerce/dev-itpro/retail-sdk/retail-sdk-samples).
1. Sign in to HQ.
2. Got to Retail and Commerce > Channel setup > POS setup > POS profiles > Language text.
3. On the POS tab, select Add to add new POS language text.
4. Enter the following values:
    - Language ID: en-us
    - Text ID: 10001
    - Text: QR Code
5. On the Action Pane, select Save to save your changes.
6. Go to Retail and Commerce > Channel setup > POS setup > POS profiles > Custom fields.
7. On the Action Pane, select Add to add a new custom field, and specify the following information:
    - Name: QRCODESAMPLE
    - Type: Receipt
    - Caption text ID: 10001
8. On the Action Pane, select Save to save your changes.
9. Go to Retail and Commerce > Channel setup > POS setup > POS profiles > Receipt formats.
10. Select an existing or create a new receipt format and then select Designer on the Action Pane.
11. If you're prompted to confirm that you want to open the application, select Open, and then follow the installation instructions.
12. After the designer is installed, you're asked for Azure Active Directory (Azure AD) credentials. Enter the information to start the designer.
13. In the designer, drag and drop the **QR Code** field from the left pane to the receipt designer.
14. Save the changes.
15. Go to Retail and Commerce > Retail and Commerce IT > Distribution schedule.
16. Select the Channel configuration (1070) job, and then select Run now.

## Running the sample
- Open the Developer Command Prompt for Visual Studio 2022
- Restore the nuget packages for the solution by running "nuget restore QRCodeSample.sln"
- Initialize Store Commerce development for the solution by running "msbuild QRCodeSample.sln /t:InitDev"
- Open Visual Studio Code in the solution root directory
- Build the solution using the "Build & Install Store Commerce Extension" task in VSCode
- Open PowerShell as Admin in the ScaleUnit.Installer bin directory & run ".\Contoso.QRCodeSample.ScaleUnit.Installer.exe install"
- Open the "Run & Debug Tab" in VSCode and use the "Debug Store Commerce" option to launch Store Commerce app with the debugger attached.
- Sign in to Store Commerce.
- Navigate to the transaction page and add a product to the cart.
- Complete the transaction and print the receipt.
- Verify that the receipt contains a QR code.

## Additional Resources
- [Extend Commerce Store receipts](https://learn.microsoft.com/en-us/dynamics365/commerce/dev-itpro/retail-sdk/retail-sdk-samples)
- [Generate QR codes and print them on receipts](https://learn.microsoft.com/en-us/dynamics365/commerce/localizations/ind-generate-qr-code-print-receipt)
- [Set up and design receipt formats](https://learn.microsoft.com/en-us/dynamics365/commerce/receipt-templates-printing)