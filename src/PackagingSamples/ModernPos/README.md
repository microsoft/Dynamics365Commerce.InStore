# ModernPos Packaging Sample Solution
This solution demonstrates how to create a package Modern POS extensions app package with Headless Commerce Engine Extensions for offline mode, and the Modern POS App Package Installer with Offline Database extensions.

## Using the samples
You can download the sample as zip and open it in Visual Studio (VS 2017).
After opening in VS 2017, build the project. After successful build, output installer package will be created.

To deploy the MPOS extension, follow these steps.
Note: Sealed MPOS must be installed before deploying the extension.
1. Run the extension installer generated using command prompt.

   Ex: C:\ModernPos.Installer\bin\Debug\net472> .\ModernPos.Installer.exe install

2. Close Modern POS if it's running.
3. Open Modern POS and click the setting button and check the extension package deployment status under the Extension package section.
4. Validate the extension by navigating to Product Search view and click the custom app bar button.

## Projects
### ModernPosPackagingSample.Pos.csproj
This project contains the POS TypeScript extensions that will be included into the ModernPos App Package (msix).

#### Using Knockout.js
The sample provided shows how to use the knockout.js library to help with data binding in the extensions UI. However, the knockout.js package doesn't have the knockout declaration file as it is not available on a reliable nuget feed. The steps below describe how to manually add that declaration file:

1. Access [knockout official releases](https://github.com/knockout/knockout/releases).
2. Download the source code (zip) of the version that was included as a dependency in the _manifest.json_.
3. Extract the content of the zip file. The types are localted at _<KNOCKOUT_LIBRARY_FOLDER>\build\types\knockout.d.ts_.
4. Copy the _knockout.d.ts_ file to any folder in the extension project.
5. Include the _knockout.d.ts_ file in the project in case it wasn't included automatically.

The types for the knockout should be available now. Similar process should be done for any other added library dependency.

### ModernPosPackagingSample.CommerceRuntime.csproj
This project contains samples on how to create Commerce Runtime and Headless Commerce APIs. Within the ModernPosPackagingSample solution this Commerce Runtime assembly will be included in the ModernPos extension package and the functionality will be available in offline mode automatically.

[Commerce Runtime Extension patterns](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/commerce-runtime-extensibility)
[Headles Commerce APIs](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/retail-server-icontroller-extension)

### ModernPosPackagingSample.ModernPos.jsproj
This project contains samples on how to create a Modern Point of Sale (MPOS) packaging project by using Visual Studio 2017. These steps are required only if you're developing extensions for MPOS. The MPOS extension packaging project generates the MSIX Windows app package that will extend the MPOS app.

[Create an .appx file for a Modern POS extension package](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/pos-extension/create-pos-extension-appx)

#### Code signing a Modern POS (MSIX) extension package

The .appx files for Modern POS extension must be signed by a code signing certificate. For production, we recommend that you use a certificate from a trusted authority. For information about how to sign a Universal Windows Platform (UWP) app, see [Create a certificate for package signing](/windows/uwp/packaging/create-certificate-package-signing).

To include your code signing certificate in the Modern POS JavaScript project file, edit the sample ModernPos.jsproj file, and include the node for certificate signing, as shown in the following XML.

```XML
<PackageCertificateKeyFile Condition="Exists('.\MPOS_Extension_Certificate.pfx')">MPOS_Extension_Certificate.pfx</PackageCertificateKeyFile>
```

If you're using a self-signed certificate for development purposes, you must manually make the certificate trusted on the machine by adding it to the trusted root folder.

You can also download and include a certificate from a secured location or a secure task during build automation.

For information about how to code sign Universal Windows app packages, see the following topics:

+ [Configure the Build solution build task](/windows/uwp/packaging/auto-build-package-uwp-apps#configure-the-build-solution-build-task)
+ [Create a certificate for package signing](/windows/msix/package/create-certificate-package-signing)

The sample generates a self-signed test certificate during build. This certificate is for development purposes only, don't use this development certificate for production app extension packages, it's available only to unblock development scenarios.

> [!WARNING]
> The sample script included to generate the test certificate will work only with a domain account, if you are not using the domain account the build will fail. If you are running with non-domain account, generate or include your own certificate in the <PackageCertificateKeyFile> section.

The test certificate that is generated will be available in the project's intermediate output directory.

- The default location of the test certificate is **bld\\x86\\Debug\\MPOS\_Extension\_Certificate.pfx**.
- You **must** manually make the test certificate trusted before the extension package can be successfully installed on the development machine.

### ModernPosPackagingSample.ChannelDatabase.csproj
This project contains samples on how to create Commerce Runtime database extensions.

### ModernPosPackagingSample.ModernPos.Installer.csproj
This project contains samples on how to create POS extensions installer.

Please see [Create a Modern POS extension package](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/pos-extension/mpos-extension-packaging) for more details.

## Additional Resources
- [POS Extension Overview](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/pos-extension/pos-extension-getting-started)
- [Create a Modern POS Extension Package (MSIX)](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/pos-extension/create-pos-extension-appx)
- [Code signing a Modern POS (MSIX) Extension Package](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/pos-extension/mpos-extension-signing)
- [Create a Modern POS Extension Package Installer](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/pos-extension/mpos-extension-packaging)
