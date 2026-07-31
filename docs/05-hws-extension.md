---
title: Create a Hardware Station extension
description: Create a Dynamics 365 Commerce Hardware Station extension that adds support for hardware peripherals or new hardware APIs to POS and Store Commerce.
author: pesilval_microsoft
ms.author: pesilval
ms.reviewer: pesilval
ms.topic: how-to
ms.date: 07/15/2026
ms.service: dynamics-365-commerce
---

# Create a Hardware Station extension

This article describes how to create a Hardware Station extension. The Hardware Station connects
POS and Store Commerce to hardware peripherals, such as printers, cash drawers, scanners,
magnetic stripe readers (MSRs), signature capture devices, and payment terminals. Hardware
Station extensions add support for new peripherals or new hardware APIs. In a Store Commerce
mobile app, they run as the app's dedicated hardware station.

The sample is at `src/MyCustomMobileApp/MyHardwareStationExtension/`
(`My.HardwareStationExtensions.csproj`). It implements a custom `FilePrinter/Print` API.

## Prerequisites

- Complete the steps in [Clone and versioning](./02-clone-and-versioning.md).

## Requirements

| Requirement | Value |
| ----------- | ----- |
| Target framework | `netstandard2.0` |
| Required NuGet package | `Microsoft.Dynamics.Commerce.Sdk.HardwareAndPeripherals` |

## Project file

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <Import Project="..\CustomizationPackage.props" />

  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Dynamics.Commerce.Sdk.HardwareAndPeripherals" Version="$(CommerceSdkPackagesVersion)" />
  </ItemGroup>
</Project>
```

> [!NOTE]
> The version comes from the `CommerceSdkPackagesVersion` property in `repo.props`, so all
> packages stay centralized on one version. For more information, see
> [Clone and versioning](./02-clone-and-versioning.md).

## Develop the extension

1. Create a `netstandard2.0` class library, and then add the
   `Microsoft.Dynamics.Commerce.Sdk.HardwareAndPeripherals` package.
2. Implement your peripheral or hardware API, such as a payment device or a custom
   `FilePrinter/Print` API.
3. Reference the Hardware Station project from your Store Commerce mobile app so that it ships as
   the dedicated hardware station. For more information, see
   [Build a custom Store Commerce mobile app](./03-mobile-app.md).
4. Build and validate the peripheral scenario end to end.

## Additional resources

- [Integrate the POS with a new hardware device](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/hardware-device-extension)
- [End-to-end payment integration for a payment terminal](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/end-to-end-payment-extension)

## Next steps

- [POS extension](./06-pos-extension.md)
