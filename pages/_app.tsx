import NextApp, { AppContext, AppProps } from 'next/app';
import { SiteConfig, SiteConfigProvider } from '../lib/site-config';
import { getApiBaseUrl } from '../lib/api-base';
import '../styles/globals.css';

type Props = AppProps & { siteConfig: SiteConfig };

export default function App({ Component, pageProps, siteConfig }: Props) {
  return <SiteConfigProvider config={siteConfig}><Component {...pageProps} /></SiteConfigProvider>;
}

App.getInitialProps = async (context: AppContext) => {
  const appProps = await NextApp.getInitialProps(context);
  const base = getApiBaseUrl();
  let siteConfig: SiteConfig = {};

  try {
    const response = await fetch(`${base}/configuracoes`);
    if (response.ok) {
      const body = await response.json();
      siteConfig = body.data || {};
    }
  } catch {}

  return { ...appProps, siteConfig };
};
