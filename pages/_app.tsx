import NextApp, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SiteConfig, SiteConfigProvider } from '../lib/site-config';
import { getApiBaseUrl } from '../lib/api-base';
import '../styles/globals.css';

type Props = AppProps & { siteConfig: SiteConfig };

export default function App({ Component, pageProps, siteConfig }: Props) {
  const router = useRouter();

  useEffect(() => {
    function track(url: string) {
      const caminho = url.split('?')[0] || '/';
      if (caminho.startsWith('/admin')) return;

      try {
        const key = `visita:${caminho}`;
        const ultimaVisita = Number(sessionStorage.getItem(key) || 0);
        if (Date.now() - ultimaVisita < 30_000) return;
        sessionStorage.setItem(key, String(Date.now()));
      } catch {}

      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      void fetch(`${base}/visitas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caminho }),
        keepalive: true,
      }).catch(() => undefined);
    }

    if (router.isReady) track(router.asPath);
    router.events.on('routeChangeComplete', track);
    return () => router.events.off('routeChangeComplete', track);
  }, [router.asPath, router.events, router.isReady]);

  return (
    <SiteConfigProvider config={siteConfig}>
      <Head>
        <link rel="icon" type="image/jpeg" href="/images/logo-conselho.jpeg" />
        <link rel="apple-touch-icon" href="/images/logo-conselho.jpeg" />
      </Head>
      <Component {...pageProps} />
    </SiteConfigProvider>
  );
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
