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
using Microsoft.Dynamics.Commerce.HardwareStation;

namespace Contoso.LightDevice.HardwareStation
{
    public class OposLightDevice
    {
        private OPOSLights? _oposLights;
        private const string DeviceName = "LightDevice";
        private static OposLightDevice? _instance;

        // Device-specific color codes for HP Engage.
        private const int ColorGreen = 0x0040000;
        private const int ColorRed = 0x00010000;
        private const int ColorYellow = 0x00020000;

        public static OposLightDevice Instance => _instance ?? (_instance = new OposLightDevice());

        private OposLightDevice() { }

        private void EnsureOpen()
        {
            if (_oposLights == null)
            {
                _oposLights = new OPOSLights();
                int result = _oposLights.Open(DeviceName);
                if (result == (int)OPOS_Constants.OPOS_SUCCESS)
                {
                    int claimResult = _oposLights.ClaimDevice(1000);
                    if (claimResult != (int)OPOS_Constants.OPOS_SUCCESS)
                    {
                        throw new PeripheralException(PeripheralException.PeripheralEventError, $"Failed to claim device '{DeviceName}'. OPOS error code: {claimResult}", inner: null);
                    }
                    _oposLights.DeviceEnabled = true;
                }
                else
                {
                    throw new PeripheralException(PeripheralException.PeripheralEventError, $"Failed to open device '{DeviceName}'. OPOS error code: {result}", inner: null);
                }
            }
        }

        public void SwitchOn()
        {
            EnsureOpen();
            // SwitchOn(int LightNumber, int BlinkOnCycle, int BlinkOffCycle, int Color, int Alarm)
            int result = _oposLights!.SwitchOn(1, 0, 0, ColorGreen, (int)OPOSLightsConstants.LGT_ALARM_NOALARM);
            if (result != (int)OPOS_Constants.OPOS_SUCCESS)
            {
                throw new PeripheralException(PeripheralException.PeripheralEventError, $"Failed to switch on light. OPOS error code: {result}", inner: null);
            }
        }

        public void SwitchOff()
        {
            EnsureOpen();
            int result = _oposLights!.SwitchOn(1, 0, 0, ColorRed, (int)OPOSLightsConstants.LGT_ALARM_NOALARM);
            if (result != (int)OPOS_Constants.OPOS_SUCCESS)
            {
                throw new PeripheralException(PeripheralException.PeripheralEventError, $"Failed to switch off light. OPOS error code: {result}", inner: null);
            }
        }

        public void BlinkOn()
        {
            EnsureOpen();
            // SwitchOn(int LightNumber, int BlinkOnCycle, int BlinkOffCycle, int Color, int Alarm)
            int result = _oposLights!.SwitchOn(1, 500, 500, ColorYellow, (int)OPOSLightsConstants.LGT_ALARM_NOALARM);
            if (result != (int)OPOS_Constants.OPOS_SUCCESS)
            {
                throw new PeripheralException(PeripheralException.PeripheralEventError, $"Failed to blink light. OPOS error code: {result}", inner: null);
            }
        }

        public void BlinkOff()
        {
            // Stop blinking by switching on.
            SwitchOn();
        }

        public void Close()
        {
            if (_oposLights != null)
            {
                try
                {
                    _oposLights.DeviceEnabled = false;
                    _oposLights.ReleaseDevice();
                    _oposLights.Close();
                }
                catch { }
                finally
                {
                    _oposLights = null;
                }
            }
        }
    }
}
