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
  <ProjectReference Include="../MySecondPosExtension/My.SecondPosExtensions.csproj" ReferenceOutputAssembly="False" />
  <!-- Add other extension types as needed. -->
  <ProjectReference Include="../MyCommerceRuntimeExtension/My.CommerceRuntimeExtensions.csproj" ReferenceOutputAssembly="False" />
  <ProjectReference Include="../MyChannelDatabaseExtension/My.ChannelDatabaseExtensions.csproj" ReferenceOutputAssembly="False" />
</ItemGroup>
```

The sample embeds a POS extension and a Hardware Station extension in one extension package, and a
second POS extension in another extension package. To embed your own Commerce Runtime, Hardware
Station, POS, and Channel Database extensions, add or remove `ProjectReference` entries. For more
information, see the following articles:

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
> Before 9.60, the mobile app supports a single extension package. Every extension project that the
> mobile app references must import the same `CustomizationPackage.props` file so that the
> projects build into one extension package. Extensions that import a different
> `CustomizationPackage.props` file aren't packaged correctly. Starting with 9.60, the mobile app
> can embed more than one extension package. For more information, see
> [Use more than one extension package](#use-more-than-one-extension-package).

## Use more than one extension package

Starting with 9.60, the mobile app can embed more than one extension package. The build adds the
extensions of each referenced project to the extension package that the `PackageName` property of
the project names. If a project doesn't set `PackageName`, its extensions go in the extension
package of the mobile app project.

The sample has two extension packages:

| Extension package | Props file | Projects |
| ----------------- | ---------- | -------- |
| `Contoso.MyMobileAppExtensions` | `CustomizationPackage.props` | `MyApp` (the mobile app), `MyPosExtension`, and `MyHardwareStationExtension` |
| `Contoso.MyMobileAppSecondExtensions` | `SecondCustomizationPackage.props` | `MySecondPosExtension` |

To add an extension package, follow these steps:

1. Copy `CustomizationPackage.props` to a new file, such as `SecondCustomizationPackage.props`. In
   the new file, set a different `PackageName`, `PackageDisplayName`, and `PackageDescription`.

   ```xml
   <PackageName Condition="'$(PackageName)' == ''">Contoso.MyMobileAppSecondExtensions</PackageName>
   ```

2. In each extension project of the new package, import the new props file.

   ```xml
   <Import Project="..\SecondCustomizationPackage.props" />
   ```

3. In the mobile app project, add a `ProjectReference` to each extension project of the new
   package.
4. Build the app. When the app has more than one extension package, the build output lists the
   packages:

   ```output
   Store Commerce extension packages: Contoso.MyMobileAppExtensions, Contoso.MyMobileAppSecondExtensions. The extension package definitions must include each package. To add all the extensions in the 'Contoso.MyMobileAppExtensions' extension package, set the 'EnableMultipleExtensionPackages' property to 'false'.
   ```

5. Deploy and enable each extension package on the Commerce Scale Unit. The app loads only the
   packages that are enabled. For more information, see
   [Enable the extension package on the Commerce Scale Unit](./09-troubleshooting.md#enable-the-extension-package-on-the-commerce-scale-unit).

You can also set the `PackageName` property directly in an extension project file instead of
importing a props file. We recommend a props file for each extension package, so that all the
projects of a package share the same package properties.

The app keeps the files of each extension package in a separate folder:

| Extensions | Folder in the app |
| ---------- | ----------------- |
| Commerce Runtime and Hardware Station | `Extensions/<PackageName>/` (on Mac, `Contents/MonoBundle/Extensions/<PackageName>/`) |
| POS | `wwwroot/Pos/Extensions/<PackageName>/` |

Keep the following points in mind:

- An extension package name must be one folder name. If the `PackageName` of a referenced project
  ends with a period, or contains a control character or one of these characters:
  `/ \ : * ? " < > | ; % $ @ '`, the build fails. The build also fails if two extension package
  names differ only by case.
- The `CommerceRuntimeExtensionSettings` items of the mobile app project go to each extension
  package that has Commerce Runtime extensions. If no package has Commerce Runtime extensions, the
  items go to the extension package of the mobile app project.
- The app has one SQLite channel database. A Channel Database extension isn't in an extension
  package, so the `PackageName` of its project doesn't apply.
- The app tries to load each enabled extension package for both POS and the Commerce Runtime and
  Hardware Station host. If a package has only POS extensions, such as the second package of the
  sample, the host logs that it can't load the package. If a package has only Commerce Runtime or
  Hardware Station extensions, POS Settings shows that POS can't load the package. An app with a
  single extension package that has only one kind of extension behaves the same way.

To add all the extensions to the extension package of the mobile app project, as before 9.60, set
the `EnableMultipleExtensionPackages` property to `false` in the mobile app project.

```xml
<EnableMultipleExtensionPackages>false</EnableMultipleExtensionPackages>
```

With this setting, the build adds the files of all the projects to one folder, so the projects can't
have files with the same path. For example, two POS extension projects both have a `manifest.json`
file. The build doesn't report an error, but the app gets only one of the `manifest.json` files, so
POS doesn't load the extensions of the other project.

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
