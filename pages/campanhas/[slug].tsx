import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Icon from '../../components/Icon';
import PublicLayout from '../../components/PublicLayout';
import { useSiteConfig } from '../../lib/site-config';

type Campanha = { titulo: string; descricao_curta: string; conteudo: string; imagem?: string; data_publicacao?: string };

export default function DetalheCampanha({ campanha }: { campanha: Campanha }) {
  const config = useSiteConfig();

  return (
    <PublicLayout title={campanha.titulo}>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-800 to-cyan-600 text-white" style={campanha.imagem ? { backgroundImage: `linear-gradient(90deg, rgba(4,31,76,.97), rgba(4,40,90,.45)), url(${campanha.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
        <div className="container-app relative py-20 lg:py-28">
          <Link href="/campanhas" className="mb-9 inline-flex items-center gap-2 text-sm font-bold text-white/75 transition hover:text-white"><span className="rotate-180"><Icon name="arrow" size={17} /></span>Voltar para campanhas</Link>
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-emerald-300">Campanha de conscientização</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight sm:text-6xl">{campanha.titulo}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">{campanha.descricao_curta}</p>
          {campanha.data_publicacao && <p className="mt-6 flex items-center gap-2 text-xs font-bold text-white/60"><Icon name="calendar" size={15} />Publicada em {new Date(campanha.data_publicacao).toLocaleDateString('pt-BR')}</p>}
        </div>
      </section>
      <article className="container-app grid gap-10 py-16 lg:grid-cols-[1fr_340px]">
        <div className="card p-7 sm:p-10">
          <p className="section-kicker">Sobre a campanha</p>
          <h2 className="section-title mt-2">Informação para compartilhar</h2>
          <div className="mt-7 whitespace-pre-line text-base leading-8 text-slate-600">{campanha.conteudo}</div>
        </div>
        <aside className="grid h-fit gap-5 lg:sticky lg:top-28">
          <div className="card p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><Icon name="phone" /></span><h3 className="mt-5 font-extrabold">Precisa de ajuda?</h3><p className="mt-3 text-sm leading-7 text-slate-600">{config.disque_100_texto || 'O Disque 100 recebe denúncias gratuitamente, 24 horas por dia.'}</p><Link href="/como-acionar" className="btn-primary mt-5 w-full justify-center"><Icon name="phone" /> Como acionar</Link></div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6"><h3 className="font-extrabold text-blue-900">Ajude a conscientizar</h3><p className="mt-2 text-xs leading-6 text-blue-800">Converse sobre este tema em sua família, escola e comunidade. Informação pode prevenir violações.</p></div>
        </aside>
      </article>
    </PublicLayout>
  );
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
