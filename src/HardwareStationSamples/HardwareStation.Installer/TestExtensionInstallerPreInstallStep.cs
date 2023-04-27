namespace Contoso.HardwareStation.Installer
{
    using System.Threading.Tasks;
    using Microsoft.Dynamics.Commerce.Sdk.Installers;
    using Microsoft.Dynamics.Retail.Diagnostics;

    [ExtensionInstallerStepExecutionPosition(ExtensionInstallerStepExecutionPhase.PreInstall, 1)]
    public class TestExtensionInstallerPreInstallStep : IExtensionInstallerStep
    {
        private enum Events
        {
            ExecutingPreInstallStep
        }
        public string Name { get; } = "TestExtensionInstallerPreInstallStep";

        public string DisplayName { get; } = "TestExtensionInstallerPreInstallStep";

        public string Description { get; } = "A sample extension installer step that is executed before the standard installation steps.";

        public Task Run(IExtensionInstallerStepContext context)
        {
            RetailLogger.Log.LogInformation(Events.ExecutingPreInstallStep, "************** Executing extension installer extension PreInstall step **************");

            context.SetConfigurationValue(ConfigurationKeys.SampleKey, "SampleValueSetDuringPre-Install");

            return Task.CompletedTask;
        }
    }
}
