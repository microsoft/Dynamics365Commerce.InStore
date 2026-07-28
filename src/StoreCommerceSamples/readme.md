# Store Commerce Samples
## Overview
This folder contains sample solutions that demonstrate how to customize the Store Commerce (and POS) App in various scenarios. Each sample contains a solution containing a Commerce Runtime project to enable the POS extension package and the POS extension package with the sample extensions. The samples are organized based on the type of customizations.

- Create: These extensions supplement POS by introducing new pages, dialogs or workflows that do not exist “out of the box”
- Extend: These extensions modify POS by adding additional functionality to existing pages, workflows or other functionality
- Solutions: These samples showcase a variety of extension types to enable a more complete feature or solution.

## Samples List
- Create/
  - Dialogs/
    - [BarcodeMsrDialogSample](./Create/Dialogs/BarcodeMsrDialogSample/readme.md)
  - DeepLinkActions/
    - [DeepLinkActionsSample](./PosExtensionSamples/Pos/Create/DeepLinkActions/readme.md) - Demonstrates deep link action extensibility (CREATE and EXTEND patterns)
- Extend/
  - Triggers/
    - [TriggerSamples](./Extend/Triggers/TriggerSamples/readme.md)
- Solutions/
  - [GasStation](./Solutions/GasStation/README.md)
- Accessing Static Resources in Extensions
  - The [StaticResourcesAccessSample](https://msazure.visualstudio.com/D365/_git/Commerce-Samples-InStore?path=/src/StoreCommerceSamples/PosExtensionSamples/Pos/Extend/Triggers/BeepSoundPostProductSaleTrigger.ts&version=GBmain&line=17&lineEnd=17&lineStartColumn=9&lineEndColumn=89&lineStyle=plain&_a=contents) demonstrates how to access static resources in POS extensions. 
