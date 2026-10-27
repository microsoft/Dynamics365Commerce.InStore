---
title: Create a POS extension
description: Create a Dynamics 365 Commerce POS extension in TypeScript, HTML, and CSS that customizes the Store Commerce user experience with new views, dialogs, columns, workflows, and triggers.
author: pesilval_microsoft
ms.author: pesilval
ms.reviewer: pesilval
ms.topic: how-to
ms.date: 07/15/2026
ms.service: dynamics-365-commerce
---

# Create a POS extension

This article describes how to create a POS extension. POS extensions customize the Store Commerce
user experience for Windows, Web, Mac, iOS, and Android with new views, dialogs, columns,
workflows, and triggers. They're written in TypeScript, HTML, and CSS, and they're built through a
`netstandard2.0` project that compiles the TypeScript and packages the assets. A POS extension
can also reference a Commerce Runtime extension when it needs server-side handlers.

The sample is at `src/MyCustomMobileApp/MyPosExtension/` (`My.PosExtensions.csproj`). It adds a
post-checkout trigger that prints a file through the Hardware Station extension.

## Prerequisites

- Complete the steps in [Clone and versioning](./02-clone-and-versioning.md).
- Optionally, create a [Commerce Runtime extension](./04-crt-extension.md) if your POS logic needs
  server-side handlers.

## Requirements

| Requirement | Value |
| ----------- | ----- |
| Target framework | `netstandard2.0` |
| Required NuGet packages | `Microsoft.Dynamics.Commerce.Sdk.Pos`, `Microsoft.TypeScript.MSBuild`, `knockoutjs` |

## Project file

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <Import Project="..\CustomizationPackage.props" />

  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <KnockoutjsFile>Libraries/knockout.js</KnockoutjsFile>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Dynamics.Commerce.Sdk.Pos" Version="$(CommerceSdkPackagesVersion)" />
    <PackageReference Include="Microsoft.TypeScript.MSBuild" Version="$(TypeScriptPackagesVersion)" />
    <PackageReference Include="knockoutjs" Version="3.5.*" />
  </ItemGroup>

  <Target Name="ContentIncludeKnockoutLibrary" BeforeTargets="AssignTargetPaths" DependsOnTargets="RunResolvePackageDependencies">
    <PropertyGroup>
      <KnockoutLibraryFilePath Condition="'%(PackageDefinitions.Name)' == 'knockoutjs'">%(PackageDefinitions.ResolvedPath)\Content\Scripts\knockout-%(PackageDefinitions.Version).js</KnockoutLibraryFilePath>
    </PropertyGroup>
    <Copy SourceFiles="$(KnockoutLibraryFilePath)" DestinationFiles="$(KnockoutjsFile)" SkipUnchangedFiles="true" />
    <ItemGroup>
      <Content Include="$(KnockoutjsFile)"></Content>
    </ItemGroup>
  </Target>
</Project>
```

> [!NOTE]
> The `Microsoft.Dynamics.Commerce.Sdk.Pos` and `Microsoft.TypeScript.MSBuild` versions come from
> the `CommerceSdkPackagesVersion` and
> `TypeScriptPackagesVersion` properties in `repo.props`, so all packages stay centralized. For
> more information, see [Clone and versioning](./02-clone-and-versioning.md).

## Develop the extension

1. Create a `netstandard2.0` project, and then add the `Microsoft.Dynamics.Commerce.Sdk.Pos`,
   `Microsoft.TypeScript.MSBuild`, and `knockoutjs` packages.
2. Optionally, reference a [Commerce Runtime extension](./04-crt-extension.md) project if your POS
   logic needs server-side handlers.
3. Author your TypeScript extension. Extensions are categorized as follows:
   - **Create**: New pages, dialogs, or workflows.
   - **Extend**: More functionality added to existing pages, workflows, or triggers.
4. Reference the POS project from your Store Commerce mobile app so that the extension is bundled
   and loaded when Store Commerce runs in-app. For more information, see
   [Build a custom Store Commerce mobile app](./03-mobile-app.md).
5. Build and validate the extension in POS.

## Additional resources

- [POS extension overview](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/pos-extension/pos-extension-overview)
- [Store Commerce app](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/store-commerce)
- [Debug Store Commerce extensions](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/sc-debug)

## Next steps

- [Channel Database extension](./07-channel-database.md)
