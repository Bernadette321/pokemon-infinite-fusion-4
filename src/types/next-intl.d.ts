declare module 'next-intl/server' {
  export function getRequestConfig(config: any): any;
}

declare module 'next-intl' {
  export function useTranslations(namespace: string): (key: string) => string;
  export function useMessages(): any;
  export function NextIntlClientProvider(props: {
    locale: string;
    messages: any;
    children: React.ReactNode;
  }): JSX.Element;
} 