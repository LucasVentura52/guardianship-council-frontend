import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import Icon from '../../components/Icon';
import PageHero from '../../components/PageHero';
import PublicLayout from '../../components/PublicLayout';
import { getApiBaseUrl } from '../../lib/api-base';

type Noticia = { id: number; slug: string; titulo: string; resumo: string; data_publicacao?: string; imagem?: string };

export default function Noticias({ items }: { items: Noticia[] }) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => items.filter(item => `${item.titulo} ${item.resumo}`.toLowerCase().includes(search.toLowerCase())), [items, search]);
  return <PublicLayout title="Notícias"><PageHero eyebrow="Acompanhe nossas ações" title="Notícias" description="Informações sobre atividades, campanhas e iniciativas da rede de proteção." icon="news" /><section className="container-app py-14"><div className="mb-8 flex max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"><Icon name="search" className="text-slate-400" /><input value={search} onChange={event => setSearch(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Buscar notícias..." /></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {filtered.length === 0 && <p className="col-span-full rounded-xl bg-white p-8 text-center text-slate-500">Nenhuma notícia encontrada.</p>}
    {filtered.map((item, index) => <Link href={`/noticias/${item.slug}`} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-xl" key={item.id}>{item.imagem ? <img className="h-48 w-full object-cover" src={item.imagem} alt="" /> : <div className={`h-48 bg-gradient-to-br ${['from-blue-200 to-emerald-200', 'from-orange-200 to-amber-100', 'from-violet-200 to-blue-200'][index % 3]}`} />}<div className="p-6"><span className="status bg-blue-50 text-blue-700">Notícia</span><h2 className="mt-4 text-lg font-extrabold leading-7">{item.titulo}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{item.resumo}</p><div className="mt-5 flex items-center justify-between text-xs text-slate-400"><span>{item.data_publicacao ? new Date(item.data_publicacao).toLocaleDateString('pt-BR') : ''}</span><Icon name="arrow" className="text-blue-600" /></div></div></Link>)}
  </div></section></PublicLayout>;
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
