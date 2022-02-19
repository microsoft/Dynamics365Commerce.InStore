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
        /// PDF printer web API controller class.
        /// </summary>
        [RoutePrefix("FILEPRINTER")]
        public class FilePrinterController : IController
        {
            /// <summary>
            /// Prints the content.
            /// </summary>
            /// <param name="printRequest">The print request.</param>
            /// <exception cref="System.Web.Http.HttpResponseException">Exception thrown when an error occurs.</exception>
            [HttpPost]
            public Task<bool> Print(PrintFileRequest printRequest)
            {
                ThrowIf.Null(printRequest, "printRequest");

                try
                {
                    // Add here the code to send the PDF file to the printer.
                    var directory = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Contoso", "FilePrinter");
                    if (!Directory.Exists(directory))
                    {
                        Directory.CreateDirectory(directory);
                    }

                    File.WriteAllLines(Path.Combine(directory, printRequest.FileName), printRequest.Lines, encoding: Encoding.UTF8);
                    return Task.FromResult(true);
                }
                catch (PeripheralException ex)
                {
                    Console.WriteLine(ex.Message);
                    throw;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    throw new PeripheralException(PeripheralException.PrinterError, ex.Message, ex);
                }
            }
        }
    }
}
