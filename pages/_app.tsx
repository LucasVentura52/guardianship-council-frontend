import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AdminFeedbackProvider } from '../components/AdminFeedback';
import { SiteConfig, SiteConfigProvider } from '../lib/site-config';
import { getApiBaseUrl } from '../lib/api-base';
import '../styles/globals.css';

type PageProps = {
  siteConfig?: SiteConfig;
};

type Props = AppProps<PageProps>;

export default function App({ Component, pageProps }: Props) {
  const router = useRouter();
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(pageProps.siteConfig || {});

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

      const base = getApiBaseUrl();
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

  useEffect(() => {
    let active = true;

    async function loadSiteConfig() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/configuracoes`);
        if (!response.ok) return;

        const body = await response.json();
        if (active) {
          setSiteConfig(body.data || {});
        }
      } catch {}
    }

    void loadSiteConfig();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminFeedbackProvider>
      <SiteConfigProvider config={siteConfig}>
        <Head>
          <link rel="icon" type="image/jpeg" href="/images/logo-conselho.jpeg" />
          <link rel="apple-touch-icon" href="/images/logo-conselho.jpeg" />
        </Head>
        <Component {...pageProps} />
      </SiteConfigProvider>
    </AdminFeedbackProvider>
  );
}
