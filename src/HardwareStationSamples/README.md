## Hardware Station (HWS) Extension

Hardware Station is used by Store Commerce for Windows, Web, Mac, iOS, and Android to connect to hardware peripherals, such as printers, cash drawers, scanners, and payment terminals. This project contains sample code on how to create HWS extensions and extension installers for shared HWS.

The Shared HWS installer must be installed before running the extension installer, follow this doc to [install HWS](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/enhanced-mass-deployment)

For detailed steps on how to create an HWS extension installer, follow the [Generate an extension installer for the shared Hardware Station](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/hardware-device-extension#generate-an-extension-installer-for-the-hardware-station)

## HWS docs:

[Integrate the POS with a new hardware device](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/hardware-device-extension)

[Create an end-to-end payment integration for a payment terminal](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/end-to-end-payment-extension)

### Consume extension in local HWS

To consume the HWS extension in local/dedicated HWS, the HWS extension must be packaged with the POS app: in the POS JavaScript project add a reference to your HWS projects, and then use the POS installer project to create the extension installer. Refer to the packaging samples available in the [Dynamics 365 Commerce InStore samples repo](https://github.com/microsoft/Dynamics365Commerce.InStore) - `src/PackagingSamples/StoreCommerceApp` folder for more details.

If you have only an HWS extension, then remove all the other unwanted project references from the sample. The POS JavaScript project creates the msix installer and then the installer project consumes it and creates the exe installer, HWS extensions will be deployed as UWP app extension.


## Using the samples

You can download the sample as zip and open it in Visual Studio (VS 2026).
After opening in VS 2026, build the project. After successful build, output installer package will be created.

To deploy the Shared Hardware Station extension for POS and to test it, follow the below steps.

1. Run the extension installer generated using command prompt.

   Ex: C:\HardwareStation.Installer\bin\Debug\net472> .\HardwareStation.Installer.exe install

2. Close POS if it's running.
3. Open POS and configure it to use the Shared Hardware Station.
4. Validate the extension scenario.

To deploy the Dedicated Hardware Station extensions (OPOS and Windows printer samples) for POS and to test them, follow the steps below:

1. Close POS if it's running.
2. Rebuild the Contoso.HardwareStation.Samples solution. Verify that in the build output, the installer completed successfully by seeing the message:

  `InstallStoreCommerceExtensions: Running the StoreCommerce extensions installer completed successfully.`

3. Copy the CommerceRuntime DLL (HardwareStationSamples\CommerceRuntime\bin\Debug\netstandard2.0\Contoso.HardwareStationSamples.CommerceRuntime.dll) into your dev environment's Commerce Scale Unit extension folder (\Pkg\bin\Ext).
4. In the same folder, open the CommerceRuntime.Ext.config and add a line for the extension assembly:
  `	<add source="assembly" value="Contoso.HardwareStationSamples.CommerceRuntime" />`
5. Open POS and configure it to use the Local Hardware Station.
6. Validate the extension scenarios.