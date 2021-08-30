This project contains samples on how to create POS extensions installer.

[Create a Modern POS extension package](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/pos-extension/mpos-extension-packaging)

## Using the samples
You can download the sample as zip and open it in Visual Studio (VS 2017).
After opening in VS 2017, build the project. After successful build, output installer package will be created.

To deploy the MPOS extension, follow these steps.
Note: Sealed MPOS must be installed before deploying the extension.
1. Run the extension installer generated using command prompt.

   Ex: C:\ModernPos.Installer\bin\Debug\net461> .\ModernPos.Installer.exe install

2. Close Modern POS if it's running.
3. Open Modern POS and click the setting button and check the extension package deployment status under the Extension package section.
4. Validate the extension by navigating to Product Search view and click the custom app bar button.