---
title: Using AI skills for Commerce extension development
description: Use the Commerce Extension Developer skill with GitHub Copilot CLI or Claude Code.
ms.topic: overview
ms.date: 08/11/2026
ms.service: dynamics-365-commerce
---

# Using AI skills for Commerce extension development

The Commerce Extension Developer skill helps developers build Dynamics 365 Commerce
extensions with **GitHub Copilot CLI** or **Claude Code**. It supports POS, Commerce
Runtime (CRT), Hardware Station (HWS), and Channel Database development, from
requirements and extension-type classification through scaffolding and validation.

## Intended use

Use the skill when you need to create or extend a Commerce solution, choose the
appropriate extension point, or apply the supported Commerce SDK patterns. Describe the
functional requirement and provide the skill access to the solution that you want to
change. The skill asks clarifying questions, proposes a design, and should wait for
approval before scaffolding code.

## What's in this bundle

The initialized skill bundle is copied to the root of the solution repository:

```text
marketplace/                  Commerce Extension Developer skill and plugin content
.github/copilot/settings.json Registers the marketplace for GitHub Copilot CLI
.claude/settings.json         Registers the marketplace for Claude Code
```

`InitDev` also copies the skill files into the repository root and updates them when a
new SDK version is restored.

## Set up an existing solution

Run these commands from the root of an existing solution that references the Commerce SDK
packages:

```powershell
dotnet restore <Solution>.sln
dotnet msbuild <Solution>.sln /t:InitDev
```

Run these commands again after an SDK version update to receive the latest skill content.

## Install and use the plugin

The bundled settings register the `marketplace/` directory, but installing the plugin
is a required one-time step because agent CLIs do not auto-install repository plugins.

From the repository root, install it with GitHub Copilot CLI:

```powershell
copilot plugin install commerce-ext-dev@commerce-sdk-skills
```

For Claude Code, run `claude` from the repository root, type `/plugin`, and install
`commerce-ext-dev` from the `commerce-sdk-skills` marketplace.

Then run `copilot` or `claude` from the repository root and ask the agent to build a
Commerce extension, or invoke `commerce-ext-dev`. Review the proposed design before
allowing the skill to scaffold files.

The `path` in both settings files is `./marketplace`, resolved relative to the folder
where you run the agent CLI. Keep `marketplace/` at the repository root or update both
settings files consistently.

## Responsible AI and human review

This is an AI-powered preview feature. Its responses, code, and configuration files may
be inaccurate, incomplete, or inappropriate for a specific scenario. The output is
advisory and must be reviewed and approved by a qualified developer before it is built,
committed, deployed, or used to modify a system.

The skill does not replace Commerce SDK documentation, build validation, security review,
or human approval. It is not intended for legal, regulatory, compliance, financial, or
security determinations, or for production automation without human review. Preview
functionality, behavior, availability, licensing, and data-handling practices may change
before general availability.

## Data handling

The skill is content loaded into the host agent CLI. It does not itself transmit, store,
log, retain data, add telemetry, or make external network calls. The local scaffolder
writes files into the workspace only. Prompts, repository context, and skill content are
processed by GitHub Copilot CLI or Claude Code under that tool's data-handling and
retention policies. Do not provide data that your host CLI or organization does not
permit.

## Known limitations

- Outputs may contain inaccurate code, SQL, or project wiring; review and test them.
- Coverage is limited to documented Store Commerce extension patterns.
- The skill is validated primarily for English-language interaction.
- Generated solutions target the SDK version range in `repo.props`; restore or build can
  fail when that version is unavailable on the configured feed.

## Feedback and support

For incorrect, unsafe, or harmful output, open an issue in the
[Dynamics365Commerce.InStore repository](https://github.com/microsoft/Dynamics365Commerce.InStore/issues)
with the requirement, skill output, SDK version, and observed result. For product or
deployment issues, use the normal Commerce support process and include sanitized logs
and reproduction steps.
