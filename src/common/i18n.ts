import messages from '@/assets/_locales/zh_CN/messages.json';

type messagesKey = keyof typeof messages;

function i18n(messageName: messagesKey, substitutions?: string | string[] | undefined): string {
  return chrome.i18n.getMessage(messageName, substitutions);
}

export default i18n;
