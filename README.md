---
page_type: sample
languages:
  - csharp
products:
  - dynamics-365
  - dynamics-commerce
name: Extend Commerce POS, HWS and Headless Commerce APIs and Commerce runtime.
description: This repo contains the sample code on how to extend the Dynamics 365 Commerce POS, Hardware station, Headless Commerce APIs, and Commerce runtime.
---

# Dynamics365Commerce.InStore repo

This repo contains the sample code for how to customize the POS, Hardware Station(HWS) and Commerce runtime (CRT), Headless Commerce APIs and channel database. Please note that these are only samples and it is not required to clone this repo to develop Dynamics 365 Commerce extensions. This topic applies to Dynamics 365 commerce application version 10.0.18 or greater.

This file explains the structure of the InStore samples repo and explains how to set up a repo to reference the Commerce SDK nuget packages from the public feed for Dynamics 365 Commerce extension development. Please visit our [docs site](aka.ms/Dynamics365CommerceDevDocs) for additional resources about Dynamics 365 Commerce development.

## Prerequisites

This process doesn't require a specific pre-configured environment or virtual machine. Development and testing can be done on any machine with relatively modern version of Windows. If you don't require Modern POS development you can leverage Windows 10, Windows Server 2016/2019. If you require Sealed Modern POS development, install these prerequisites. For more details on the development environment prerequisites please refer to [this article](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/pos-extension/pos-extension-getting-started#prerequisites)

## Repo folder and solution structure

The sample InStore repo contains nuget.config, repo.props, CustomizationPackage.props and build pipelines script which provide guidance on how extension can setup the repo metadata files.

| Folder                | Description                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| HardwareStationSample | This project contains samples on how to create Hardware station, Payment extensions and extension installers.            |
| [StoreCommerceSamples](./src/StoreCommerceSamples/readme.md)  | This folder contains samples demonstrating how to extend the Store Commerce App to achieve various customization scenarios.                   |
| PackagingSamples      | This folder contains samples that demonstrate how to structure your Commerce SDK solution to create packages/installers for the appropriate Commerce components.                                                       |
| Pipeline              | YAML and PowerShell script files | This folder/project contains sample scripts and YAML files to setup the build automation in Azure DevOps build pipeline. |

The [Dynamics365Commerce.ScaleUnit](https://github.com/microsoft/Dynamics365Commerce.ScaleUnit) repo contains additional samples focused on Headless Commerce extension development scenarios like Headless Commerce APIs and Commerce Runtime.

## What to expect with each sample

Each sample in this repo is accompanied by a readme.md file with the following information:

- A description of its functionality
- The steps to build and run the sample
- The list of Commerce APIs and extension points used in the sample and a description of what they do.
- A link to relevant documentation of the Commerce APIs and feature area
- A gif or a screenshot of the functionality, if applicable

## Troubleshooting Build & Other Development Issues

The Commerce team has build automation that validates that all the samples in this repo build successfully, but that doesn't guarantee that these samples will always build and run without issues that are common during software development. If you encounter an issue with the InStore samples or the Commerce SDK in please search the issues section of this Github repo to see if it is a known issue. There may already be a fix or workaround available.

If you don't see your issue listed in the issues section please create a new issue to with details about the issue you're facing. This will help ensure that everyone using the Commerce SDK and these samples has the best experience possible, and that all known issues will be searchable online. We will monitor these issues and help as soon as we possibly can.

Note: For the best experience, please limit the use of the issues section to report problems with the Commerce SDK and the InStore samples.

## Branches

The branches in the repo are organized by Dynamics 365 Commerce application release, each branch in the repo points to an application release of Dynamics 365 Commerce, use the right release branch based on your go-live version.

| Release branch name                                                                        | version | Application release version |
| ------------------------------------------------------------------------------------------ | ------- | --------------------------- |
| [Release/9.37](https://github.com/microsoft/Dynamics365Commerce.InStore/tree/release/9.37) | 9.37.\* | 10.0.27                     |
| [Release/9.38](https://github.com/microsoft/Dynamics365Commerce.InStore/tree/release/9.38) | 9.38.\* | 10.0.28                     |
| [Release/9.39](https://github.com/microsoft/Dynamics365Commerce.InStore/tree/release/9.39) | 9.39.\* | 10.0.29                     |
| [Release/9.40](https://github.com/microsoft/Dynamics365Commerce.InStore/tree/release/9.40) | 9.40.\* | 10.0.30                     |
| [Release/9.41](https://github.com/microsoft/Dynamics365Commerce.InStore/tree/release/9.41) | 9.41.\* | 10.0.31                     |

## Referencing Commerce SDK Nuget packages

Commerce contracts, messages, entities, and request packages are published in this public feed for commerce extension code to consume and customize existing functionalities or build new functionalities for Dynamics 365 Commerce product.

Consume the commerce packages from this [location](https://pkgs.dev.azure.com/commerce-partner/Registry/_packaging/dynamics365-commerce/nuget/v3/index.json), extension can add package source location in the nuget.config of their extension project file.

```xml
<packageSources>
    <add key="dynamics365-commerce" value="https://pkgs.dev.azure.com/commerce-partner/Registry/_packaging/dynamics365-commerce/nuget/v3/index.json" />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
</packageSources>
```

## Commerce packages available in the public feed

| Package name                                                          | Description                                                                                                                                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Microsoft.Dynamics.Commerce.Sdk.ChannelDatabase                       | This package is required to generate the DB packages with CSU.                                                                                                |
| Microsoft.Dynamics.Commerce.Sdk.Runtime                               | This package contains all commerce runtime libraries                                                                                                          |
| Microsoft.Dynamics.Commerce.Sdk.ScaleUnit                             | This package is required to generate the CSU package for deployment.                                                                                          |
| Microsoft.Dynamics.Commerce.Sdk.Installers.ScaleUnit                  | This package is required to generate the ScaleUnit package for deployment                                                                                     |
| Microsoft.Dynamics.Commerce.Sdk.HardwareAndPeripherals                | This package contains all commerce Hardware station and peripherals libraries                                                                                 |
| Microsoft.Dynamics.Commerce.Sdk.Installers                            | This package contains all the installers libraries                                                                                                            |
| Microsoft.Dynamics.Commerce.Sdk.Installers.HardwareStation            | This package is required to generate the Hardware station package for deployment                                                                              |
| Microsoft.Dynamics.Commerce.Sdk.Installers.StoreCommerce              | This package is required to generate the Store Commerce extensions installer.                                                                                 |
| Microsoft.Dynamics.Commerce.Sdk.Pos                                   | This package contains all POS libraries                                                                                                                       |
| Microsoft.Dynamics.Commerce.Sdk.Installers.ModernPos                  | This package is required to generate the POS extension installer for deployment                                                                               |
| Microsoft.Dynamics.Commerce.Diagnostics                               | This package contains all the diagnostic libraries                                                                                                            |
| Microsoft.Dynamics.Commerce.Runtime.Data                              | This package contains all data contract libraries                                                                                                             |
| Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages             | This package contains all data services message libraries                                                                                                     |
| Microsoft.Dynamics.Commerce.Runtime.Entities                          | This package contains all commerce entities definition                                                                                                        |
| Microsoft.Dynamics.Commerce.Runtime.Framework                         | This package contains all commerce framework libraries                                                                                                        |
| Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts                 | This package contains all commerce controller libraries                                                                                                       |
| Microsoft.Dynamics.Commerce.Runtime.Messages                          | This package contains all commerce runtime messages libraries                                                                                                 |
| Microsoft.Dynamics.Commerce.Runtime.RealtimeServices.Messages         | This package contains all the commerce real runtime libraries                                                                                                 |
| Microsoft.Dynamics.Commerce.Runtime.Services.Messages                 | This package contains all the commerce service messages libraries                                                                                             |
| Microsoft.Dynamics.Commerce.HardwareStation.Core                      | This package contains all the HWS libraries                                                                                                                   |
| Microsoft.Dynamics.Commerce.HardwareStation.PeripheralRequests        | This package contains all the HWS peripherals request libraries                                                                                               |
| Microsoft.Dynamics.Commerce.HardwareStation.Peripherals.Contracts     | This package contains all the HWS peripherals contracts libraries                                                                                             |
| Microsoft.Dynamics.Commerce.HardwareStation.Peripherals.Entities      | This package contains all the HWS peripherals entities libraries                                                                                              |
| Microsoft.Dynamics.Commerce.Installers.Framework                      | This package contains all the installers framework libraries                                                                                                  |
| Microsoft.Dynamics.Commerce.KeyVault.Contracts                        | This package contains all the key vault contract libraries                                                                                                    |
| Microsoft.Dynamics.Commerce.PaymentSDK.Extensions.Portable            | This package contains all the payment extension libraries                                                                                                     |
| Microsoft.Dynamics.Commerce.PaymentSDK.Portable                       | This package contains all the payment libraries                                                                                                               |
| Microsoft.Dynamics.Commerce.Runtime.FIF.Connector.Messages            | This package contains all the FIF connector libraries                                                                                                         |
| Microsoft.Dynamics.Commerce.Runtime.FIF.DocumentProvider.Messages     | This package contains all the FIF document provider libraries                                                                                                 |
| Microsoft.Dynamics.Commerce.Installers.Framework.DatabaseExtensions   | This package contains all the database installer framework libraries                                                                                          |
| Microsoft.Dynamics.Commerce.Tools.DbUtilities                         | This package contains all the DB utilities libraries                                                                                                          |
| Microsoft.Dynamics.Commerce.Tools.ExtensionsProxyGenerator.AspNetCore | This package contains all the extensions proxy generator utilities                                                                                            |
| Microsoft.Dynamics.Commerce.Proxy.ScaleUnit                           | This package contains all the proxies class for extension applications to consume the Headless Commerce APIs in online mode (connected to Headless Commerce). |

## Package versioning

| Package version  | Application release      |
| ---------------- | ------------------------ |
| 9.37.x.x-preview | 10.0.27 PEAP release     |
| 9.37.x.x         | 10.0.27 Customer preview |
| 9.37.x.x         | 10.0.27 GA               |
| 9.38.x.x-preview | 10.0.28 PEAP release     |
| 9.38.x.x         | 10.0.28 Customer preview |
| 9.38.x.x         | 10.0.28 GA               |
| 9.39.x.x-preview | 10.0.29 PEAP release     |
| 9.39.x.x         | 10.0.29 Customer preview |
| 9.39.x.x         | 10.0.29 GA               |
| 9.40.x.x-preview | 10.0.30 PEAP release     |
| 9.40.x.x         | 10.0.30 Customer preview |
| 9.40.x.x         | 10.0.30 GA               |
| 9.41.x.x-preview | 10.0.31 PEAP release     |
| 9.41.x.x         | 10.0.31 Customer preview |
| 9.41.x.x         | 10.0.31 GA               |

Extension project can consume the correct version by adding the package reference to the project with full version number or use wild card to always get the latest version, recommend option is to use the full version number and update the version based on your go-live version.

```xml
<PackageReference Include="Microsoft.Dynamics.Commerce.Sdk.Pos " Version="9.39.x.x" />
```

Or

```xml
<PackageReference Include="Microsoft.Dynamics.Commerce.Sdk.Pos " Version="9.39.*" />
```

With every hotfix and new application release, new version of the package will be published in the same public feed, consume the right package version based on the version required for your go live. Consuming the higher version of the package than your go-live application version may result in runtime and deployment failures.

**Setup Azure DevOps pipeline for build automation and package generation:**

[Set up a build pipeline for the Commerce SDK](https://docs.microsoft.com/en-us/dynamics365/commerce/dev-itpro/build-pipeline)

**Best practice and branching strategies:**

Detailed information on git branching strategy refer [Git branching strategy](https://docs.microsoft.com/en-us/azure/devops/repos/git/git-branching-guidance?view=azure-devops) doc.

The following branching strategies are based on the way we use Git here at Microsoft. For more information, see [How we use Git at Microsoft](https://docs.microsoft.com/en-us/azure/devops/learn/devops-at-microsoft/use-git-microsoft).

Keep your branch strategy simple. Build your strategy from these three concepts:

- Use feature branches for all new features and bug fixes.
- Merge feature branches into the main branch using pull requests.
- Keep a high quality, up-to-date main branch.

**Create a new feature branch for development and bug fixes:**

Create a new feature main branch for our extension, follow the proper naming convention (refer the [Git branching doc for sample naming convention](https://docs.microsoft.com/en-us/azure/devops/repos/git/git-branching-guidance?view=azure-devops#name-your-feature-branches-by-convention))

**Create a new development branch:**

Create a private branch for the development:

- git checkout -b private/{username}/{feature/description}

Add and commit new changes to the development branch using git -add . and git commit -m&quot; commit message.&quot;

After the development is completed, tested, and validated push the changes to the main branch by doing git push \&lt;remote\&gt; \&lt;branch\&gt;

- git push origin {private branch name}

**Create a release branch after development:**

After the development changes pushed into the main branch, create a new release branch, and create the deployable packages from the release branch.

- Git checkout -b release/x.x.x

Merge the changes from the release branch back to main branch if any changes done in the release branch.

```text

- git checkout master git merge release/x.x.x

```

**Extension hotfix branch:**

Like release branch, create hotfix branch for extension from main branch and release the fix and later merge the changes back to the main branch.

**Merge new release branch to main and development branch:**

After a new version of the samples released, if required merge your development branch with the new branch. The repo contains only samples, so it&#39;s not required to always get the updated changes from the branch.

```text

- git checkout master git merge release/x.x.x

```
