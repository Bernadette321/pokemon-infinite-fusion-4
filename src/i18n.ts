import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}: {locale: string}) => {
  const commonMessages = (await import(`./locales/${locale}/common.json`)).default;
  const installGuideMessages = (await import(`./locales/${locale}/install-guide.json`)).default;

  return {
    messages: {
      ...commonMessages,
      ...installGuideMessages
    }
  };
}); 