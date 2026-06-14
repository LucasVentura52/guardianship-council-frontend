import Head from 'next/head';
import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

export default function PublicLayout({ children, title = 'Conselho Tutelar' }: { children: ReactNode; title?: string }) {
  return (
    <>
      <Head>
        <title>{title} | Conselho Tutelar</title>
        <meta name="description" content="Informação, orientação e proteção dos direitos de crianças e adolescentes." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
