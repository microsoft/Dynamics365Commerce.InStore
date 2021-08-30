This project contains samples on how to create Hardware station extensions.

[Integrate the POS with a new hardware device](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/hardware-device-extension)

[Create an end-to-end payment integration for a payment terminal](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/end-to-end-payment-extension)

## Using the samples

You can download the sample as zip and open it in Visual Studio (VS 2017).
After opening in VS 2017, build the project. After successful build, output installer package will be created.

To deploy the Shared Hardware station extension for POS and to test it, follow the below steps.
The Sealed Shared HWS installer must be installed before running the extension installer.

1. Run the extension installer generated using command prompt.

   Ex: C:\HardwareStation.Installer\bin\Debug\net461> .\HardwareStation.Installer.exe install

2. Close POS if it's running.
3. Open POS and configure it to use the Shared Hardware Station.
4. Validate the extension payment scenario.