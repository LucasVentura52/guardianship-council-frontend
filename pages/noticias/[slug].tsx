import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Icon from '../../components/Icon';
import PublicLayout from '../../components/PublicLayout';

type Noticia = { titulo: string; resumo: string; conteudo: string; imagem?: string; data_publicacao?: string };

export default function DetalheNoticia({ noticia }: { noticia: Noticia }) {
  return (
    <PublicLayout title={noticia.titulo}>
      <article>
        <header className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-white via-blue-50/50 to-emerald-50/50">
          <div className="container-app max-w-5xl py-16 lg:py-20">
            <Link href="/noticias" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600"><span className="rotate-180"><Icon name="arrow" size={16} /></span>Todas as notícias</Link>
            <span className="status mt-8 block w-fit bg-blue-100 text-blue-700">Notícia</span>
            <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-[#11213e] sm:text-5xl">{noticia.titulo}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{noticia.resumo}</p>
            {noticia.data_publicacao && <p className="mt-6 flex items-center gap-2 text-sm text-slate-400"><Icon name="calendar" size={16} />Publicado em {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}</p>}
          </div>
        </header>
        <div className="container-app max-w-5xl py-14">
          {noticia.imagem && <img className="h-auto max-h-[560px] w-full rounded-3xl object-cover shadow-lg" src={noticia.imagem} alt="" />}
          <div className="mx-auto mt-10 max-w-3xl">
            <div className="whitespace-pre-line text-base leading-9 text-slate-700">{noticia.conteudo}</div>
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-7">
              <p className="text-sm font-bold text-slate-600">Continue acompanhando as ações da rede.</p>
              <Link href="/noticias" className="btn-secondary">Ver mais notícias <Icon name="arrow" size={16} /></Link>
            </div>
          </div>
        </div>
      </article>
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  try {
    const response = await fetch(`${base}/noticias/${params?.slug}`);
    if (!response.ok) return { notFound: true };
    const body = await response.json();
    return { props: { noticia: body.data } };
  } catch {
    return { notFound: true };
  }
};
