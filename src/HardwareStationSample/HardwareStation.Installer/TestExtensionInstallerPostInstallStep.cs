namespace Contoso.HardwareStation.Installer
{
    using System.Threading.Tasks;
    using Microsoft.Dynamics.Commerce.Sdk.Installers;
    using Microsoft.Dynamics.Retail.Diagnostics;

    [ExtensionInstallerStepExecutionPosition(ExtensionInstallerStepExecutionPhase.PostInstall, 1)]
    public class TestExtensionInstallerPostInstallStep : IExtensionInstallerStep
    {
        private enum Events
        {
            ExecutingPostInstallStep,
            ConfigurationValueFound
        }
        public string Name { get; } = "TestExtensionInstallerPostInstallStep";

        public string DisplayName { get; } = "TestExtensionInstallerPostInstallStep";

        public string Description { get; } = "A sample extension installer step that is executed after the standard installation steps.";

        public Task Run(IExtensionInstallerStepContext context)
        {
            RetailLogger.Log.LogInformation(Events.ExecutingPostInstallStep, "************** Executing extension installer extension PostInstall step **************");

            context.PowerShellService.Run("echo 'About to print the value received from the PreInstallStep'");

            RetailLogger.Log.LogInformation(Events.ConfigurationValueFound, $"Found configuration value: {context.GetConfigurationValue(ConfigurationKeys.SampleKey)}");

            return Task.CompletedTask;
        }
    }
}
