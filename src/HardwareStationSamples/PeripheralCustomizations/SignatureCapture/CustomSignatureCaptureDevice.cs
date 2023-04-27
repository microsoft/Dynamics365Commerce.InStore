using Microsoft.Dynamics.Commerce.HardwareStation;
using Microsoft.Dynamics.Commerce.HardwareStation.Peripherals;
using Microsoft.Dynamics.Commerce.Runtime.Handlers;
using Microsoft.Dynamics.Commerce.Runtime.Messages;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Text;
using System.Threading.Tasks;

namespace Contoso.HardwareStation.Peripherals.DeviceCustomizations
{
    /// <summary>
    /// A custom OPOS signature capture device handler.
    /// </summary>
    public sealed class CustomSignatureCaptureDevice : INamedRequestHandlerAsync
    {
        /// <summary>
        /// Gets the unique name for this request handler.
        /// </summary>
        public string HandlerName
        {
            get { return PeripheralType.Opos; }
        }

        /// <summary>
        /// Gets the collection of supported request types by this handler.
        /// </summary>
        public IEnumerable<Type> SupportedRequestTypes
        {
            get
            {
                return new[]
                {
                     typeof(GetParsedSignatureCaptureResultRequest),
                };
            }
        }

        /// <summary>
        /// Represents the entry point for the signature capture device request handler.
        /// </summary>
        /// <param name="request">The incoming request message.</param>
        /// <returns>The outgoing response message.</returns>
        public Task<Response> Execute(Request request)
        {
            ThrowIf.Null(request, nameof(request));

            switch (request)
            {
                case GetParsedSignatureCaptureResultRequest parseSignatureCaptureResultRequest:
                    return Task.FromResult<Response>(new GetParsedSignatureCaptureResultResponse(ParseResults(parseSignatureCaptureResultRequest)));
                default:
                    throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
            }
        }

        /// <summary>
        /// Parses the result of the signature capture device.
        /// </summary>
        /// <param name="request">The parse signature capture result request.</param>
        /// <returns>The parsed signature capture results.</returns>
        private SignatureCaptureResults ParseResults(GetParsedSignatureCaptureResultRequest request)
        {
            return ParsePointArray(request.PointArray);
        }

        /// <summary>
        /// Convert point array string into array of points.
        /// </summary>
        /// <param name="pointArray">Point array string.</param>
        /// <returns>Returns ISignatureCaptureInfo.</returns>
        public SignatureCaptureResults ParsePointArray(string pointArray)
        {
            SignatureCaptureResults signatureCaptureInfo = new SignatureCaptureResults();

            if (!string.IsNullOrWhiteSpace(pointArray))
            {
                Point point;
                int step = 4; // process 4 characters each step

                List<Point> points = new List<Point>(pointArray.Length / step);

                // Each point is represented by four characters: x(low 8 bits), x(high 8 bits), y(low 8 bits), y(high 8 bits)
                for (int i = 0; i + step <= pointArray.Length; i += step)
                {
                    point = GetPoint(pointArray[i], pointArray[i + 1], pointArray[i + 2], pointArray[i + 3]);
                    points.Add(point);
                }

                signatureCaptureInfo.Signature = ToByteArrayString(points);
            }

            return signatureCaptureInfo;
        }

        /// <summary>
        /// Gets a point object from the next four character points received from the signature capture device.
        /// </summary>
        /// <param name="lowXchar">A character representing the lower bits from the X axis.</param>
        /// <param name="highXchar">A character representing the higher bits from the X axis.</param>
        /// <param name="lowYchar">A character representing the lower bits from the Y axis.</param>
        /// <param name="highYchar">A character representing the higher bits from the Y axis.</param>
        /// <returns>A point object containing X and Y coordinates.</returns>
        private static Point GetPoint(char lowXchar, char highXchar, char lowYchar, char highYchar)
        {
            int x = EncodeANSI(highXchar) << 8 | EncodeANSI(lowXchar);
            int y = EncodeANSI(highYchar) << 8 | EncodeANSI(lowYchar);

            if (x == 0xffff && y == 0xffff)
            {
                // End point
                x = -1;
                y = -1;
            }

            return new Point(x, y);
        }

        /// <summary>
        /// Convert collection of points into byte array base 64 string.
        /// </summary>
        /// <param name="points">Collection of points.</param>
        /// <returns>Encoded string.</returns>
        public static string ToByteArrayString(ICollection<Point> points)
        {
            if (points == null || points.Count < 1)
            {
                return null;
            }

            return Convert.ToBase64String(ToByteArray(points));
        }

        /// <summary>
        /// Convert collection of points into byte array.
        /// </summary>
        /// <param name="points">Collection of points.</param>
        /// <returns>Byte array.</returns>
        public static byte[] ToByteArray(ICollection<Point> points)
        {
            if (points == null || points.Count < 1)
            {
                return null;
            }

            // Size of int times number of values. Two values per point.
            List<byte> bytes = new List<byte>(points.Count * sizeof(int) * 2);

            foreach (Point point in points)
            {
                bytes.AddRange(BitConverter.GetBytes(point.X));
                bytes.AddRange(BitConverter.GetBytes(point.Y));
            }

            return bytes.ToArray();
        }

        /// <summary>
        /// Encodes the given charater in ANSI encoding.
        /// </summary>
        /// <param name="value">The chracter being encoded.</param>
        /// <returns>A numeric representation of the character in ANSI encoding.</returns>
        private static int EncodeANSI(char value)
        {
            int int32 = Convert.ToInt32(value);
            if (int32 < 128)
            {
                return int32;
            }

            Encoding encoding = Encoding.Default;
            char[] chars = new char[1] { value };
            byte[] bytes1 = new byte[chars.Length * 2];
            int bytes2 = encoding.GetBytes(chars, 0, chars.Length, bytes1, 0);
            int int16;
            if (encoding.IsSingleByte || bytes2 == 1)
            {
                int16 = bytes1[0];
            }
            else
            {
                if (BitConverter.IsLittleEndian)
                {
                    byte num = bytes1[0];
                    bytes1[0] = bytes1[1];
                    bytes1[1] = num;
                }

                int16 = BitConverter.ToInt16(bytes1, 0);
            }

            return int16;
        }
    }
}
