namespace ProductRecognition.CommerceRuntime
{
    using Microsoft.Dynamics.Commerce.Runtime;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;
    using Microsoft.Identity.Client;
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Security.Cryptography.X509Certificates;
    using System.Text.Json;
    using System.Threading.Tasks;

    /// <summary>
    /// Product recognition service implementation.
    /// </summary>
    public class ProductRecognitionService : IRequestHandlerAsync
    {
        // Certificate-based authentication constants
        private const string TENANT_ID = "MY_TENANT_ID";
        private const string CLIENT_ID = "MY_CLIENT_ID";

        private const double DEFAULT_CONFIDENCE_THRESHOLD = 0.3;
        private const int DEFAULT_MAX_RESULTS = 10;

        /// <summary>
        /// Gets the collection of supported request types by this handler.
        /// </summary>
        public IEnumerable<Type> SupportedRequestTypes
        {
            get
            {
                return new[]
                {
                    typeof(ProductRecognitionRequest),
                };
            }
        }

        /// <summary>
        /// Executes the product recognition request.
        /// </summary>
        /// <param name="request">The request parameter.</param>
        /// <returns>The product recognition service response.</returns>
        public async Task<Response> Execute(Request request)
        {
            ThrowIf.Null(request, nameof(request));

            switch (request)
            {
                case ProductRecognitionRequest recognitionRequest:
                    return await this.ProcessProductRecognition(recognitionRequest).ConfigureAwait(false);
                default:
                    throw new NotSupportedException(string.Format(CultureInfo.InvariantCulture, "Request '{0}' is not supported.", request.GetType()));
            }
        }

        /// <summary>
        /// Processes the product recognition request.
        /// </summary>
        /// <param name="request">The product recognition request.</param>
        /// <returns>The product recognition service response.</returns>
        private async Task<ProductRecognitionResponse> ProcessProductRecognition(ProductRecognitionRequest request)
        {
            ThrowIf.Null(request, nameof(request));
            ThrowIf.NullOrWhiteSpace(request.ImageData, nameof(request.ImageData));

            try
            {
                var recognitionResults = await this.CallCustomVisionAPI(request).ConfigureAwait(false);
                return new ProductRecognitionResponse(recognitionResults);
            }
            catch (Exception)
            {
                return new ProductRecognitionResponse(new List<ProductRecognitionResult>());
            }
        }

        /// <summary>
        /// Calls the Azure Custom Vision API to recognize products in the image.
        /// </summary>
        /// <param name="request">The product recognition request.</param>
        /// <returns>Recognition results from the Custom Vision API.</returns>
        private async Task<IEnumerable<ProductRecognitionResult>> CallCustomVisionAPI(ProductRecognitionRequest request)
        {
            // Get configuration from the configuration handler
            var configRequest = new GetCustomVisionConfigurationRequest();
            var configResponse = await request.RequestContext.Runtime.ExecuteAsync<GetCustomVisionConfigurationResponse>(configRequest, request.RequestContext).ConfigureAwait(false);

            string endpoint = configResponse.Endpoint;
            string projectId = configResponse.ProjectId;
            string iterationName = configResponse.IterationName;
            string certificateSubjectName = configResponse.CertificateSubjectName;
            double confidenceThreshold = request.ConfidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD;

            string predictionEndpoint = $"{endpoint.TrimEnd('/')}/customvision/v3.0/Prediction/{projectId}/classify/iterations/{iterationName}/image";

            try
            {
                // Get access token using certificate authentication
                string accessToken = await this.GetAccessTokenAsync(certificateSubjectName).ConfigureAwait(false);

                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    byte[] imageData = Convert.FromBase64String(request.ImageData);
                    using (var content = new ByteArrayContent(imageData))
                    {
                        content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                        var response = await httpClient.PostAsync(predictionEndpoint, content).ConfigureAwait(false);

                        if (response.IsSuccessStatusCode)
                        {
                            string jsonResponse = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                            return await this.ParseCustomVisionResponse(jsonResponse, confidenceThreshold, DEFAULT_MAX_RESULTS, request.RequestContext).ConfigureAwait(false);
                        }
                        else
                        {
                            return new List<ProductRecognitionResult>();
                        }
                    }
                }
            }
            catch (Exception)
            {
                return new List<ProductRecognitionResult>();
            }
        }

        /// <summary>
        /// Gets access token for Custom Vision API using certificate-based AAD authentication.
        /// </summary>
        /// <param name="certificateSubjectName">The certificate subject name.</param>
        /// <returns>The access token.</returns>
        private async Task<string> GetAccessTokenAsync(string certificateSubjectName)
        {
            try
            {
                using (var certificate = LoadCertificateBySubjectName(certificateSubjectName))
                {
                    if (!certificate.HasPrivateKey)
                    {
                        throw new InvalidOperationException("Certificate does not have a private key");
                    }

                    var authority = $"https://login.microsoftonline.com/{TENANT_ID}";

                    var app = ConfidentialClientApplicationBuilder
                        .Create(CLIENT_ID)
                        .WithAuthority(authority)
                        .WithCertificate(certificate)
                        .Build();

                    string[] scopes = { "https://cognitiveservices.azure.com/.default" };

                    var result = await app.AcquireTokenForClient(scopes)
                        // Send x5c so AAD can validate the cert chain for SNI
                        .WithSendX5C(true)
                        .ExecuteAsync().ConfigureAwait(false);

                    if (!string.IsNullOrEmpty(result.AccessToken))
                    {
                        return result.AccessToken;
                    }

                    throw new InvalidOperationException("Unable to acquire access token for Product Recognition service. Token result is empty.");
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to acquire access token using certificate authentication: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Parses the Custom Vision API JSON response to extract product predictions.
        /// </summary>
        /// <param name="jsonResponse">The JSON response from Custom Vision API.</param>
        /// <param name="confidenceThreshold">Minimum confidence threshold for results.</param>
        /// <param name="maxResults">Maximum number of results to return.</param>
        /// <param name="requestContext">The request context.</param>
        /// <returns>Recognition results parsed from the API response.</returns>
        private async Task<IEnumerable<ProductRecognitionResult>> ParseCustomVisionResponse(string jsonResponse, double confidenceThreshold, int maxResults, RequestContext requestContext)
        {
            var results = new List<ProductRecognitionResult>();
            var tagNamesToProbability = new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase);

            try
            {
                using (JsonDocument document = JsonDocument.Parse(jsonResponse))
                {
                    JsonElement root = document.RootElement;

                    if (root.TryGetProperty("predictions", out JsonElement predictionsElement))
                    {
                        foreach (JsonElement prediction in predictionsElement.EnumerateArray())
                        {
                            string tagName = null;
                            double probability = 0.0;

                            if (prediction.TryGetProperty("tagName", out JsonElement tagNameElement))
                            {
                                tagName = tagNameElement.GetString();
                            }

                            if (prediction.TryGetProperty("probability", out JsonElement probabilityElement))
                            {
                                probability = probabilityElement.GetDouble();
                            }

                            if (!string.IsNullOrWhiteSpace(tagName) && probability >= confidenceThreshold)
                            {
                                tagNamesToProbability[tagName] = probability;
                            }
                        }
                    }
                }

                // Batch map all tag names to product IDs in a single request
                if (tagNamesToProbability.Count > 0)
                {
                    var mapRequest = new MapTagNamesToProductIdRequest(tagNamesToProbability.Keys);
                    var mapResponse = await requestContext.Runtime.ExecuteAsync<MapTagNamesToProductIdResponse>(mapRequest, requestContext).ConfigureAwait(false);

                    foreach (var mapping in mapResponse.ProductIdsByTagName)
                    {
                        if (tagNamesToProbability.TryGetValue(mapping.Key, out double probability))
                        {
                            results.Add(new ProductRecognitionResult(mapping.Value, probability));
                        }
                    }
                }

                // Sort by confidence score (highest first) and take top results
                return results.OrderByDescending(r => r.ConfidenceScore).Take(maxResults);
            }
            catch (Exception)
            {
                return new List<ProductRecognitionResult>();
            }
        }

        private static X509Certificate2 LoadCertificateBySubjectName(string subjectName)
        {
            using (var store = new X509Store(StoreName.My, StoreLocation.LocalMachine))
            {
                store.Open(OpenFlags.ReadOnly | OpenFlags.OpenExistingOnly);

                var cert = store.Certificates
                    .Find(X509FindType.FindBySubjectName, subjectName, validOnly: false)
                    .OfType<X509Certificate2>()
                    .Where(c => c.HasPrivateKey && DateTime.UtcNow > c.NotBefore.ToUniversalTime() && DateTime.UtcNow < c.NotAfter.ToUniversalTime())
                    .OrderByDescending(c => c.NotBefore)
                    .FirstOrDefault();

                if (cert == null)
                {
                    throw new InvalidOperationException($"No valid certificate with subject name '{subjectName}' found in LocalMachine\\My with a private key.");
                }

                return cert;
            }
        }

    }
}