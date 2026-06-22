import { GetServerSideProps } from 'next';
import Link from 'next/link';
import PublicLayout from '../../components/PublicLayout';
import { getApiBaseUrl } from '../../lib/api-base';

type Noticia = { titulo: string; resumo: string; conteudo: string; imagem?: string; data_publicacao?: string };

export default function DetalheNoticia({ noticia }: { noticia: Noticia }) {
  return <PublicLayout title={noticia.titulo}><article><header className="border-b border-slate-200 bg-white"><div className="container-app max-w-4xl py-16"><Link href="/noticias" className="text-sm font-bold text-blue-600">← Todas as notícias</Link><span className="status mt-8 block w-fit bg-blue-50 text-blue-700">Notícia</span><h1 className="page-title mt-4">{noticia.titulo}</h1><p className="mt-5 text-lg leading-8 text-slate-600">{noticia.resumo}</p>{noticia.data_publicacao && <p className="mt-5 text-sm text-slate-400">Publicado em {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}</p>}</div></header><div className="container-app max-w-4xl py-12">{noticia.imagem && <img className="h-auto max-h-[520px] w-full rounded-2xl object-cover" src={noticia.imagem} alt="" />}<div className="mt-10 whitespace-pre-line text-base leading-8 text-slate-600">{noticia.conteudo}</div></div></article></PublicLayout>;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const base = getApiBaseUrl();
  try {
    const response = await fetch(`${base}/noticias/${params?.slug}`);
    if (!response.ok) return { notFound: true };
    const body = await response.json();
    return { props: { noticia: body.data } };
  } catch {
    return { notFound: true };
  }
};
