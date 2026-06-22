import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Icon from '../../components/Icon';
import PageHero from '../../components/PageHero';
import PublicLayout from '../../components/PublicLayout';

type Campanha = { id: number; slug: string; titulo: string; descricao_curta: string; data_publicacao?: string; imagem?: string };

export default function Campanhas({ items }: { items: Campanha[] }) {
  return (
    <PublicLayout title="Campanhas">
      <PageHero eyebrow="Mobilização social" title="Campanhas" description="Informação e participação transformam realidades. Conheça ações de conscientização e ajude a ampliar essa mensagem." icon="campaign" />
      <section className="container-app py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div><p className="section-kicker">Conscientização em ação</p><h2 className="section-title mt-2">Campanhas publicadas</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Cada campanha reúne informações que podem ser compartilhadas em escolas, famílias e espaços comunitários.</p></div>
          <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">{items.length} {items.length === 1 ? 'campanha' : 'campanhas'}</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><Icon name="campaign" size={34} className="mx-auto text-slate-300" /><p className="mt-4 text-sm text-slate-500">Nenhuma campanha publicada.</p></div>}
          {items.map((item, index) => (
            <Link href={`/campanhas/${item.slug}`} key={item.id} className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div
                className={`flex min-h-64 flex-col justify-end overflow-hidden bg-gradient-to-br ${['from-blue-700 to-cyan-500', 'from-orange-600 to-amber-400', 'from-violet-700 to-blue-500'][index % 3]} p-7 text-white`}
                style={item.imagem ? { backgroundImage: `linear-gradient(0deg, rgba(5,25,60,.88), rgba(5,25,60,.08)), url(${item.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
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

export const getServerSideProps: GetServerSideProps = async () => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  try {
    const response = await fetch(`${base}/campanhas`);
    const data = response.ok ? await response.json() : { data: [] };
    return { props: { items: data.data || [] } };
  } catch {
    return { props: { items: [] } };
  }
};
