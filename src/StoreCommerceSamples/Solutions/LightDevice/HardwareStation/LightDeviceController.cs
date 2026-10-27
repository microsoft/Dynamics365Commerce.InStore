/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using System.Threading.Tasks;
using Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts;
using Microsoft.Dynamics.Commerce.HardwareStation;

namespace Contoso.LightDevice.HardwareStation
{
    [RoutePrefix("LightDevice")]
    public class LightDeviceController : IController
    {
        [HttpPost]
        public Task<bool> SwitchOn()
        {
            OposLightDevice.Instance.SwitchOn();
            return Task.FromResult(true);
        }

        [HttpPost]
        public Task<bool> SwitchOff()
        {
            OposLightDevice.Instance.SwitchOff();
            return Task.FromResult(true);
        }

        [HttpPost]
        public Task<bool> BlinkOn()
        {
            OposLightDevice.Instance.BlinkOn();
            return Task.FromResult(true);
        }
        
        [HttpPost]
        public Task<bool> BlinkOff()
        {
             OposLightDevice.Instance.BlinkOff();
             return Task.FromResult(true);
        }
    }
}
