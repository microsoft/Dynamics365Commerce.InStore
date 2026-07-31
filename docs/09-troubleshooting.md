---
title: Troubleshoot Commerce SDK extension development
description: Resolve common errors and avoid common mistakes when you build Dynamics 365 Commerce SDK extensions and custom Store Commerce mobile apps, including package and versioning issues.
author: pesilval_microsoft
ms.author: pesilval
ms.reviewer: pesilval
ms.topic: troubleshooting
ms.date: 07/15/2026
ms.service: dynamics-365-commerce
---

# Troubleshoot Commerce SDK extension development

This article lists common errors and common mistakes when you build Commerce SDK extensions and
custom Store Commerce mobile apps, and it explains where to get more help.

## Common errors

| Symptom | Likely cause | Resolution |
| ------- | ------------ | --- |
| `NU1101` / package not found for `Microsoft.Dynamics.Commerce.Sdk.*` | The public Commerce feed isn't configured. | Add the `dynamics365-commerce` source to `nuget.config`. See [Clone and versioning](./02-clone-and-versioning.md). |
| Mobile SDK packages fail to restore | The LCS `packages` folder source is missing. | Download the Store Commerce for Android package from LCS, copy `packages/` to the repository root, and add it as a NuGet source. See [Build a custom Store Commerce mobile app](./03-mobile-app.md). |
| MAUI workload or target framework `net10.0-android` not found | The .NET MAUI workloads aren't installed for your .NET 10 SDK. | Run `dotnet workload install maui`. See [Prerequisites](./01-prerequisites.md). |
| iOS build fails on Windows | iOS and Mac builds require macOS. | Pair to a Mac. See [Pair to Mac](https://learn.microsoft.com/dotnet/maui/ios/pair-to-mac?view=net-maui-10.0). |
| iOS and Mac builds fail to sign, or SDK errors occur | Xcode is missing or is the wrong version, or there's no provisioning profile. | Install a supported version of Xcode, and then configure signing. See [Prerequisites](./01-prerequisites.md). |
| Runtime or deployment failures at your go-live version | The packages are newer than your FinOps version. | Pin the package versions to your go-live branch. See [Clone and versioning](./02-clone-and-versioning.md). |
| Embedded extensions are missing or aren't packaged in the mobile app | The referenced extension projects import different `CustomizationPackage.props` files. | The mobile app supports a single extension package, so make every referenced extension project import the same `CustomizationPackage.props` file. See [Embed your extensions](./03-mobile-app.md#embed-your-extensions). |
| The mobile app build or extension packaging fails after a version change | The `ReferenceOutputAssembly` attribute is wrong for your version on the extension references. | For versions before 9.59, the `ProjectReference` entries must not contain the `ReferenceOutputAssembly` attribute at all. Don't set it to `True` or `False` — remove it. Starting with 9.59, set `ReferenceOutputAssembly="False"`. See [Embed your extensions](./03-mobile-app.md#embed-your-extensions). |
| The app builds and installs, but the extensions don't appear or run | The extension package isn't enabled on the Commerce Scale Unit (CSU). | Deploy and enable the extension package on the CSU. See [Enable the extension package on the Commerce Scale Unit](#enable-the-extension-package-on-the-commerce-scale-unit). |

## Enable the extension package on the Commerce Scale Unit

Embedding your extensions in the app isn't enough on its own. The app loads POS extensions from
the extension package that the Commerce Scale Unit (CSU) serves, so the package must also be
deployed and enabled on the CSU. If it isn't, the app starts normally, but your customizations
don't appear.

To enable the extensions, follow these steps:

1. Deploy the extension package to the CSU. Use a
   [Scale Unit installer](./08-scale-unit-installer.md) to package and install the extension.
2. Confirm that the extension package is enabled for the CSU environment that the app connects to.
3. Restart the app, and then validate that your extensions load.

> [!NOTE]
> Use the same package name and version on the CSU as the package that's embedded in the app. A
> mismatch can cause the extensions to be ignored.

## Consume hotfixes

When a hotfix is released for your version, the LCS mobile dependency packages are refreshed. To
pick them up, follow these steps:

1. Delete the previously downloaded `packages` folder from your repository root.
2. Download the latest **Store Commerce for Android** package for your version from the
   [LCS Shared Asset Library](https://lcs.dynamics.com/V2/SharedAssetLibrary).
3. Unzip the package, and then copy the new `packages` folder back to your repository root. The
   `Dynamics365Commerce-Mobile-Dependencies` NuGet source stays the same.
4. If stale packages are still resolved, clear the NuGet cache by running
   `dotnet nuget locals all --clear`.
5. Restore and rebuild.

For more information, see [Download the LCS mobile dependencies](./02-clone-and-versioning.md#download-the-lcs-mobile-dependencies).

## Common mistakes

- **Using the wrong branch for your version.** Use the `release/9.{XX+10}` mapping for FinOps
  `10.0.XX`.
- **Floating to the latest packages.** Use a version that's pinned to your go-live release.
- **Using the wrong target framework.** Commerce Runtime, Hardware Station, POS, and Channel
  Database extensions are `netstandard2.0`. Only the mobile app uses
  `net10.0-android;net10.0-ios;net10.0-maccatalyst`.
- **Building all mobile targets when you ship only some.** Comment out the target frameworks that
  you don't need to speed up builds and avoid platform-specific setup.
- **Forgetting to reference the extension projects** from the mobile app, so the extensions
  aren't embedded.
- **Mixing `CustomizationPackage.props` files across embedded extensions.** The mobile app
  supports a single extension package, so all extension projects that it references must import
  the same `CustomizationPackage.props` file.
- **Adding `ReferenceOutputAssembly` before 9.59.** For versions before 9.59, the extension
  `ProjectReference` entries must not contain the attribute at all. Setting it to either `True` or
  `False` is incorrect. Starting with 9.59, set it to `False`.
- **Not enabling the extension package on the Commerce Scale Unit.** Embedding extensions in the
  app isn't enough. The extension package must also be deployed and enabled on the CSU that the
  app connects to.
- **Omitting a Commerce Runtime reference when the POS extension needs server-side handlers.** Add
  a Commerce Runtime extension project reference when your POS logic calls custom handlers.

## Package reference hygiene

Version conflicts between your packages and the transitive dependencies of the Commerce SDK
packages are a common source of build and runtime failures. To avoid them, follow these
guidelines:

- **Never reference non-SDK `Microsoft.Dynamics.*` packages.** Only the
  `Microsoft.Dynamics.Commerce.Sdk.*` packages are intended for extension projects. Any other
  `Microsoft.Dynamics.*` package should not be referenced by any project. The SDK packages
  already bring in the correct Commerce assemblies, and referencing the underlying packages
  directly leads to version conflicts.
- **Avoid referencing `System.*` packages.** Partners and ISVs should avoid referencing `System.*`
  packages as much as possible. This isn't a hard requirement, but these packages can conflict
  with the versions that the SDK packages depend on and cause failures that are hard to diagnose.
  Rely on the versions that the SDK and target framework provide instead of adding your own.

## Additional resources

- [Store Commerce app](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/store-commerce)
- [POS extension overview](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/pos-extension/pos-extension-overview)
- [Commerce Runtime extensibility](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/commerce-runtime-extensibility)
- [Install .NET MAUI](https://learn.microsoft.com/dotnet/maui/get-started/installation?view=net-maui-10.0)
- [Dynamics365Commerce.InStore samples repo issues](https://github.com/microsoft/Dynamics365Commerce.InStore/issues). Search the existing issues before you file a new one.
