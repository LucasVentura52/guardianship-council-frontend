import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import Icon from '../../components/Icon';
import PageHero from '../../components/PageHero';
import PublicLayout from '../../components/PublicLayout';
import { getApiBaseUrl } from '../../lib/api-base';
import { resolvePublicImageUrl } from '../../lib/image-url';

type Noticia = { id: number; slug: string; titulo: string; resumo: string; data_publicacao?: string; imagem?: string };

export default function Noticias({ items }: { items: Noticia[] }) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => items.filter(item => `${item.titulo} ${item.resumo}`.toLowerCase().includes(search.toLowerCase())), [items, search]);

  return (
    <PublicLayout title="Notícias">
      <PageHero eyebrow="Acompanhe nossas ações" title="Notícias" description="Informações sobre atividades, campanhas e iniciativas da rede de proteção." icon="news" />
      <section className="container-app py-16">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div><p className="section-kicker">Informação atualizada</p><h2 className="section-title mt-2">Acontece na rede de proteção</h2></div>
          <label className="flex w-full max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
            <Icon name="search" className="text-slate-400" />
            <span className="sr-only">Buscar notícias</span>
            <input value={search} onChange={event => setSearch(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Buscar por título ou assunto..." />
          </label>
        </div>
        {search && <p className="mb-5 text-xs font-bold text-slate-500">{filtered.length} resultado(s) para “{search}”</p>}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><Icon name="search" size={34} className="mx-auto text-slate-300" /><p className="mt-4 text-sm text-slate-500">Nenhuma notícia encontrada.</p></div>}
          {filtered.map((item, index) => (
            <Link href={`/noticias/${item.slug}`} className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl" key={item.id}>
              <div className="overflow-hidden">{item.imagem ? <img className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" src={resolvePublicImageUrl(item.imagem)} alt="" /> : <div className={`h-52 bg-gradient-to-br ${['from-blue-100 to-emerald-100', 'from-orange-100 to-amber-50', 'from-violet-100 to-blue-100'][index % 3]}`} />}</div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-3"><span className="status bg-blue-50 text-blue-700">Notícia</span><time className="text-[11px] text-slate-400">{item.data_publicacao ? new Date(item.data_publicacao).toLocaleDateString('pt-BR') : ''}</time></div>
                <h2 className="mt-4 text-lg font-extrabold leading-7 transition group-hover:text-blue-700">{item.titulo}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{item.resumo}</p>
                <span className="mt-5 flex items-center gap-2 text-xs font-extrabold text-blue-600">Ler notícia <Icon name="arrow" size={16} className="transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const base = getApiBaseUrl();
  try {
    const response = await fetch(`${base}/noticias`);
    const data = response.ok ? await response.json() : { data: [] };
    return { props: { items: data.data || [] } };
  } catch {
    return { props: { items: [] } };
  }
};
