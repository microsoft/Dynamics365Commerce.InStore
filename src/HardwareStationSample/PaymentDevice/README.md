# HardwareStation Payment Device Sample
This sample shows how to add support for a new Payment Device through the implementation of a handler that will accept the messages received by the Hardware Station server.

## How the Sample works
This sample intentionally implements a no-op Payment device handler as a way to demonstrate the capabilities that it provides and also the information that it requires to work with the Hardware Station infrastructure.
The implemented Request Handler includes the following list of Supported Requests:
 - Device management: Lock/Release, Open/Close, Begin/End Transaction, Cancel Operation and Update Line Items
   These requests are responsible for managing the connection and state of the device
 - Payment operations: Authorize, Capture, Void and Refund payment
 - Gift operations: Get Gift Card Balance, Add Balance to Gift Card, Activate Gift Card
   Should be implemented in the case that the Payment Device supports Gift Cards.
 - Duplicated Payment Protection: Get Transaction Reference, Get Transaction by Transaction Reference
   Requests used to match the curent active transaction reference and prevent duplicated payments from happening.
 - Misc operations: Get Private Tender, Execute Task, Fetch Token
In the case of unsupported operations by the Payment Device, the request must still be supported, but an error should be thrown.
A real implementation should replace all mock and hard-coded information with properties retrieved from the actual device.