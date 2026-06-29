import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import PageHero from '../../components/PageHero';
import PublicLayout from '../../components/PublicLayout';
import { Skeleton } from '../../components/Skeleton';
import { resolvePublicImageUrl } from '../../lib/image-url';
import { Campanha, fetchCampanhas } from '../../lib/public-content';

export default function Campanhas() {
  const [items, setItems] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCampanhas()
      .then((data) => {
        if (!active) return;
        setItems(data);
        setError('');
      })
      .catch(() => {
        if (!active) return;
        setError('Não foi possível carregar as campanhas agora.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <PublicLayout title="Campanhas">
      <PageHero eyebrow="Mobilização social" title="Campanhas" description="Informação e participação transformam realidades. Conheça ações de conscientização e ajude a ampliar essa mensagem." icon="campaign" />
      <section className="container-app py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div><p className="section-kicker">Conscientização em ação</p><h2 className="section-title mt-2">Campanhas publicadas</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Cada campanha reúne informações que podem ser compartilhadas em escolas, famílias e espaços comunitários.</p></div>
          <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">{loading ? 'Carregando...' : `${items.length} ${items.length === 1 ? 'campanha' : 'campanhas'}`}</span>
        </div>
        {error && <p className="mb-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading && Array.from({ length: 6 }).map((_, index) => (
            <article key={index} className="card overflow-hidden">
              <Skeleton className="h-64 w-full rounded-none" />
              <div className="p-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-4 h-7 w-4/5" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-[90%]" />
              </div>
            </article>
          ))}
          {!loading && items.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><Icon name="campaign" size={34} className="mx-auto text-slate-300" /><p className="mt-4 text-sm text-slate-500">Nenhuma campanha publicada.</p></div>}
          {items.map((item, index) => (
            <Link href={`/campanhas/${item.slug}`} key={item.id} className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div
                className={`flex min-h-64 flex-col justify-end overflow-hidden bg-gradient-to-br ${['from-blue-700 to-cyan-500', 'from-orange-600 to-amber-400', 'from-violet-700 to-blue-500'][index % 3]} p-7 text-white`}
                style={item.imagem ? { backgroundImage: `linear-gradient(0deg, rgba(5,25,60,.88), rgba(5,25,60,.08)), url("${resolvePublicImageUrl(item.imagem)}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-white/65">Campanha de conscientização</span>
                <h2 className="mt-2 text-2xl font-extrabold uppercase leading-tight">{item.titulo}</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600"><Icon name="calendar" size={15} />{item.data_publicacao ? new Date(item.data_publicacao).toLocaleDateString('pt-BR') : 'Em andamento'}</div>
                <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">{item.descricao_curta}</p>
                <span className="mt-5 flex items-center gap-2 text-sm font-extrabold text-blue-600">Conhecer campanha <Icon name="arrow" size={17} className="transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
