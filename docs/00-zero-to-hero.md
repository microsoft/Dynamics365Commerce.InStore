---
title: "Zero to Hero: Build a custom Store Commerce app with extensions"
description: In this end-to-end tutorial, build a custom Store Commerce mobile app for iOS, Android, and Mac, and embed your Commerce Runtime, Hardware Station, and POS extensions.
author: pesilval_microsoft
ms.author: pesilval
ms.reviewer: pesilval
ms.topic: tutorial
ms.date: 07/15/2026
ms.service: dynamics-365-commerce
---

# Zero to Hero: Build a custom Store Commerce app with extensions

This tutorial takes you from nothing to a running, custom Store Commerce mobile app that has your
own extensions embedded. Each step links to the article that has full detail.

In this tutorial, you:

> [!div class="checklist"]
>
> - Install the prerequisites.
> - Clone the release branch that matches your version.
> - Add the mobile dependencies.
> - Build your extensions.
> - Embed the extensions in the mobile app.
> - Build and run the app.

The examples target **FinOps 10.0.50** and branch **`release/9.60`**. Substitute your own version
by using the [branch mapping](./02-clone-and-versioning.md).

## Prerequisites

- A development machine that meets the requirements in [Prerequisites](./01-prerequisites.md).

## Step 1: Install prerequisites

Install the .NET 10 SDK, .NET Framework 4.7.2 or newer (required by the extension installers on
Windows), the .NET MAUI workloads, Visual Studio Code with the .NET MAUI extension, and the
platform tools for the mobile targets that you ship (Android, or Xcode and macOS for iOS
and Mac).

```bash
dotnet workload install maui
dotnet --version        # 10.x
```

For more information, see [Prerequisites](./01-prerequisites.md).

## Step 2: Clone the version branch

```bash
git clone https://github.com/microsoft/Dynamics365Commerce.InStore.git --branch release/9.60 --single-branch
cd Dynamics365Commerce.InStore
```

For more information, see [Clone and versioning](./02-clone-and-versioning.md).

## Step 3: Add the mobile dependencies

Download the **Store Commerce for Android** package for your targeted version from the
[LCS Shared Asset Library](https://lcs.dynamics.com/V2/SharedAssetLibrary). The package also
contains the iOS and macOS dependencies. Copy its `packages` folder to the repository root, and
then register it in `nuget.config`.

```xml
<add key="Dynamics365Commerce-Mobile-Dependencies" value="./packages" />
```

For more information, see [Download the LCS mobile dependencies](./02-clone-and-versioning.md#download-the-lcs-mobile-dependencies).

## Step 4: Build your extensions

Author the extensions that you need. Each extension is a `netstandard2.0` project that references
its SDK package:

- [Commerce Runtime extension](./04-crt-extension.md) — `Microsoft.Dynamics.Commerce.Sdk.Runtime`
- [Hardware Station extension](./05-hws-extension.md) — `Microsoft.Dynamics.Commerce.Sdk.HardwareAndPeripherals`
- [POS extension](./06-pos-extension.md) — `Microsoft.Dynamics.Commerce.Sdk.Pos` (plus TypeScript and Knockout)

The sample embeds a POS extension and a Hardware Station extension.

Package versions come from the `CommerceSdkPackagesVersion` property in `repo.props`, so you don't
set them per project.

## Step 5: Embed the extensions in the mobile app

Open `src/MyCustomMobileApp/`. In the mobile app project, add a `ProjectReference` for each of
your extension projects, and then brand the app.

```xml
<ApplicationTitle>My Store Commerce</ApplicationTitle>
<ApplicationId>my.storecommerce.mobileapp</ApplicationId>
```

For more information, see [Embed your extensions](./03-mobile-app.md#embed-your-extensions).

## Step 6: Build and run the app

Build the `My.CustomMobileApp.slnx` solution. Keep only the target
frameworks that you ship (`net10.0-android`, `net10.0-ios`, and `net10.0-maccatalyst`), and then
run the app:

- **Android**: Produces an `.apk` file. Debug it on an emulator or device.
- **iOS**: Produces an `.ipa` file. Build it on macOS or through
  [pair to Mac](https://learn.microsoft.com/dotnet/maui/ios/pair-to-mac?view=net-maui-10.0).
- **Mac**: Produces an `.app` bundle. Build the `net10.0-maccatalyst` target on macOS.

For more information, see [Build and run](./03-mobile-app.md#build-and-run).

You now have a custom Store Commerce app for iOS, Android, and Mac that has your extensions
embedded.

## Next steps

- [Build a custom Store Commerce mobile app](./03-mobile-app.md)
- [Troubleshooting](./09-troubleshooting.md)
