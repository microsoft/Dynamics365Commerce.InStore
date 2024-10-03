# Mobile App Sample Solution
This solution demonstrates how to create a Store Commerce mobile app package with dedicated Hardware Station extensions. The output of this sample solution will be an Android app package (APK) used to install the Store Commerce mobile app onto Android devices.

## Using the sample
In order to build the Store Commerce mobile app sample, you must follow the below steps to consume the Store Commerce Mobile SDK.

### Pre-requisites:
  Install the .NET Multi-platform App UI development Visual Studio 2022 workload.

### Steps
  - Navigate to the [LCS Shared Asset Library](https://lcs.dynamics.com/V2/SharedAssetLibrary)
  - Under the Retail Self-service package, download the latest Store Commerce for Android package, starting with version 10.0.41.
  - Unzip the Store Commerce for Android package and copy the ```packages``` folder to your repository root.
  - Modify the nuget.config file to include the packages folder as a package source. In the ```<packageSources>``` node, add: ```<add key="Dynamics365Commerce-Android-Dependencies" value="./packages" />```.
  - The App name that is displayed in the Android launcher should be modified in the MainActivity.cs by updating the Label property on the Activity attribute.
  - The package name should be modified in the AndroidManifest.xml by changing the package attribute of the manifest node. The android:label attribute of the application node should also be modified.
  - Build the mobile samples solution.
  - Assuming an Android emulator is configured, you may start debugging the app from Visual Studio.