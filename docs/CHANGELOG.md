---
title: What's new or changed in the Commerce SDK extension development guide
description: Track updates to the partner Commerce SDK extension development guide, including new samples, instructions, and release versions.
author: pesilval_microsoft
ms.author: pesilval
ms.reviewer: pesilval
ms.topic: whats-new
ms.date: 07/25/2026
ms.service: dynamics-365-commerce
---

# Changelog

This article records the notable changes to the Commerce SDK extension development guide.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-08-17

### Added

- `10-using-ai-skills.md`: how to use the Commerce Extension Developer skill with GitHub
  Copilot CLI or Claude Code for Commerce extension development.

## [1.0.0] - 2026-07-25

### Added

- Initial release of the Commerce SDK extension development guide for **release/9.60 / FinOps
  10.0.50**.
- Guide hub (`README.md`) that links all articles and lists the extension types at a glance.
- `00-zero-to-hero.md`: an end-to-end tutorial (clone, prerequisites, build extensions, embed in
  the mobile app, and run).
- `01-prerequisites.md`: the .NET 10 SDK, .NET MAUI workloads, Visual Studio Code and the .NET
  MAUI extension, Android, and Xcode and macOS setup.
- `02-clone-and-versioning.md`: the FinOps-version-to-branch mapping, the single-branch clone
  command, NuGet source configuration, and the LCS mobile dependencies.
- `03-mobile-app.md`: Store Commerce for iOS, Android, and Mac, including how to embed
  extensions, the single extension package and `ReferenceOutputAssembly` requirements, and how to
  build a custom app.
- `04-crt-extension.md`, `05-hws-extension.md`, and `06-pos-extension.md`: per-extension target
  frameworks, required NuGet packages, and development steps.
- `07-channel-database.md`: a placeholder ("Coming soon.").
- `08-scale-unit-installer.md`: how to build a Scale Unit installer that deploys extensions to a
  Commerce Scale Unit.
- `09-troubleshooting.md`: common errors, common mistakes, how to enable the extension package on
  the Commerce Scale Unit, how to consume hotfixes, package reference hygiene, and more resources.
- `MyCustomMobileApp` sample, which the guide's examples are based on. It contains the
  `My.CustomMobileApp.slnx` solution (in the `.slnx` solution format), a mobile app that targets
  Android, iOS, and Mac, a POS extension, and a Hardware Station extension.

[Unreleased]: https://github.com/microsoft/Dynamics365Commerce.InStore
[1.0.1]: https://github.com/microsoft/Dynamics365Commerce.InStore
[1.0.0]: https://github.com/microsoft/Dynamics365Commerce.InStore
