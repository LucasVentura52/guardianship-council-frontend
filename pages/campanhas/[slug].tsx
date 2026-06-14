import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Icon from '../../components/Icon';
import PublicLayout from '../../components/PublicLayout';
import { useSiteConfig } from '../../lib/site-config';

type Campanha = { titulo: string; descricao_curta: string; conteudo: string; imagem?: string; data_publicacao?: string };

export default function DetalheCampanha({ campanha }: { campanha: Campanha }) {
  const config = useSiteConfig();
  return <PublicLayout title={campanha.titulo}>
    <section className="bg-gradient-to-br from-blue-700 to-cyan-500 text-white" style={campanha.imagem ? { backgroundImage: `linear-gradient(90deg, rgba(4,40,90,.95), rgba(4,40,90,.35)), url(${campanha.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}><div className="container-app py-20"><Link href="/campanhas" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/80">← Voltar para campanhas</Link><p className="text-xs font-bold uppercase tracking-widest text-white/70">Campanha de conscientização</p><h1 className="mt-3 max-w-3xl text-4xl font-extrabold sm:text-6xl">{campanha.titulo}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">{campanha.descricao_curta}</p></div></section>
    <article className="container-app grid gap-10 py-14 lg:grid-cols-[1fr_320px]"><div><h2 className="section-title">Sobre a campanha</h2><div className="mt-5 whitespace-pre-line leading-8 text-slate-600">{campanha.conteudo}</div></div><aside className="card h-fit p-6"><h3 className="font-extrabold">Precisa de ajuda?</h3><p className="mt-3 text-sm leading-6 text-slate-600">{config.disque_100_texto || 'O Disque 100 recebe denúncias gratuitamente, 24 horas por dia.'}</p><Link href="/como-acionar" className="btn-primary mt-5 w-full justify-center"><Icon name="phone" /> Como acionar</Link></aside></article>
  </PublicLayout>;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  try {
    const response = await fetch(`${base}/campanhas/${params?.slug}`);
    if (!response.ok) return { notFound: true };
    const body = await response.json();
    return { props: { campanha: body.data } };
  } catch {
    return { notFound: true };
  }
};
