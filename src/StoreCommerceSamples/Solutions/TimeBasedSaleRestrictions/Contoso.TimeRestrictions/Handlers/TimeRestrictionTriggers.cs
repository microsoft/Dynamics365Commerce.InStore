/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.TimeRestrictions.Handlers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Contoso.TimeRestrictions.Services;
    using Microsoft.Dynamics.Commerce.Runtime;
    using Microsoft.Dynamics.Commerce.Runtime.DataModel;
    using Microsoft.Dynamics.Commerce.Runtime.Messages;
    using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

    /// <summary>
    /// CRT triggers that validate time-based sales restrictions when adding items and during cart calculation.
    /// This pattern avoids replacing built-in handlers and keeps customization minimal.
    /// </summary>
    public sealed class TimeRestrictionTriggers : IRequestTriggerAsync
    {
        /// <summary>
        /// Gets the supported request types for the time restriction triggers.
        /// </summary>
        public IEnumerable<Type> SupportedRequestTypes => new[]
        {
            typeof(AddCartLinesRequest),
            typeof(UpdateCartLinesRequest),
            typeof(SaveCartRequest),
            typeof(CalculateSalesTransactionServiceRequest)
        };

        /// <summary>
        /// Runs after supported requests are executed.
        /// </summary>
        /// <param name="request">The request that was executed.</param>
        /// <param name="response">The response returned by the request.</param>
        public Task OnExecuted(Request request, Response response)
        {
            // No-op after execution
            return Task.CompletedTask;
        }

        /// <summary>
        /// Validates time-based sales restrictions before supported requests are executed.
        /// </summary>
        /// <param name="request">The request to validate.</param>
        public async Task OnExecuting(Request request)
        {
            ThrowIf.Null(request, nameof(request));
            var context = request.RequestContext;
            var cfgProvider = new TimeRestrictionConfigProvider(context);
            var timeSvc = new ChannelTimeService(context);

            if (request is AddCartLinesRequest addReq)
            {
                if (addReq.CartLines != null)
                {
                    foreach (var line in addReq.CartLines)
                    {
                        await ValidateAddAsync(line, context, cfgProvider, timeSvc).ConfigureAwait(false);
                    }
                }
            }
            else if (request is UpdateCartLinesRequest updateReq)
            {
                if (updateReq.CartLines != null)
                {
                    foreach (var line in updateReq.CartLines)
                    {
                        await ValidateAddAsync(line, context, cfgProvider, timeSvc).ConfigureAwait(false);
                    }
                }
            }
            else if (request is SaveCartRequest saveReq)
            {
                await ValidateCartAsync(saveReq.Cart, context, cfgProvider, timeSvc).ConfigureAwait(false);
            }
            else if (request is CalculateSalesTransactionServiceRequest calcReq)
            {
                await ValidateCartAsync(calcReq.Transaction, context, cfgProvider, timeSvc).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Validates that a cart line being added or updated is not restricted by time-based rules.
        /// </summary>
        /// <param name="cartLine">The cart line to validate.</param>
        /// <param name="context">The request context.</param>
        /// <param name="cfgProvider">The configuration provider for time restrictions.</param>
        /// <param name="timeSvc">The time service for getting channel-local time.</param>
        /// <exception cref="CommerceException">Thrown when the product is restricted at the current time.</exception>
        private static async Task ValidateAddAsync(CartLine cartLine, RequestContext context, TimeRestrictionConfigProvider cfgProvider, ChannelTimeService timeSvc)
        {
            if (cartLine == null || cartLine.IsVoided || cartLine.Quantity <= 0 || cartLine.Quantity < 0)
            {
                return;
            }

            var channelId = context.GetChannelConfiguration().RecordId;
            var nowLocal = await timeSvc.GetNowInChannelLocalTimeAsync().ConfigureAwait(false);

            var rule = await cfgProvider.GetRestrictionForProductAsync(cartLine.ProductId, channelId).ConfigureAwait(false);
            if (rule != null && rule.IsRestricted(nowLocal))
            {
                var message = cfgProvider.GetLocalizedBlockedMessage(cartLine, nowLocal, rule);
                throw new CommerceException("TimeRestrictionBlocked", message)
                {
                    LocalizedMessage = message
                };
            }
        }

        /// <summary>
        /// Validates that all cart lines in a cart are not restricted by time-based rules.
        /// </summary>
        /// <param name="cart">The cart to validate.</param>
        /// <param name="context">The request context.</param>
        /// <param name="cfgProvider">The configuration provider for time restrictions.</param>
        /// <param name="timeSvc">The time service for getting channel-local time.</param>
        /// <exception cref="CommerceException">Thrown when any product in the cart is restricted at the current time.</exception>
        private static async Task ValidateCartAsync(Cart cart, RequestContext context, TimeRestrictionConfigProvider cfgProvider, ChannelTimeService timeSvc)
        {
            if (cart == null || cart.CartLines == null) return;

            var channelId = context.GetChannelConfiguration().RecordId;
            var nowLocal = await timeSvc.GetNowInChannelLocalTimeAsync().ConfigureAwait(false);

            foreach (var line in cart.CartLines.Where(l => l != null && !l.IsVoided && l.Quantity > 0))
            {
                var rule = await cfgProvider.GetRestrictionForProductAsync(line.ProductId, channelId).ConfigureAwait(false);
                if (rule != null && rule.IsRestricted(nowLocal))
                {
                    var message = cfgProvider.GetLocalizedBlockedMessage(line, nowLocal, rule);
                    throw new CommerceException("TimeRestrictionBlockedAtCheckout", message)
                    {
                        LocalizedMessage = message
                    };
                }
            }
        }

        /// <summary>
        /// Validates that all lines in a sales transaction are not restricted by time-based rules.
        /// </summary>
        /// <param name="transaction">The sales transaction to validate.</param>
        /// <param name="context">The request context.</param>
        /// <param name="cfgProvider">The configuration provider for time restrictions.</param>
        /// <param name="timeSvc">The time service for getting channel-local time.</param>
        /// <exception cref="CommerceException">Thrown when any product in the transaction is restricted at the current time.</exception>
        private static async Task ValidateCartAsync(SalesTransaction transaction, RequestContext context, TimeRestrictionConfigProvider cfgProvider, ChannelTimeService timeSvc)
        {
            if (transaction == null || transaction.SalesLines == null) return;

            var channelId = context.GetChannelConfiguration().RecordId;
            var nowLocal = await timeSvc.GetNowInChannelLocalTimeAsync().ConfigureAwait(false);

            foreach (var line in transaction.SalesLines.Where(l => l != null && !l.IsVoided && l.Quantity > 0))
            {
                var rule = await cfgProvider.GetRestrictionForProductAsync(line.ProductId, channelId).ConfigureAwait(false);
                if (rule != null && rule.IsRestricted(nowLocal))
                {
                    // Create a temporary CartLine for messaging
                    var cartLine = new CartLine
                    {
                        ProductId = line.ProductId,
                        Description = line.Description
                    };

                    var message = cfgProvider.GetLocalizedBlockedMessage(cartLine, nowLocal, rule);
                    throw new CommerceException("TimeRestrictionBlockedAtCheckout", message)
                    {
                        LocalizedMessage = message
                    };
                }
            }
        }
    }
}
