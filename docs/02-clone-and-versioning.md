---
title: Clone the Commerce SDK samples and select a version
description: Map a Dynamics 365 FinOps application version to a release branch of the InStore samples, clone the branch, and configure the NuGet sources for Commerce SDK and Store Commerce mobile dependencies.
author: pesilval_microsoft
ms.author: pesilval
ms.reviewer: pesilval
ms.topic: how-to
ms.date: 07/15/2026
ms.service: dynamics-365-commerce
---

# Clone the Commerce SDK samples and select a version

This article describes how to clone the InStore samples repository for the release that matches
your go-live version, and how to configure the NuGet sources that Commerce SDK extensions and
Store Commerce mobile apps require.

You must build extensions against the branch that matches your Dynamics 365 **FinOps application
version** (your go-live version).

> [!WARNING]
> Building against a version that's higher than your go-live version can cause runtime and
> deployment failures.

## Map a FinOps version to a branch

Branches are named `release/9.<minor>`. To map the FinOps `10.0.XX` version to a branch, use the
following formula, where `XX` is the FinOps patch number:

> **`release/9.{XX + 10}`**

| FinOps application version | Repo branch | Package version |
| -------------------------- | ----------- | --------------- |
| 10.0.48 | `release/9.58` | 9.58.\* |
| 10.0.49 | `release/9.59` | 9.59.\* |
| 10.0.50 | `release/9.60` | 9.60.\* |

For example, for FinOps 10.0.50, use `release/9.60`. For 10.0.49, use `release/9.59`, and so on.

## Clone the targeted branch

Clone only the branch that you need. The `--single-branch` option keeps the clone small.

```bash
git clone https://github.com/microsoft/Dynamics365Commerce.InStore.git --branch release/9.60 --single-branch
```

Replace `release/9.60` with the branch for your go-live version.

## Configure the NuGet feed

Commerce SDK packages are published to a public feed. The repository's `nuget.config` file
already points to it. If you set up a project outside the repository, add the source yourself.

```xml
<packageSources>
    <add key="dynamics365-commerce" value="https://pkgs.dev.azure.com/commerce-partner/Registry/_packaging/dynamics365-commerce/nuget/v3/index.json" />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
</packageSources>
```

## Download the LCS mobile dependencies

The Store Commerce mobile SDK depends on packages that are distributed through Microsoft Dynamics
Lifecycle Services (LCS), not the public feed. Download them for your targeted version, and then
add the folder as an additional NuGet source.

1. Go to the [LCS Shared Asset Library](https://lcs.dynamics.com/V2/SharedAssetLibrary).
2. Under **Retail Self-service package**, download the **Store Commerce for Android** package for
   your targeted version (for example, **10.0.50**). This package also contains the dependencies
   that are required to create iOS and macOS apps.
3. Unzip the package, and then copy the `packages` folder to your repository root.
4. Add the folder as a package source in `nuget.config`.

   ```xml
   <packageSources>
       <add key="dynamics365-commerce" value="https://pkgs.dev.azure.com/commerce-partner/Registry/_packaging/dynamics365-commerce/nuget/v3/index.json" />
       <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
       <add key="Dynamics365Commerce-Mobile-Dependencies" value="./packages" />
   </packageSources>
   ```

## Next steps

- [Store Commerce mobile app](./03-mobile-app.md)
