/*
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
*/

/*
 IMPORTANT!!!
 THIS IS SAMPLE CODE ONLY.
 THE CODE SHOULD BE UPDATED TO WORK WITH THE APPROPRIATE PAYMENT PROVIDERS.
 PROPER MEASURES SHOULD BE TAKEN TO ENSURE THAT THE PA-DSS AND PCI DSS REQUIREMENTS ARE MET.
*/

namespace Contoso.StoreCommerce.MobileApp
{
    using UIKit;

    /// <summary>
    /// The program class.
    /// </summary>
    public static class Program
    {
        /// <summary>
        /// Main entry point of the application.
        /// </summary>
        /// <param name="args">The arguments.</param>
        public static void Main(string[] args)
        {
            UIApplication.Main(args, principalClass: null, typeof(ApplicationHandler));
        }
    }
}