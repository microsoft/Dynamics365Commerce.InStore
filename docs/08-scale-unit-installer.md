---
title: Create a Scale Unit installer
description: Build a Scale Unit installer that deploys Dynamics 365 Commerce extensions, such as Scale Unit extensions or a Commerce Runtime extension that enables an extension package, to a Commerce Scale Unit.
author: pesilval_microsoft
ms.author: pesilval
ms.reviewer: pesilval
ms.topic: how-to
ms.date: 07/25/2026
ms.service: dynamics-365-commerce
---

# Create a Scale Unit installer

This article describes how to build a **Scale Unit installer**. The installer isn't the extension
itself. It's a deployment tool that packages extension assemblies and deploys them to a Commerce
Scale Unit (CSU). Use it, for example, to install Scale Unit extensions, or to deploy the Commerce
Runtime extension that enables the extension package that you create in this guide.

You author the extension logic separately, as a [Commerce Runtime extension](./04-crt-extension.md).
Additional headless-focused samples are in the
[Dynamics365Commerce.ScaleUnit](https://github.com/microsoft/Dynamics365Commerce.ScaleUnit)
repository.

The sample is at `src/StoreCommerceSamples/PosExtensionSamples/ScaleUnit.Installer/`.

## Prerequisites

- Complete the steps in [Clone and versioning](./02-clone-and-versioning.md).
- Author the extension that you want to deploy, such as a
  [Commerce Runtime extension](./04-crt-extension.md).

## Requirements

| Requirement | Value |
| ----------- | ----- |
| Installer target framework | `net472` (requires .NET Framework 4.7.2 or newer) |
| Required NuGet package | `Microsoft.Dynamics.Commerce.Sdk.Installers.ScaleUnit` |
| Related packages | `Microsoft.Dynamics.Commerce.Sdk.ScaleUnit` (generate the CSU package), `Microsoft.Dynamics.Commerce.Proxy.ScaleUnit` (consume Headless Commerce APIs online) |

> [!NOTE]
> The extensions that the installer deploys are separate projects. For example, a Commerce Runtime
> extension is a `netstandard2.0` project. For more information, see
> [Commerce Runtime extension](./04-crt-extension.md).

## Project file

The installer project produces the deployable CSU package and references the extension projects
that it packages. Because the installer only packages the extensions, the references set
`ReferenceOutputAssembly` to `False`.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <Import Project="..\CustomizationPackage.props" />

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net472</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Dynamics.Commerce.Sdk.Installers.ScaleUnit" Version="$(CommerceSdkPackagesVersion)" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="../MyCommerceRuntimeExtension/My.CommerceRuntimeExtensions.csproj">
      <ReferenceOutputAssembly>False</ReferenceOutputAssembly>
    </ProjectReference>
    <ProjectReference Include="../MyPosExtension/My.PosExtensions.csproj">
      <ReferenceOutputAssembly>False</ReferenceOutputAssembly>
    </ProjectReference>
  </ItemGroup>
</Project>
```

> [!NOTE]
> The version comes from the `CommerceSdkPackagesVersion` property in `repo.props`, so all
> packages stay centralized on one version. For more information, see
> [Clone and versioning](./02-clone-and-versioning.md).

## Build the installer

1. Author the extension that you want to deploy, such as a
   [Commerce Runtime extension](./04-crt-extension.md) that includes any Headless Commerce APIs.
2. Create a `net472` installer project, and then add the
   `Microsoft.Dynamics.Commerce.Sdk.Installers.ScaleUnit` package.
3. Reference the extension projects to package, and set `ReferenceOutputAssembly` to `False`.
4. Build the installer to generate the CSU deployment package.
5. Run the installer to deploy the package to your Commerce Scale Unit, and then validate the
   extension in online mode.

## Additional resources

- [Dynamics365Commerce.ScaleUnit samples repo](https://github.com/microsoft/Dynamics365Commerce.ScaleUnit)
- [Commerce Runtime extensibility](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/commerce-runtime-extensibility)
- [Headless Commerce APIs (IController extension)](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/retail-server-icontroller-extension)

## Next steps

- [Troubleshooting](./09-troubleshooting.md)
