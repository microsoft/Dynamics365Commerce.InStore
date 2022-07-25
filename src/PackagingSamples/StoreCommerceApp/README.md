# Store Commerce Packaging Sample Solution
This solution demonstrates how to create a Store Commerce extensions installer package with POS (TypeScript/HTML/CSS) extensions, Headless Commerce Engine Extensions for offline mode, offline database extensions & dedicated hardware station extensions. The output of this sample solution will be an extension installer (exe) used to install the Store Commerce extensions.

## Using the samples
You can download the sample as zip and open it in Visual Studio (VS 2017).
After opening in VS 2017, build the project. After successful build, output installer package will be created.

To deploy the Store Commerce extensions, follow these steps.
Note: Store Commerce must be installed before deploying the extension.
1. Close Store Commerce if it's running.
2. Run the extension installer generated using command prompt.

   Ex: C:\Contoso.StoreCommercePackagingSample.StoreCommerce.Installer\bin\Debug\net472> .\Contoso.StoreCommercePackagingSample.StoreCommerce.Installer.exe install

3. Open Store Commerce and click the setting button and check the extension package deployment status under the Extension package section.

### How to see the samples in action
Navigate to the Product Search View and you'll see the "Product Version" column added to the product search results grid. Then switch to offline mode to see the offline Commerce Runtime extensions working where they will populate the "Product Version" column in the product search results with a randomly generated number.

To see the dedicated hardware station extensions in action complete a transaction and you will be prompted: "Would you like to print the transaction receipt in a file?". If you select "Yes" this will trigger a custom hardware station API (FilePrinter/Print) to showcase the dedicated hardware station extension.

## Projects
### Contoso.StoreCommercePackagingSample.Pos.csproj
This project contains the POS TypeScript extensions that will be included into the Store Commerce Extension Package Installer. These POS extensions will be used when Store Commerce is running in InApp mode, which means the POS content is loaded from the local machine.

### Contoso.StoreCommercePackagingSample.HardwareStation.csproj
This project contains a sample hardware station extension. This hardware station extension creates a new API FilePrinter/Print that writes the provided lines to a text file in the common application data folder. This hardware station extension is packaged inside the Store Commerce installer so that it will be enabled for the dedicated hardware station inside the Store Commerce App.

### Contoso.StoreCommercePackagingSample.CommerceRuntime.csproj
This project contains samples on how to create Commerce Runtime and Headless Commerce APIs. Within the ModernPosPackagingSample solution this Commerce Runtime assembly will be included in the Store Commerce extension package and the functionality will be available in offline mode automatically.

[Commerce Runtime Extension patterns](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/commerce-runtime-extensibility)
[Headless Commerce APIs](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/retail-server-icontroller-extension)

### Contoso.StoreCommercePackagingSample.ChannelDatabase.csproj
This project contains samples on how to create Commerce Runtime/Channel database extensions.

### Contoso.StoreCommercePackagingSample.StoreCommerce.Installer.csproj
This project contains samples on how to create Store Commerce extensions installer.
