---
title: Commerce SDK extension development guide
description: Learn how to clone the Dynamics 365 Commerce InStore samples for a specific release and build Commerce SDK extensions, with a focus on custom Store Commerce mobile apps.
author: pesilval_microsoft
ms.author: pesilval
ms.reviewer: pesilval
ms.topic: overview
ms.date: 07/15/2026
ms.service: dynamics-365-commerce
---

# Commerce SDK extension development guide

This guide explains how partners and independent software vendors (ISVs) build Microsoft
Dynamics 365 Commerce SDK extensions from the
[`microsoft/Dynamics365Commerce.InStore`](https://github.com/microsoft/Dynamics365Commerce.InStore)
samples repository. It walks you from cloning the correct release branch through building and
packaging every extension type, with a primary focus on producing a custom **Store Commerce
mobile app** for iOS, Android, and Mac by using .NET Multi-platform App UI (.NET MAUI) on .NET 10.

The guide is self-contained. You don't need prior experience with the samples repository, but
familiarity with C#, .NET, and Dynamics 365 Commerce concepts is assumed.

## Who this is for

Partners and ISVs who build custom Store Commerce apps and extensions on top of the Commerce SDK.

## Get started

If you're new to the Commerce SDK, start with the end-to-end tutorial:

- [Zero to Hero: Build a custom Store Commerce app with extensions](./00-zero-to-hero.md)

## Articles

| # | Article | Description |
| - | ------- | ----------- |
| 0 | [Zero to Hero](./00-zero-to-hero.md) | An end-to-end tutorial that builds a custom Store Commerce app with extensions. |
| 1 | [Prerequisites](./01-prerequisites.md) | Install the .NET 10 SDK, .NET Framework 4.7.2 or newer, MAUI workloads, Visual Studio Code, and Android, Xcode, and macOS tools. |
| 2 | [Clone and versioning](./02-clone-and-versioning.md) | Map a FinOps version to a release branch, clone it, and configure NuGet sources. |
| 3 | [Store Commerce mobile app](./03-mobile-app.md) | Build a custom Store Commerce app for iOS, Android, and Mac, and embed your extensions. |
| 4 | [Commerce Runtime extension](./04-crt-extension.md) | Target framework, required NuGet packages, and development steps. |
| 5 | [Hardware Station extension](./05-hws-extension.md) | Target framework, required NuGet packages, and development steps. |
| 6 | [POS extension](./06-pos-extension.md) | Target framework, required NuGet packages, TypeScript and Knockout, and development steps. |
| 7 | [Channel Database extension](./07-channel-database.md) | Coming soon. |
| 8 | [Scale Unit installer](./08-scale-unit-installer.md) | Build an installer that deploys extensions to a Commerce Scale Unit. |
| 9 | [Troubleshooting](./09-troubleshooting.md) | Common errors, common mistakes, and more resources. |

## Extension types at a glance

| Extension | Target framework | Primary SDK package |
| --------- | ---------------- | ------------------- |
| Commerce Runtime | `netstandard2.0` | `Microsoft.Dynamics.Commerce.Sdk.Runtime` |
| Hardware Station | `netstandard2.0` | `Microsoft.Dynamics.Commerce.Sdk.HardwareAndPeripherals` |
| POS | `netstandard2.0` | `Microsoft.Dynamics.Commerce.Sdk.Pos` |
| Channel Database | `netstandard2.0` | `Microsoft.Dynamics.Commerce.Sdk.ChannelDatabase` |
| Store Commerce mobile app | `net10.0-android;net10.0-ios;net10.0-maccatalyst` | `Microsoft.Dynamics.Commerce.Sdk.StoreCommerce.Mobile` |

The Scale Unit installer isn't an extension type. It's a deployment tool that packages and
installs extensions on a Commerce Scale Unit.

| Tool | Target framework | Primary SDK package |
| ---- | ---------------- | ------------------- |
| Scale Unit installer | `net472` | `Microsoft.Dynamics.Commerce.Sdk.Installers.ScaleUnit` |

## Next steps

- [Prerequisites](./01-prerequisites.md)
- [Zero to Hero: Build a custom Store Commerce app with extensions](./00-zero-to-hero.md)

Document changes are tracked in the [changelog](./CHANGELOG.md).
