declare module 'next-intl/server' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function getRequestConfig(config: any): any;
}

declare module 'next-intl' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useTranslations(namespace: string): (key: string) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useMessages(): any;
  export function NextIntlClientProvider(props: {
    locale: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: any;
    children: React.ReactNode;
  }): JSX.Element;
} 