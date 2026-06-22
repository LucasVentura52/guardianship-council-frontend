import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Icon from '../../components/Icon';
import PageHero from '../../components/PageHero';
import PublicLayout from '../../components/PublicLayout';
import { getApiBaseUrl } from '../../lib/api-base';

type Campanha = { id: number; slug: string; titulo: string; descricao_curta: string; data_publicacao?: string; imagem?: string };

export default function Campanhas({ items }: { items: Campanha[] }) {
  return <PublicLayout title="Campanhas"><PageHero eyebrow="Mobilização social" title="Campanhas" description="Informação e participação transformam realidades. Conheça nossas ações de conscientização." icon="campaign" /><section className="container-app grid gap-6 py-14 sm:grid-cols-2">
    {items.length === 0 && <p className="col-span-full rounded-xl bg-white p-8 text-center text-slate-500">Nenhuma campanha publicada.</p>}
    {items.map((item, index) => <Link href={`/campanhas/${item.slug}`} key={item.id} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-xl"><div className={`flex min-h-56 flex-col justify-end bg-gradient-to-br ${['from-blue-600 to-cyan-500','from-orange-500 to-amber-400','from-violet-600 to-blue-500'][index % 3]} p-8 text-white`} style={item.imagem ? { backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.65), rgba(0,0,0,.05)), url(${item.imagem})`, backgroundSize: 'cover' } : undefined}><span className="text-3xl font-extrabold uppercase">{item.titulo}</span></div><div className="p-6"><span className="text-xs font-bold text-blue-600">{item.data_publicacao ? new Date(item.data_publicacao).toLocaleDateString('pt-BR') : 'Em andamento'}</span><p className="mt-3 text-sm leading-6 text-slate-600">{item.descricao_curta}</p><span className="mt-5 flex items-center gap-2 text-sm font-bold text-blue-600">Saiba mais <Icon name="arrow" size={17} /></span></div></Link>)}
  </section></PublicLayout>;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const base = getApiBaseUrl();
  try {
    const response = await fetch(`${base}/campanhas`);
    const data = response.ok ? await response.json() : { data: [] };
    return { props: { items: data.data || [] } };
  } catch {
    return { props: { items: [] } };
  }
};
