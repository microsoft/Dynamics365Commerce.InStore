namespace GasStationSample.CommerceRuntime
{
    using Microsoft.Dynamics.Commerce.Runtime;
    using Microsoft.Dynamics.Commerce.Runtime.DataModel;
    using Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts;
    using System.Threading.Tasks;

    /// <summary>
    /// The controller to retrieve a new entity.
    /// </summary>
    [RoutePrefix("GasPumps")]
    [BindEntity(typeof(GasPump))]
    public class GasPumpsController : IController
    {
        /// <summary>
        /// Gets the store hours for a given store.
        /// </summary>
        /// <param name="parameters">The parameters to this action.</param>
        /// <returns>The list of store hours.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Device, CommerceRoles.Employee)]
        public async Task<PagedResult<GasPump>> GetGasPumpsByStore(IEndpointContext context, string StoreNumber, QueryResultSettings queryResultSettings)
        {
            var request = new GetGasPumpsDataRequest(StoreNumber);
            var response = await context.ExecuteAsync<GetGasPumpsDataResponse>(request).ConfigureAwait(false);
            return new PagedResult<GasPump>(response.GasPumps.AsReadOnly());
        }

        /// <summary>
        /// Gets the store hours for a given store.
        /// </summary>
        /// <param name="parameters">The parameters to this action.</param>
        /// <returns>The list of store hours.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Device, CommerceRoles.Employee)]
        public async Task<GasStationDetails> GetGasStationDetailsByStore(IEndpointContext context, string StoreNumber)
        {
            var request = new GetGasStationDetailsDataRequest(StoreNumber);
            var response = await context.ExecuteAsync<GetGasStationDetailsDataResponse>(request).ConfigureAwait(false);
            return response.Details;
        }

        /// <summary>
        /// Gets the store hours for a given store.
        /// </summary>
        /// <param name="parameters">The parameters to this action.</param>
        /// <returns>The list of store hours.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Device, CommerceRoles.Employee)]
        public async Task<PagedResult<GasPump>> StopAllPumps(IEndpointContext context, string StoreNumber)
        {
            var request = new StopAllPumpsDataRequest(StoreNumber);
            var response = await context.ExecuteAsync<StopAllPumpsDataResponse>(request).ConfigureAwait(false);
            return new PagedResult<GasPump>(response.Pumps.AsReadOnly());
        }

        /// <summary>
        /// Gets the store hours for a given store.
        /// </summary>
        /// <param name="parameters">The parameters to this action.</param>
        /// <returns>The list of store hours.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Device, CommerceRoles.Employee)]
        public async Task<PagedResult<GasPump>> StartAllPumps(IEndpointContext context, string StoreNumber)
        {
            var request = new StartAllPumpsDataRequest(StoreNumber);
            var response = await context.ExecuteAsync<StartAllPumpsDataResponse>(request).ConfigureAwait(false);
            return new PagedResult<GasPump>(response.Pumps.AsReadOnly());
        }

        /// <summary>
        /// Gets the store hours for a given store.
        /// </summary>
        /// <param name="parameters">The parameters to this action.</param>
        /// <returns>The list of store hours.</returns>
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
