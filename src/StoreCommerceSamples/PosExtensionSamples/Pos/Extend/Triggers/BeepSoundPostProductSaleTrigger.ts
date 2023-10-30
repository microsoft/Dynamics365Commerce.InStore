import { IPostProductSaleTriggerOptions, PostProductSaleTrigger } from "PosApi/Extend/Triggers/ProductTriggers";

/**
 * Example implementation of a PostProductSale trigger that trigger beep sound.
 */
export default class BeepSoundPostProductSaleTrigger extends PostProductSaleTrigger {

    /**
     * Executes the trigger functionality.
     * @param {IPostProductSaleTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: IPostProductSaleTriggerOptions): Promise<void> {
        this.context.logger.logInformational("Executing BeepSoundPostProductSaleTrigger with options " + JSON.stringify(options) + ".");
        // You have to provide a full path to your resource file starting from the root of POS project.
        let resourcePath: string = "/Resources/audio/beep.wav";
        // And the apply it to the base URL of the extension package.
        let filePath: string = this.context.extensionPackageInfo.baseUrl + resourcePath;
        let beeper: HTMLAudioElement = new Audio(filePath);
        beeper.play();

        return Promise.resolve();
    }
}