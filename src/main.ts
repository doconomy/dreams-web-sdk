import MessageHandler, { ClientCallbacks } from './messageHandler';
import { createForm, createIFrame, iframeName } from './util';
import {
  IdTokenDidExpireEvent,
  AccountProvisionRequestedEvent,
  AccountRequestedEvent,
  AccountRequestedFailedMessage,
  AccountRequestedSucceededMessage,
  InvestmentAccountProvisionRequestedEvent,
  InvestmentSellRequestedEvent,
  ExitRequestedEvent,
  ShareEvent,
  DreamsEvent,
  Message,
  ShareMessage,
  TransferConsentRequestedEvent,
  InvestmentAccountProvisionRequestedMessage,
  InvestmentSellRequestedMessage,
  UpdateTokenMessage,
  NavigateToEvent,
  AccountProvisionInitiatedEvent,
  InvestmentAccountProvisionInitiatedEvent,
  UpdateTokenEvent,
  PartnerEvent,
} from './events';
/**
 * DreamSDK is an utility class responsible for setting up and listening
 * to messages being exchanged between the your context and Dreams iframe.
 *
 * ```typescript
 * const sdk = new DreamsSDK('https://dreams.api.endpoint');
 * sdk.setup(callbacks);
 * sdk.start(jwk_token, locale);
 * ```
 */
export default class DreamsSDK {
  apiUrl: string;
  form?: HTMLFormElement;
  iframe?: HTMLIFrameElement;
  messageHandler?: MessageHandler;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  /**
   * @param callbacks as time goes this object might contain more keys. Think about that when writing your code.
   * @param containerId you are free to specify your value if that's needed. Otherwise, leave the default.
   * @param iframeClassName if you want the iframe to have a specific class, you can do it via this param.
   */
  setup(
    callbacks: ClientCallbacks,
    containerId: string = 'dreams-web-sdk-container',
    iframeClassName: string = iframeName,
  ) {
    if (!this.apiUrl) throw Error('there is no api url specified!');

    const dreamDiv = document.getElementById(containerId);

    if (!dreamDiv) throw Error("can't find dreams web sdk container");

    const formTargetUrl = `${this.apiUrl}/users/verify_token`;

    this.form = createForm(formTargetUrl);
    this.iframe = createIFrame(iframeClassName);

    dreamDiv.appendChild(this.form);
    dreamDiv.appendChild(this.iframe);

    this.messageHandler = new MessageHandler(this.iframe, this.apiUrl, callbacks);

    return this.messageHandler;
  }

  /**
   * @param token jwk token for the user
   * @param locale determines the localization configuration that will be applied.
   * @param location path to which the user will be redirected to after the token is verified
   * @param theme determines the color theme that will be applied to the app
   */
  start(token: string, locale: string, location?: string, theme?: string) {
    if (!this.iframe) throw Error('there is no iframe specified!');
    if (!this.form) throw Error('there is no form specified!');
    if (!this.messageHandler) throw Error('there is no message handler specified!');

    const tokenInput: HTMLInputElement | null = this.form.querySelector("input[name='token']") as HTMLInputElement;

    if (tokenInput) tokenInput.setAttribute('value', token);

    const localeInput: HTMLInputElement = this.form.querySelector(
      "input[name='locale']",
    ) as unknown as HTMLInputElement;

    if (localeInput) localeInput.setAttribute('value', locale);

    const locationInput: HTMLInputElement = this.form.querySelector(
      "input[name='location']",
    ) as unknown as HTMLInputElement;
    if (location) locationInput.setAttribute('value', location);

    const themeInput: HTMLInputElement = this.form.querySelector("input[name='theme']") as unknown as HTMLInputElement;
    if (theme) themeInput.setAttribute('value', theme);

    this.messageHandler.listen();
    this.form.submit();
  }
}

export {
  MessageHandler,
  IdTokenDidExpireEvent,
  AccountProvisionRequestedEvent,
  AccountRequestedEvent,
  AccountRequestedFailedMessage,
  AccountRequestedSucceededMessage,
  InvestmentAccountProvisionRequestedEvent,
  InvestmentSellRequestedEvent,
  ExitRequestedEvent,
  ShareEvent,
  DreamsEvent,
  Message,
  ShareMessage,
  InvestmentAccountProvisionRequestedMessage,
  InvestmentSellRequestedMessage,
  UpdateTokenMessage,
  NavigateToEvent,
  AccountProvisionInitiatedEvent,
  InvestmentAccountProvisionInitiatedEvent,
  TransferConsentRequestedEvent,
  UpdateTokenEvent,
  PartnerEvent,
  ClientCallbacks,
};
