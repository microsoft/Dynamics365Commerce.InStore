---
title: Prerequisites for Commerce SDK extension development
description: Install the .NET 10 SDK, .NET Framework 4.7.2 or newer, .NET MAUI workloads, Visual Studio Code, and the Android, Xcode, and macOS tools required to build Dynamics 365 Commerce SDK extensions and Store Commerce mobile apps.
author: pesilval_microsoft
ms.author: pesilval
ms.reviewer: pesilval
ms.topic: how-to
ms.date: 07/15/2026
ms.service: dynamics-365-commerce
---

# Prerequisites for Commerce SDK extension development

This article describes the tools that you install before you clone the samples repository or
build any extension. The tools are grouped by what you build. Everyone installs the
[common](#common) tools, and then adds the platform-specific tools for the mobile targets that
they plan to ship.

## Common

| Tool | Notes |
| ---- | ----- |
| **.NET 10 SDK** | Required for the mobile app and the .NET MAUI workloads. Install it from [Download .NET 10](https://dotnet.microsoft.com/download/dotnet/10.0). To verify the installation, run `dotnet --version`. |
| **.NET Framework 4.7.2 or newer** | Required by the extension installer projects, which target `net472`. Windows only. |
| **Git** | Required to clone the samples repository. |
| **Visual Studio Code** | The cross-platform editor for the mobile app and extensions. |
| **.NET MAUI extension for Visual Studio Code** | Install the [.NET MAUI extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.dotnet-maui). It installs the C# Dev Kit as a dependency. |

> [!NOTE]
> Windows-only extension packaging (the Channel Database SQLite build and the Hardware Station
> and POS `.exe` installers) is built on Windows in Visual Studio 2026, and requires .NET
> Framework 4.7.2 or newer. The mobile app itself builds on Windows or macOS.

> [!NOTE]
> The samples use the `.slnx` solution format. To open a `.slnx` solution, use Visual Studio 2026.
> To build it from the command line, use the .NET 10 SDK (`dotnet build`).

## .NET MAUI workloads

Install the .NET MAUI workloads that match your .NET 10 SDK. On macOS or Linux, prefix the
command with `sudo`.

```bash
dotnet workload install maui
```

To pin the workload to your exact SDK version, run the following commands.

```powershell
$mauiVersion = dotnet --version
dotnet workload install maui --version $mauiVersion
```

For more information, see [Install .NET MAUI](https://learn.microsoft.com/dotnet/maui/get-started/installation?view=net-maui-10.0).

## Android

The following tools are required to build the `net10.0-android` target (Store Commerce for
Android):

- The Android SDK and an Android emulator or a physical device that has USB debugging enabled.
- A Java Development Kit (JDK) that's compatible with the .NET Android workload.

The .NET MAUI extension and the Android workload install most of these tools for you. For more
information, see [Set up Android for .NET MAUI](https://learn.microsoft.com/dotnet/maui/android/device/setup?view=net-maui-10.0).

## iOS and Mac

The following tools are required to build the `net10.0-ios` (Store Commerce for iOS) and
`net10.0-maccatalyst` (Store Commerce for Mac) targets:

- **A Mac that runs a supported version of macOS.** iOS and Mac Catalyst builds require macOS.
- **Xcode**, from the App Store, that matches the version required by the .NET iOS workload.
  After you install Xcode, open it once, and then run `xcode-select --install` to install the
  command-line tools.
- An Apple Developer account and a provisioning profile for on-device deployment and signing.

> [!IMPORTANT]
> If you develop on Windows, you must pair to a Mac to build and sign iOS apps. For more
> information, see [Pair to Mac for iOS development](https://learn.microsoft.com/dotnet/maui/ios/pair-to-mac?view=net-maui-10.0).

For more information, see [Set up iOS for .NET MAUI](https://learn.microsoft.com/dotnet/maui/ios/device-provisioning/?view=net-maui-10.0).

## Verify your setup

```bash
dotnet --version          # 10.x
dotnet workload list      # should list "maui" (and android / ios / maccatalyst)
```

## Next steps

- [Clone and versioning](./02-clone-and-versioning.md)
