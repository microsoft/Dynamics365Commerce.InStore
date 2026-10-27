namespace GasStation.CommerceRuntime
{
    using Microsoft.Dynamics.Commerce.Runtime;
    using Microsoft.Dynamics.Commerce.Runtime.DataModel;
    using Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts;
    using System.Threading.Tasks;

    /// <summary>
    /// The controller for gas pump operations.
    /// </summary>
    [RoutePrefix("GasPumps")]
    [BindEntity(typeof(GasPump))]
    public class GasPumpsController : IController
    {
        /// <summary>
        /// Gets the gas pumps for a given store.
        /// </summary>
        /// <param name="context">The endpoint context used to execute the data request.</param>
        /// <param name="StoreNumber">The store number for which to retrieve gas pumps.</param>
        /// <param name="queryResultSettings">The query result settings for the request.</param>
        /// <returns>The list of gas pumps for the store.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Device, CommerceRoles.Employee)]
        public async Task<PagedResult<GasPump>> GetGasPumpsByStore(IEndpointContext context, string StoreNumber, QueryResultSettings queryResultSettings)
        {
            var request = new GetGasPumpsDataRequest(StoreNumber);
            var response = await context.ExecuteAsync<GetGasPumpsDataResponse>(request).ConfigureAwait(false);
            return new PagedResult<GasPump>(response.GasPumps.AsReadOnly());
        }

        /// <summary>
        /// Gets gas station details for a given store.
        /// </summary>
        /// <param name="context">The endpoint context used to execute the data request.</param>
        /// <param name="StoreNumber">The store number for which to retrieve gas station details.</param>
        /// <returns>The gas station details for the store.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Device, CommerceRoles.Employee)]
        public async Task<GasStationDetails> GetGasStationDetailsByStore(IEndpointContext context, string StoreNumber)
        {
            var request = new GetGasStationDetailsDataRequest(StoreNumber);
            var response = await context.ExecuteAsync<GetGasStationDetailsDataResponse>(request).ConfigureAwait(false);
            return response.Details;
        }

        /// <summary>
        /// Stops all gas pumps for a given store.
        /// </summary>
        /// <param name="context">The endpoint context used to execute the data request.</param>
        /// <param name="StoreNumber">The store number for which to stop all gas pumps.</param>
        /// <returns>The updated list of gas pumps for the store.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Device, CommerceRoles.Employee)]
        public async Task<PagedResult<GasPump>> StopAllPumps(IEndpointContext context, string StoreNumber)
        {
            var request = new StopAllPumpsDataRequest(StoreNumber);
            var response = await context.ExecuteAsync<StopAllPumpsDataResponse>(request).ConfigureAwait(false);
            return new PagedResult<GasPump>(response.Pumps.AsReadOnly());
        }

        /// <summary>
        /// Starts all gas pumps for a given store.
        /// </summary>
        /// <param name="context">The endpoint context used to execute the data request.</param>
        /// <param name="StoreNumber">The store number for which to start all gas pumps.</param>
        /// <returns>The updated list of gas pumps for the store.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Device, CommerceRoles.Employee)]
        public async Task<PagedResult<GasPump>> StartAllPumps(IEndpointContext context, string StoreNumber)
        {
            var request = new StartAllPumpsDataRequest(StoreNumber);
            var response = await context.ExecuteAsync<StartAllPumpsDataResponse>(request).ConfigureAwait(false);
            return new PagedResult<GasPump>(response.Pumps.AsReadOnly());
        }

        /// <summary>
        /// Updates the state of a gas pump for a given store.
        /// </summary>
        /// <param name="context">The endpoint context used to execute the data request.</param>
        /// <param name="StoreNumber">The store number that contains the gas pump.</param>
        /// <param name="id">The gas pump identifier.</param>
        /// <param name="state">The gas pump state to apply.</param>
        /// <returns>The updated gas pump.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Device, CommerceRoles.Employee)]
        public async Task<GasPump> UpdatePumpState(IEndpointContext context, string StoreNumber, long id, GasPumpState state)
        {
            var request = new UpdatePumpStateDataRequest(StoreNumber, id, state);
            var response = await context.ExecuteAsync<UpdatePumpStateDataResponse>(request).ConfigureAwait(false);
            return response.Pump;
        }
    }
}
