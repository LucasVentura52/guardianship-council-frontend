import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import PublicLayout from '../../components/PublicLayout';
import { Skeleton } from '../../components/Skeleton';
import { resolvePublicImageUrl } from '../../lib/image-url';
import { fetchNoticia, Noticia } from '../../lib/public-content';

export default function DetalheNoticia() {
  const router = useRouter();
  const slug = typeof router.query.slug === 'string' ? router.query.slug : '';
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!router.isReady || !slug) return;

    let active = true;
    setLoading(true);
    fetchNoticia(slug)
      .then((data) => {
        if (!active) return;
        setNoticia(data);
        setError('');
      })
      .catch(() => {
        if (!active) return;
        setError('Não foi possível carregar esta notícia.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router.isReady, slug]);

  return (
    <PublicLayout title={noticia?.titulo || 'Notícia'}>
      <article>
        <header className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-white via-blue-50/50 to-emerald-50/50">
          <div className="container-app max-w-5xl py-16 lg:py-20">
            <Link href="/noticias" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600"><span className="rotate-180"><Icon name="arrow" size={16} /></span>Todas as notícias</Link>
            <span className="status mt-8 block w-fit bg-blue-100 text-blue-700">Notícia</span>
            {loading ? (
              <>
                <Skeleton className="mt-4 h-14 w-full max-w-4xl" />
                <Skeleton className="mt-6 h-6 w-full max-w-3xl" />
                <Skeleton className="mt-2 h-6 w-3/4 max-w-3xl" />
              </>
            ) : (
              <>
                <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-[#11213e] sm:text-5xl">{noticia?.titulo || 'Notícia indisponível'}</h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{noticia?.resumo || 'Não foi possível carregar os detalhes desta notícia.'}</p>
                {noticia?.data_publicacao && <p className="mt-6 flex items-center gap-2 text-sm text-slate-400"><Icon name="calendar" size={16} />Publicado em {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}</p>}
              </>
            )}
          </div>
        </header>
        <div className="container-app max-w-5xl py-14">
          {loading ? <Skeleton className="h-[360px] w-full rounded-3xl" /> : noticia?.imagem && <img className="h-auto max-h-[560px] w-full rounded-3xl object-cover shadow-lg" src={resolvePublicImageUrl(noticia.imagem)} alt="" />}
          <div className="mx-auto mt-10 max-w-3xl">
            {error && !loading && <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
            {loading ? (
              <>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="mt-3 h-5 w-[96%]" />
                <Skeleton className="mt-3 h-5 w-[92%]" />
                <Skeleton className="mt-3 h-5 w-[88%]" />
              </>
            ) : (
              <div className="whitespace-pre-line text-base leading-9 text-slate-700">{noticia?.conteudo || 'Conteúdo indisponível no momento.'}</div>
            )}
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
