# Light Device Sample

## Overview
This sample showcases a solution to control a light device via OPOS (OLE for Retail POS). The sample demonstrates how to extend Dynamics 365 Commerce Store Commerce to integrate with OPOS-compliant light devices for visual signaling and notifications. The light device can be controlled to switch on/off or blink based on various POS operations and triggers, providing visual feedback to store associates and customers.

## Key Features

- **OPOS Device Integration**: Implements OPOS light device control through the Hardware Station
- **Multiple Control Actions**: Supports switching on/off and blinking on/off operations
- **POS Triggers**: Extends Store Commerce with triggers that respond to various operations:
  - Post-LogOn and Post-LogOff events
  - Pre-ElevateUser events
  - Pre-Operation events
  - Operation failure events
  - Request for Assistance operation (Operation ID 718)
- **Hardware Station Controller**: Custom HTTP API endpoints for device control
- **Error Handling**: Robust error handling that prevents device failures from blocking POS operations

## Architecture

The sample consists of several components:

### Commerce Runtime (CRT)
- **DefinePosExtensionPackageTrigger**: Registers the POS extension package with the Commerce Runtime

### Hardware Station
- **LightDeviceController**: HTTP controller that exposes device control endpoints
  - `SwitchOn`: Turns the light device on
  - `SwitchOff`: Turns the light device off
  - `BlinkOn`: Starts the light device blinking
  - `BlinkOff`: Stops the light device blinking
- **OposLightDevice**: Singleton wrapper class for OPOS light device interactions
- **OposLightInterop**: OPOS COM interop layer for device communication

### Point of Sale (POS)
- **LightDevice.ts**: Centralized utility class for executing light device actions
- **PostLogOnTrigger**: Turns on the light when a user logs in
- **PostLogOffTrigger**: Turns off the light when a user logs out
- **PreElevateUserTrigger**: Triggers light blink when manager override is initiated
- **PreOperationTrigger**: Controls light based on specific operations (e.g., Request for Assistance)
- **OperationFailureTrigger**: Handles light control when operations fail

## Prerequisites

- Visual Studio 2026 with .NET development workload
- Store Commerce SDK
- OPOS-compliant light device with proper drivers installed
- OPOS Common Control Objects (CCOs) installed on the Hardware Station machine

## Running the sample

1. Open the Developer Command Prompt for Visual Studio 2026
2. Restore the NuGet packages for the solution:
   ```
   nuget restore Contoso.LightDevice.sln
   ```
3. Initialize Store Commerce development for the solution:
   ```
   msbuild Contoso.LightDevice.sln /t:InitDev
   ```
4. Open Visual Studio Code in the solution root directory
5. Build the solution using the "Build & Install Store Commerce Extension" task in VSCode
6. Install the Scale Unit extension:
   - Open PowerShell as Admin in the ScaleUnit.Installer bin directory
   - Run: `.\Contoso.LightDevice.ScaleUnit.Installer.exe install`
7. Install the Store Commerce extension:
   - Open PowerShell as Admin in the StoreCommerce.Installer bin directory
   - Run: `.\Contoso.LightDevice.StoreCommerce.Installer.exe install`
8. Configure your OPOS light device:
   - Ensure the OPOS device is properly configured using the OPOS configuration utility
   - Set the device name to "LightDevice" (or update the code to match your device name)
9. Open the "Run & Debug Tab" in VSCode and use the "Debug Store Commerce" option to launch Store Commerce app with the debugger attached
10. Sign in to Store Commerce and test the light device:
    - The light should turn on when you log in
    - The light should turn off when you log out
    - The light should blink when manager override is requested
    - The light should respond to the Request for Assistance operation

## APIs and Extension Points Used

### "PosApi/Framework/ExtensionContext"
- **IExtensionContext**: Provides access to runtime services, logger, and execution context
  - `runtime.executeAsync`: Used to execute Hardware Station device action requests
  - `logger.logError`: Used for logging errors without blocking POS operations

### "PosApi/Consume/Peripherals"
- **HardwareStationDeviceActionRequest**: Request class for invoking custom Hardware Station device actions
  - Constructor parameters: device name ("LightDevice"), action name, and action data

### "PosApi/Extend/Triggers"
Trigger extension points for intercepting POS operations:
- **PostLogOnTrigger**: Executes after successful user login
- **PostLogOffTrigger**: Executes after user logout
- **PreElevateUserTrigger**: Executes before manager override operation
- **PreOperationTrigger**: Executes before specific operations (filtered by operation ID)
- **OperationFailureTrigger**: Executes when operations fail

### Hardware Station
- **IController**: Base interface for Hardware Station controllers
- **RoutePrefix**: Attribute for defining the controller route ("LightDevice")
- **HttpPost**: Attribute for defining HTTP POST endpoints

### OPOS Integration
- COM interop with OPOS CCOs for device control
- Standard OPOS device lifecycle: Open, Claim, DeviceEnabled

## Customization Points

- **Device Actions**: Add additional control methods in `LightDeviceController.cs` and `OposLightDevice.cs`
- **Trigger Logic**: Modify or add new triggers in the `Pos/Extend/Triggers` directory to respond to different POS events
- **Operation Filtering**: Customize which operations trigger light actions in `PreOperationTrigger.ts`
- **Error Handling**: Adjust error handling behavior in `LightDevice.executeAction` method
- **Device Configuration**: Update device name and OPOS configuration as needed

## Additional Resources

- [Integrate the POS with a new hardware device](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/hardware-device-extension)
- [Mass deployment of sealed Commerce self-service components](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/enhanced-mass-deployment)
- [Store Commerce app triggers and printing](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/pos-trigger-printing)
- [UnifiedPOS specification](https://www.omg.org/spec/UPOS/)
- [Debugging POS Extensions](https://learn.microsoft.com/dynamics365/commerce/dev-itpro/pos-extension/debug-pos-extension)
