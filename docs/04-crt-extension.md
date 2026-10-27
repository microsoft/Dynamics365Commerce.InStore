---
title: Create a Commerce Runtime extension
description: Create a Dynamics 365 Commerce Runtime (CRT) extension that adds or overrides commerce business logic and runs in offline mode when it's embedded in a Store Commerce app.
author: pesilval_microsoft
ms.author: pesilval
ms.reviewer: pesilval
ms.topic: how-to
ms.date: 07/15/2026
ms.service: dynamics-365-commerce
---

# Create a Commerce Runtime extension

This article describes how to create a Commerce Runtime extension. The Commerce Runtime is the
business-logic engine that POS, Store Commerce, and Headless Commerce share. Commerce Runtime
extensions add or override commerce logic, such as requests, services, triggers, and controllers,
and they run in offline mode when they're embedded in a Store Commerce app.

The sample is at `src/StoreCommerceSamples/PosExtensionSamples/CommerceRuntime/`.

## Prerequisites

- Complete the steps in [Clone and versioning](./02-clone-and-versioning.md).

## Requirements

| Requirement | Value |
| ----------- | ----- |
| Target framework | `netstandard2.0` |
| Required NuGet package | `Microsoft.Dynamics.Commerce.Sdk.Runtime` |

## Project file

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <Import Project="..\CustomizationPackage.props" />

  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Dynamics.Commerce.Sdk.Runtime" Version="$(CommerceSdkPackagesVersion)" />
  </ItemGroup>
</Project>
```

> [!NOTE]
> The version comes from the `CommerceSdkPackagesVersion` property in `repo.props`, so all
> packages stay centralized on one version. For more information, see
> [Clone and versioning](./02-clone-and-versioning.md).

## Develop the extension

1. Create a `netstandard2.0` class library, and then add the
   `Microsoft.Dynamics.Commerce.Sdk.Runtime` package.
2. Implement your extension point, such as a request handler, a service, or a trigger, and then
   register it so that the runtime discovers it.
3. Reference the Commerce Runtime project from your Store Commerce mobile app (or extension
   installer) so that it ships with the app. For more information, see
   [Build a custom Store Commerce mobile app](./03-mobile-app.md).
4. Build and run the extension in offline mode to validate the logic.

## Additional resources

- [Commerce Runtime extensibility](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/commerce-runtime-extensibility)
- [Headless Commerce APIs (IController extension)](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/retail-server-icontroller-extension)

## Next steps

- [Hardware Station extension](./05-hws-extension.md)
