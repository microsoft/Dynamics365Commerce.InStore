namespace GasStationSample.CommerceRuntime
{
    using Microsoft.Dynamics.Commerce.Runtime;
    using Microsoft.Dynamics.Commerce.Runtime.DataModel;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;
    using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public class GasPumpsDataService : IRequestHandlerAsync
    {
        private const string DEFAULT_GASOLINE_ITEM_ID = "gasoline";
        private static decimal COST_PER_UNIT = 3.599m;
        private static Dictionary<string, IEnumerable<GasPump>> GasPumpsByStore;
        private static List<GasStationDetails> GasStations = new List<GasStationDetails>();

        public IEnumerable<Type> SupportedRequestTypes
        {
            get
            {
                return new[]
                {
                    typeof(GetGasPumpsDataRequest),
                    typeof(UpdatePumpStateDataRequest),
                    typeof(StopAllPumpsDataRequest),
                    typeof(StartAllPumpsDataRequest),
                    typeof(GetGasStationDetailsDataRequest)
                };
            }
        }

        public async Task<Response> Execute(Request request)
        {
            if (request == null)
            {
                throw new ArgumentNullException("request");
            }

            await this.InitializeGasPumps(request);
            Type reqType = request.GetType();
            if (reqType == typeof(GetGasPumpsDataRequest))
            {
                return this.GetGasPumps((GetGasPumpsDataRequest)request);
            }
            else if (reqType == typeof(UpdatePumpStateDataRequest))
            {
                return this.UpdatePumpState((UpdatePumpStateDataRequest)request);
            }
            else if (reqType == typeof(StartAllPumpsDataRequest))
            {
                return this.StartAllPumps((StartAllPumpsDataRequest)request);
            }
            else if (reqType == typeof(StopAllPumpsDataRequest))
            {
                return this.StopAllPumps((StopAllPumpsDataRequest)request);
            }
            else if (reqType == typeof(GetGasStationDetailsDataRequest))
            {
                return this.GetGasStationDetails((GetGasStationDetailsDataRequest)request);
            }
            else
            {
                string message = string.Format(CultureInfo.InvariantCulture, "Request '{0}' is not supported.", reqType);
                throw new NotSupportedException(message);
            }
        }

        private Response GetGasStationDetails(GetGasStationDetailsDataRequest request)
        {
            var station = GasStations.First((s) => s.StoreNumber == request.StoreNumber);
            return new GetGasStationDetailsDataResponse(station);
        }

        private Response StartAllPumps(StartAllPumpsDataRequest request)
        {
            var pumps = GasPumpsDataService.GasPumpsByStore[request.StoreNumber];
            if (pumps == null)
            {
                throw new DataValidationException(DataValidationErrors.Microsoft_Dynamics_Commerce_Runtime_ObjectNotFound);
            }

            foreach (var pump in pumps)
            {
                if (pump.State.GasPumpStatus == GasPumpStatus.Stopped)
                {
                    pump.State.GasPumpStatus = GasPumpStatus.Idle;
                    pump.State.LastUpdateTime = DateTimeOffset.UtcNow;
                }
            }

            return new StartAllPumpsDataResponse(pumps);
        }

        private Response StopAllPumps(StopAllPumpsDataRequest request)
        {
            var pumps = GasPumpsDataService.GasPumpsByStore[request.StoreNumber];
            if (pumps == null)
            {
                throw new DataValidationException(DataValidationErrors.Microsoft_Dynamics_Commerce_Runtime_ObjectNotFound);
            }

            foreach (var pump in pumps)
            {

                pump.State.GasPumpStatus = GasPumpStatus.Stopped;
                pump.State.LastUpdateTime = DateTimeOffset.UtcNow;
            }

            return new StopAllPumpsDataResponse(pumps);
        }

        private Response UpdatePumpState(UpdatePumpStateDataRequest request)
        {
            var pumps = GasPumpsDataService.GasPumpsByStore[request.StoreNumber];
            if (pumps == null)
            {
                throw new DataValidationException(DataValidationErrors.Microsoft_Dynamics_Commerce_Runtime_ObjectNotFound);
            }

            var pump = pumps.First((p) => p.Id == request.PumpId);
            pump.State = request.State;
            if (pump.State.GasPumpStatus == GasPumpStatus.Pumping || pump.State.GasPumpStatus == GasPumpStatus.PumpingComplete)
            {
                pump.State.SaleTotal = GetSaleTotal(pump.State.SaleVolume);
            }

            return new UpdatePumpStateDataResponse(pump);
        }

        private static decimal GetSaleTotal(decimal saleVolume)
        {
            return Math.Round(GasPumpsDataService.COST_PER_UNIT * saleVolume, 3);
        }

        private Response GetGasPumps(GetGasPumpsDataRequest request)
        {
            var pumps = GasPumpsDataService.GasPumpsByStore[request.StoreNumber];
            if (pumps == null)
            {
                pumps = new List<GasPump>();
            }

            return new GetGasPumpsDataResponse(pumps);
        }

        private async Task InitializeGasPumps(Request request)
        {
            if (GasPumpsDataService.GasPumpsByStore != null)
            {
                return;
            }

            var gasScanInfo = new ScanInfo();
            gasScanInfo.ScannedText = GetGasolineItemId(request);
            var getScanResultRequest = new GetScanResultRequest(gasScanInfo);
            var response = await request.RequestContext.Runtime.ExecuteAsync<GetScanResultResponse>(getScanResultRequest, request.RequestContext);

            if (response.Result.MaskType == BarcodeMaskType.Item)
            {
                GasPumpsDataService.COST_PER_UNIT = response.Result.Product.BasePrice;
            }

            var orgUnits = await GetAllOrgUnitsAsync(request);
            GasPumpsByStore = new Dictionary<string, IEnumerable<GasPump>>();
            var itemId = GetGasolineItemId(request);
            if (orgUnits.Any())
            {
                foreach (var orgUnit in orgUnits)
                {
                    var gasPumps = CreateGasPumps(orgUnit);
                    GasPumpsByStore.Add(orgUnit.OrgUnitNumber, gasPumps);

                    var stationDetails = new GasStationDetails(orgUnit.OrgUnitNumber, itemId);
                    stationDetails.GasPumpCount = gasPumps.Count;
                    var daysSinceDelivery = (orgUnit.RecordId % 6) + 1;
                    stationDetails.LastGasDeliveryTime = DateTimeOffset.UtcNow.AddDays(daysSinceDelivery * -1);
                    var calculatedTime = DateTimeOffset.UtcNow.AddDays(7 - daysSinceDelivery).AddHours(orgUnit.RecordId % 8).AddMinutes(orgUnit.RecordId % 60);
                    stationDetails.NextGasDeliveryTime = new DateTimeOffset(calculatedTime.Year, calculatedTime.Month, calculatedTime.Day, calculatedTime.Hour, 0, 0, calculatedTime.Offset);
                    stationDetails.GasTankCapacity = stationDetails.GasPumpCount * 1000;
                    stationDetails.GasTankLevel = stationDetails.GasTankCapacity - (stationDetails.GasTankCapacity / 10 * daysSinceDelivery);
                    stationDetails.GasBasePrice = GasPumpsDataService.COST_PER_UNIT;
                    GasStations.Add(stationDetails);
                }
            }
        }

        private List<GasPump> CreateGasPumps(OrgUnit orgUnit)
        {
            var pumpCount = orgUnit.RecordId % 12;
            var gasPumps = new List<GasPump>();
            var saleAmountGenerator = new Random();
            for (int i = 1; i <= pumpCount; i++)
            {
                GasPumpStatus status = (GasPumpStatus)(((orgUnit.RecordId + i) % 5) + 1);
                var gasPump = new GasPump() { Id = i, Name = $"Gas Pump {i.ToString()}", State = new GasPumpState(status) };
                if (status == GasPumpStatus.Pumping)
                {
                    gasPump.State.SaleVolume = Math.Round(Convert.ToDecimal(saleAmountGenerator.NextDouble() * 25), 3);
                    gasPump.State.SaleTotal = GetSaleTotal(gasPump.State.SaleVolume);
                }

                gasPumps.Add(gasPump);
            }

            return gasPumps;
        }

        private Task<EntityDataServiceResponse<OrgUnit>> GetAllOrgUnitsAsync(Request request)
        {
            var orgUnitsRequest = new SearchOrgUnitDataRequest(new List<string>(), QueryResultSettings.AllRecords);
            return request.RequestContext.Runtime.ExecuteAsync<EntityDataServiceResponse<OrgUnit>>(orgUnitsRequest, request.RequestContext);
        }

        private string GetGasolineItemId(Request request)
        {
            if (request.RequestContext.Runtime.Configuration.Settings.TryGetValue("ext.Contoso.GasolineItemId", out string settingValue) && !string.IsNullOrWhiteSpace(settingValue))
            {
                return settingValue;
            }

            return DEFAULT_GASOLINE_ITEM_ID;
        }
    }
}
