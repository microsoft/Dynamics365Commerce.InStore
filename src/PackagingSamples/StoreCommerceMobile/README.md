<!-- TOC -->

- [Mobile App Sample Solution](#mobile-app-sample-solution)
    - [Using the sample](#using-the-sample)
        - [Pre-requisites:](#pre-requisites)
        - [Steps:](#steps)
            - [Android](#android)
            - [iOS](#ios)

<!-- /TOC -->

# Mobile App Sample Solution
This solution demonstrates how to create a Store Commerce mobile app package with dedicated Commerce Runtime, Hardware Station, and WebApp (POS) extensions. The output of this sample solution will be an Android app package (.apk) and an iPhone app package (.ipa) used to install the Store Commerce mobile app onto mobile devices.

## Using the sample
In order to build the Store Commerce mobile app sample, you must follow the below steps to consume the Store Commerce Mobile SDK.

### Pre-requisites:
  Install the .NET Multi-platform App UI development Visual Studio workload.

  Alternatively, you can install the MAUI .NET Workloads via command line:
  ```powershell
  $mauiVersion = dotnet --version

  # Use sudo if on macOS or Linux
  dotnet workload install maui --version $mauiVersion
  ```

### Steps:
  - Navigate to the [LCS Shared Asset Library](https://lcs.dynamics.com/V2/SharedAssetLibrary)
  - Under the Retail Self-service package, download the latest Store Commerce for Android package, starting with version 10.0.41.
  - Starting with version 10.0.44, the Store Commerce for Android package will contain the dependencies required for creating an iOS app.
  - Unzip the Store Commerce for Android package and copy the ```packages``` folder to your repository root.
  - Modify the nuget.config file to include the packages folder as a package source. In the ```<packageSources>``` node, add: ```<add key="Dynamics365Commerce-Mobile-Dependencies" value="./packages" />```.
  - The app name that is displayed in the Android launcher or iOS home should be modified in the mobile app project by setting the ```ApplicationTitle``` value.
  - The package name should be modified in the mobile app project by setting the ```ApplicationId``` value.
  - Build the mobile samples solution.

#### Android
  - Assuming an Android emulator is configured, you may start debugging the app from Visual Studio.
  - If you do not wish to develop an Android app, comment out the net10.0-android target framework in the mobile app project.

#### iOS
  - If you are developing on Windows, you need to pair a Mac for iOS development: https://learn.microsoft.com/dotnet/maui/ios/pair-to-mac?view=net-maui-10.0
  - If you do not wish to develop an iOS app, comment out the net10.0-ios target framework in the mobile app project.