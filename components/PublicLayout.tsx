import Head from 'next/head';
import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import { useSiteConfig } from '../lib/site-config';

export default function PublicLayout({ children, title = 'Conselho Tutelar' }: { children: ReactNode; title?: string }) {
  const config = useSiteConfig();
  const siteName = config.nome_site || 'Conselho Tutelar';
  return (
    <>
      <Head>
        <title>{title} | {siteName}</title>
        <meta name="description" content={config.descricao || 'Informação, orientação e proteção dos direitos de crianças e adolescentes.'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
