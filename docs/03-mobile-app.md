---
title: Build a custom Store Commerce mobile app
description: Build a custom (third-party) Store Commerce app for iOS, Android, and Mac by using .NET MAUI on .NET 10, and embed your Commerce Runtime, Hardware Station, POS, and Channel Database extensions.
author: pesilval_microsoft
ms.author: pesilval
ms.reviewer: pesilval
ms.topic: how-to
ms.date: 07/15/2026
ms.service: dynamics-365-commerce
---

# Build a custom Store Commerce mobile app

This article describes how to build a custom (third-party) Store Commerce app that embeds your
own extensions and runs on iOS, Android, and Mac. The app is a .NET Multi-platform App UI
(.NET MAUI) application on .NET 10 that hosts the Store Commerce SDK and your Commerce Runtime,
Hardware Station, and POS extension projects.

The mobile sample in the repository is at `src/MyCustomMobileApp/`, and it's the starting point
for your app. The `My.CustomMobileApp.slnx` solution contains the mobile app project and its
extension projects.

## Prerequisites

- Complete the steps in [Prerequisites](./01-prerequisites.md), including the .NET 10 SDK and the
  .NET MAUI workloads. For iOS and Mac, you also need macOS and Xcode.
- Complete the steps in [Clone and versioning](./02-clone-and-versioning.md), including the LCS
  mobile dependencies.

## Target frameworks and required packages

The mobile app project (`MyApp/My.StoreCommerce.MobileApp.csproj`) targets three platforms.

```xml
<Project Sdk="Microsoft.NET.Sdk.Razor">
  <Import Project="..\CustomizationPackage.props" />

  <PropertyGroup>
    <TargetFrameworks>net10.0-android;net10.0-ios;net10.0-maccatalyst</TargetFrameworks>
    <UseMaui>true</UseMaui>
    <OutputType>Exe</OutputType>
    <RootNamespace>My.StoreCommerce.MobileApp</RootNamespace>
    <AssemblyName>My.StoreCommerce.MobileApp</AssemblyName>
  </PropertyGroup>
</Project>
```

| Platform | Target framework | Produces |
| -------- | ---------------- | -------- |
| Store Commerce for Android | `net10.0-android` | `.apk` |
| Store Commerce for iOS | `net10.0-ios` | `.ipa` |
| Store Commerce for Mac | `net10.0-maccatalyst` | `.app` |

The app requires the following NuGet packages.

| Package | Purpose |
| ------- | ------- |
| `Microsoft.Dynamics.Commerce.Sdk.StoreCommerce.Mobile` | The Store Commerce mobile SDK, which hosts POS and the runtime. |
| `Microsoft.Maui.Controls` | The .NET MAUI framework. |
| `Microsoft.AspNetCore.Components.WebView.Maui` | The web view that renders the POS content. |

## Embed your extensions

The mobile app references your extension projects so that they're packaged into the app.

```xml
<ItemGroup>
  <ProjectReference Include="../MyPosExtension/My.PosExtensions.csproj" ReferenceOutputAssembly="False" />
  <ProjectReference Include="../MyHardwareStationExtension/My.HardwareStationExtensions.csproj" ReferenceOutputAssembly="False" />
  <!-- Add other extension types as needed. -->
  <ProjectReference Include="../MyCommerceRuntimeExtension/My.CommerceRuntimeExtensions.csproj" ReferenceOutputAssembly="False" />
  <ProjectReference Include="../MyChannelDatabaseExtension/My.ChannelDatabaseExtensions.csproj" ReferenceOutputAssembly="False" />
</ItemGroup>
```

The sample embeds a POS extension and a Hardware Station extension. To embed your own Commerce
Runtime, Hardware Station, POS, and Channel Database extensions, add or remove `ProjectReference`
entries. For more information, see the following articles:

- [Commerce Runtime extension](./04-crt-extension.md)
- [Hardware Station extension](./05-hws-extension.md)
- [POS extension](./06-pos-extension.md)
- [Channel Database extension](./07-channel-database.md)

> [!IMPORTANT]
> The `ReferenceOutputAssembly` attribute depends on your version. For versions before 9.59, don't
> add the attribute at all — the `ProjectReference` entries must omit it. Starting with 9.59, set
> `ReferenceOutputAssembly="False"` on the references. The preceding example targets 9.60, so it
> includes the attribute.

> [!IMPORTANT]
> The mobile app currently supports a single extension package. Every extension project that the
> mobile app references must import the same `CustomizationPackage.props` file so that the
> projects build into one extension package. Extensions that import a different
> `CustomizationPackage.props` file aren't packaged correctly.

## Provide the mobile dependencies

The Store Commerce mobile SDK depends on packages that are distributed through Microsoft Dynamics
Lifecycle Services (LCS). Download them for your targeted version, and then register the
`packages` folder as a NuGet source. For more information, see
[Download the LCS mobile dependencies](./02-clone-and-versioning.md#download-the-lcs-mobile-dependencies).

## Brand your custom app

Set the display name and package identity in the mobile app project.

```xml
<ApplicationTitle>My Store Commerce</ApplicationTitle>
<ApplicationId>my.storecommerce.mobileapp</ApplicationId>
```

- `ApplicationTitle` is the name that appears in the Android launcher or the iOS and Mac home
  screen.
- `ApplicationId` is the unique package identifier.

## Build and run

Open the `My.CustomMobileApp.slnx` solution in `src/MyCustomMobileApp`, and then build it. To
build only the platforms that you ship, comment out the target frameworks that you don't need in
the `<TargetFrameworks>` element.

The solution uses the `.slnx` format, which requires Visual Studio 2026 or the .NET CLI. To build
it from the command line, run the following command.

```bash
dotnet build My.CustomMobileApp.slnx
```

### Android

- When an Android emulator or device is configured, start debugging from Visual Studio Code.
- To skip Android, comment out `net10.0-android` in the project.

### iOS

- On Windows, [pair to a Mac](https://learn.microsoft.com/dotnet/maui/ios/pair-to-mac?view=net-maui-10.0)
  to build and sign the app.
- To skip iOS, comment out `net10.0-ios` in the project.

### Mac

- Build the `net10.0-maccatalyst` target on macOS to produce an `.app` bundle.
- To skip Mac, comment out `net10.0-maccatalyst` in the project.

## Next steps

- [Zero to Hero: Build a custom Store Commerce app with extensions](./00-zero-to-hero.md)
- [Troubleshooting](./09-troubleshooting.md)
