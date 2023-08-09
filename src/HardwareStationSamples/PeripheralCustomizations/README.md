# HardwareStation Peripherals Customization Sample
This sample shows how to customize the handling of peripherals by the Hardware Station server.

## How the Sample works
This sample implements Request Handlers for key peripheral requests showcasing how to tailor the behavior of the hardware station to meet your specific needs. Below is a brief explanation of each scenario supported by this sample.

### Custom Magnetic Card Swipe Parsing
The CustomMsrTrackParser class shows how to override the custom MSR track information parsing done by the Hardware Station, which makes it possible to handle any format of MSR tracks.

### Custom handling of signature capture point array
Certain signature capture devices might require a different handling of the point array returned by the device. The CustomSignatureCaptureDevice class customizes the parsing of the point array to encode each coordinates in ANSI as might be required by a few devices.

### Custom OPOS device execution
While the previous samples allow handling a specific part of the peripheral processing, when handling OPOS devices there might be the need to fully customize the device's behavior by accessing methods and properties only accessible to the OPOS device instance.
The CustomOposPrinterDevice class utilizes three Requests that showcases how to customize the behavior of OPOS devices without having direct access to the OPOS device instance. This allows more flexibility on customizing the OPOS workflow for each device.
- ExecuteOposDeviceMethodRequest executes a method on the OPOS device with a list of parameters. The method must exist and the parameters will be sent in the same order that they are given.
- GetOposDevicePropertyValueRequest gets the value of a property on the OPOS Device. The property getter must be publicly accessible.
- SetOposDevicePropertyValueRequest sets the value of a property on the OPOS Device. The property setter must be publicly accessible.

### Custom Windows Printer Request
Windows printer requests can be overriden to modify the receipt content, for example to center fixed-width 40-character receipts on a standard sheet of paper.
