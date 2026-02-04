/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using System;
using System.Runtime.InteropServices;

namespace Contoso.LightDevice.HardwareStation
{
    // COM Definitions
    [ComImport]
    [Guid("ccb91361-b81e-11d2-ab74-0040054c3719")]
    [CoClass(typeof(OPOSLightsClass))]
    public interface OPOSLights : IOPOSLights
    {
    }

    [ComImport]
    [Guid("ccb91361-b81e-11d2-ab74-0040054c3719")]
    [InterfaceType(ComInterfaceType.InterfaceIsIDispatch)]
    public interface IOPOSLights
    {
        [DispId(37)]
        int Open(string DeviceName);

        [DispId(35)]
        int Close();

        [DispId(32)]
        int ClaimDevice(int Timeout);

        [DispId(38)]
        int ReleaseDevice();

        [DispId(17)]
        bool DeviceEnabled { get; set; }

        [DispId(91)]
        int SwitchOn(int LightNumber, int BlinkOnCycle, int BlinkOffCycle, int Color, int Alarm);

        [DispId(90)]
        int SwitchOff(int LightNumber);
    }

    [ComImport]
    [Guid("ccb90362-b81e-11d2-ab74-0040054c3719")]
    [ClassInterface(ClassInterfaceType.None)]
    public class OPOSLightsClass
    {
    }

    public enum OPOS_Constants
    {
        OPOS_SUCCESS = 0
    }

    public enum OPOSLightsConstants
    {
        LGT_COLOR_PRIMARY = 1,
        LGT_ALARM_NOALARM = 1
    }
}
