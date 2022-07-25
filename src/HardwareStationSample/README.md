## Hardware Station(HWS) Extension

Hardware Station is used by Store Commerce, Modern POS (MPOS) and Cloud POS(CPOS) to connect to hardware peripherals, such as printers, cash drawers, scanners, and payment terminals. This project contains sample code on how to create HWS extensions and extension installers for shared HWS.  

The Sealed Shared HWS installer must be installed before running the extension installer, follow this doc to [install HWS](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/enhanced-mass-deployment)

For detailed steps on how to create extension HWS installer, follow the [Generate an extension installer for the shared Hardware station](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/hardware-device-extension#generate-an-extension-installer-for-the-shared-hardware-station-for-application-release-10018-or-later)

## HWS docs:

[Integrate the POS with a new hardware device](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/hardware-device-extension)

[Create an end-to-end payment integration for a payment terminal](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/end-to-end-payment-extension)

### Consume extension in MPOS local HWS

To consume the HWS extension in local/dedicated HWS, the HWS extension must be packaged with the MPOS, in the modern pos JavaScript project add reference to your HWS projects and then use the POS installer project to create the extension installer. Refer the sample JavaScript project available in the [Dynamics  365 Commerce InStore samples repo](https://github.com/microsoft/Dynamics365Commerce.InStore) - [src/PosSample/ModernPos/ModernPos.jsproj] folder for more details.

If you have only HWS extension, then remove all the other unwanted project references from the sample. ModernPos.jsproj creates the msix installer and then the installer project consumes it and creates the exe installer, HWS extensions will be deployed as UWP app extension.


## Using the samples

You can download the sample as zip and open it in Visual Studio (VS 2017).
After opening in VS 2017, build the project. After successful build, output installer package will be created.

To deploy the Shared Hardware station extension for POS and to test it, follow the below steps.

1. Run the extension installer generated using command prompt.

   Ex: C:\HardwareStation.Installer\bin\Debug\net472> .\HardwareStation.Installer.exe install

2. Close POS if it's running.
3. Open POS and configure it to use the Shared Hardware Station.
4. Validate the extension scenario.