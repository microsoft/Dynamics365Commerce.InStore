/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso
{
    namespace Commerce.HardwareStation
    {
        using System;
        using System.IO;
        using System.Text;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.HardwareStation;
        using Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts;

        /// <summary>
        /// File printer web API controller class.
        /// </summary>
        [RoutePrefix("FILEPRINTER")]
        public class FilePrinterController : IController
        {
            /// <summary>
            /// Prints the content.
            /// </summary>
            /// <param name="printRequest">The print request.</param>
            /// <returns>A task that returns true if the file was written successfully, or false if a peripheral exception is caught.</returns>
            [HttpPost]
            public async Task<bool> Print(PrintFileRequest printRequest)
            {
                ThrowIf.Null(printRequest, "printRequest");

                try
                {
                    // Add here the code to write the receipt lines to a file.
                    var directory = Path.Combine(Path.GetTempPath(), "Contoso", "FilePrinter");
                    if (!Directory.Exists(directory))
                    {
                        Directory.CreateDirectory(directory);
                    }

                    File.WriteAllLines(Path.Combine(directory, printRequest.FileName), printRequest.Lines, encoding: Encoding.UTF8);
                    return await Task.FromResult(true).ConfigureAwait(false);
                }
                catch (PeripheralException ex)
                {
                    Console.WriteLine(ex.Message);
                    return await Task.FromResult(false).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    return await Task.FromResult(false).ConfigureAwait(false);
                }
            }
        }
    }
}
