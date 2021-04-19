
---
page_type: sample
languages:
- csharp
- typescript
- html
products:
- Dynamics 365 Commerce
name: Extend Commerce POS, HWS and Headless commerce engine (CRT/RS)
description: This repo contains the sample code on how to extend the Dynamics 365 Commerce POS, Hardware station, Retail Server and Commerce runtime.
---

# Dynamics 365 Commerce SDK

The Dynamics 365 Commerce SDK contains the reference package, samples, and tools to build extension for the Dynamics 365 Commerce components.

This repo contains the sample that demonstrates how to create extension for Modern Point of Sale (MPOS), Cloud Point of sale (CPOS), Hardware station (HWS) and Commerce Scale unit – Self hosted (CSU)

| Release branch name                                                                        | version | Application release version |
| ------------------------------------------------------------------------------------------ | ------- | --------------------------- |
| [Release/9.28](https://github.com/microsoft/Dynamics365Commerce.InStore/tree/release/9.28) | 9.28.\* | 10.0.18                     |
| [Release/9.29](https://github.com/microsoft/Dynamics365Commerce.InStore/tree/release/9.29) | 9.29.\* | 10.0.19                     |

To clone a specific release branch, use the following command:

git clone --single-branch --branch release/9.28 [https://github.com/microsoft/Dynamics365Commerce.InStore.git](https://github.com/microsoft/Dynamics365Commerce.InStore.git)

This will clone the release/9.28 into your current directory.

The **Commerce.InStore repo** folders and projects:

POS – Sample code and installer project related to POS extensions.

HWS – Sample code and packaging project related to HWS extensions.

CSU- Self hosted – Sample code and installer project related CSU self-hosted extension.

## Hardware station sample
This samples showcase how to do a payment device extension for POS device, this sample requires Visual studio 2017 to build and requires local hardware station or the shared hardware station hosted in IIS.

## Using the samples

You can download the sample as zip and open it in Visual Studio (VS 2017) or clone the sample using Git and open it in VS 2017. 
After opening in VS 2017, build the project. After successful build, output installer package will be created.

To deploy the Hardware station extension in Modern POS and test it by using the local Hardware station, follow these steps.
The Sealed HWS installer must be installed before running the extension installer.

1. Run the extension installer generated using command prompt.
2. Close Modern POS if it's running.
3. Open Modern POS and configure it to use the local Hardware station.
4. Validate the extension payment scenario.

To validate it with CPOS, you need to install the shared HWS and then run the extension installer.

## Modern Point of Sale (MPOS) sample
The POS sample showcase how to create a new view, custom dialogs and extend existing view with App bar buttons. Also, from the custom view how to call the custom Headless commerce APIs.

## Using the samples
You can download the sample as zip and open it in Visual Studio (VS 2017) or clone the sample using Git and open it in VS 2017. 
After opening in VS 2017, build the project. After successful build, output installer package will be created.

To deploy the MPOS extension, follow these steps.
Note: Sealed MPOS must be installed before deploying the extension.
1. Run the extension installer generated using command prompt.
2. Close Modern POS if it's running.
3. Open Modern POS and click the Setting button and check the extension package deployment status under the Extension package section.
4. Validate the extension by navigating to Product Search view and click the custom app bar button.

## Commerce Scale unit – Self hosted (CSU)
This repo contains the sample code for how to customize the Commerce runtime (CRT), Retail server (RS) and channel database.
The sample showcase to create a new trigger for CRT, override the CRT handler, create new RS extension, and add database extensions in ext schema. Check this doc for more detailed information on the [Commerce runtime extension](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/commerce-runtime-extensibility)

## Using the samples
You can download the sample as zip and open it in Visual Studio (VS 2017) or clone the sample using Git and open it in VS 2017. 
After opening in VS 2017, build the project. After successful build, output installer package will be created.

To deploy the CSU-Self hosted extension, follow these steps.
Note: Sealed CSU-self hosted must be installed before deploying the extension.
1. Run the extension installer generated using command prompt.
2. Navigate to RetailServer\webroot\bin\Ext folder to check the extension component deployed correctly.


## Download reference packages for Commerce SDK extensions

APIs, Contracts, messages, entities, and request packages are published in the public repository, extension code to consume and create or extend functionalities.

Consume the packages from https://pkgs.dev.azure.com/commerce-partner/Registry/_packaging/dynamics365-commerce/nuget/v3/index.json. You can add the package source location in the nuget.config file of your extension project file.

```
<packageSources>
    <add key="dynamics365-commerce" value="https://pkgs.dev.azure.com/commerce-partner/Registry/_packaging/dynamics365-commerce/nuget/v3/index.json" />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
</packageSources>
```